<template>
  <div class="w-full h-full flex-grow"> <!-- Adjust the container with Tailwind classes -->
    <canvas ref="lineChart" id="lineChart"></canvas>
  </div>
</template>

<script setup>
import { Chart } from 'chart.js';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import moment from 'moment';
import { data } from 'autoprefixer';
ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  chartStatistics: {
    type: Object
  }
})

const isTime = ref(false)

function timeToSeconds(time) {
  const duration = moment.duration(time) // Parse the time string
  return duration.asSeconds()  // Convert to total seconds
}

function secondsToTimeFormat(value) {
  // Convert seconds back to HH:mm:ss for display on y-axis
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor(value % 60);
  return hours + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');        
}

const timeFormatRegex = /^(\d{1,}):([0-5]?\d):([0-5]?\d)\.?\d*$/;

// Function to check if the string is a valid time format and duration
function isTimeFormat(time) {
  // Check format with regex
  if (!timeFormatRegex.test(time)) {
    return false;
  }
  
  // Use moment.duration to check if the string can be parsed
  const duration = moment.duration(time);
  return duration.isValid();
}

// Chart Data
const chartData = ref({
    labels: [],
    datasets: [
        {
          tension: 0.3,
          pointRadius: 0,
          label: 'Data One',
          borderColor: '#00306E',
          backgroundColor: '#00306E',
          fill: false,
          data: []
        },
    ]
})

// Chart Options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false, // Allow chart to fill its container
  plugins: {
    legend: {
      display: true
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart'
    },
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
          const datasetLabel = tooltipItem.dataset.label || '';
          const value = tooltipItem.raw
          //check if value is in seconds format
          if(isTime.value) return `${datasetLabel}: ${secondsToTimeFormat(value)}`
          return `${datasetLabel}: ${value}`
        }
      }
    }
  },
  interaction: {
    intersect: false
  },
  scales: {
    y: {
      ticks: {
        color: "#b6baca",
        callback: function(value) {
          //check if value is Time
          if(isTime.value) return secondsToTimeFormat(value)
          return value
        }
      },
      grid: {
        drawTicks: false,
      },
      border: {
        dash: [5, 10],
      },
    },
    x: {
      ticks: {
        autoSkip: true,       // Automatically skip some labels
        maxTicksLimit: 7, 
        color: "#b6baca",
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
})

// Reference to the chart instance
const lineChart = ref(null);

const initChart = () => {
  new Chart(lineChart.value, { type: "line", options: chartOptions.value, data: chartData.value })
}

// Function to force chart resize
const resizeChart = () => {
  if (lineChart.value) {
    const chartInstance = Chart.getChart(lineChart.value)
    if (chartInstance) {
      chartInstance.destroy()
      initChart()
    }
  }
};

// Add event listener for resizing
onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart);
});

// Remove event listener when component is destroyed
onBeforeMount(() => {
  window.removeEventListener('resize', resizeChart);
});

// Watch for changes in props and update the chart
watch(() => props.chartStatistics, (newStatistics) => {
  if (lineChart.value) {
    //convert statistics to chart js format
    isTime.value = newStatistics.isTime
    chartData.value.labels = newStatistics.labels
    chartData.value.datasets = newStatistics.datasets.map(dataset => (
      {   
        tension: 0.3,
        pointRadius: 0,
        label: dataset.label,
        borderColor: dataset.color,
        backgroundColor: dataset.color,
        fill: false,
        data: dataset.data.map(
          data => isTime.value && isTimeFormat(data) ? timeToSeconds(data) : data
        )
      }
    ))
    
    const chartInstance = Chart.getChart(lineChart.value)
    chartInstance.update()
  }
});

</script>
