<template>
    <div :class="itemClass">
        <div class="w-full h-full border border-gray rounded-b-lg overflow-x-auto">
            <table class="min-w-full h-full table-fixed bg-pure-white rounded-b-lg">
                <!-- Header -->
                <thead class="bg-accent">
                    <tr class="flex items-center" >
                        <!-- Table Headers -->
                        <th
                            v-for="(headers,index) in header" 
                            :key="index"
                            :class="index === 0 ? 'w-20 lg:w-28' : 'flex-1'" 
                            class="text-left text-[.60rem] lg:text-[.70rem] px-2 py-4 cursor-default break-words whitespace-normal" 
                        >
                            {{ headers }}
                        </th>
                    </tr>
                </thead>
                
                <!-- Content -->
                <tbody>
                    <!-- Table Row -->
                    <tr v-for="(item, index) in items" :key="index" 
                        class="flex items-center"
                        :class="getRowClass(item, index)"
                        @click="toggleRow(index)"
                    >
                        <!-- Table Items -->
                        <td v-for="(headers, hIndex) in header" :key="headers"
                            :class="[
                                getCellClass(headers, item),
                                hIndex === 0 ? 'w-20 lg:w-28' : 'flex-1', 
                                'text-left text-[.60rem] lg:text-[.70rem] px-2 py-4 break-words cursor-default whitespace-normal'
                            ]">
                            <span :class="getTextClass(headers, item)">
                                <!-- Special handling for the status column -->
                                <template v-if="headers === statusColumn">
                                    <span :class="statusClasses[item[statusColumn]]">
                                        {{ item[statusColumn] }}
                                    </span>
                                </template>
                                <template v-else>
                                    {{ item[headers] }}
                                </template>
                            </span>
                        </td>
                    </tr>
                </tbody>
                
            </table>

        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const tableProps = defineProps({
    header: {
        type: Array,
        required: true,
    },
    items: {
        type: Array,
        required: true
    },
    statusColumn: {
        type: String,
        required: false,
        default: 'Status',
    },
    statusClasses: {
        type: Object,
        required: false,
        default: () => ({}),
    },
})

const itemClass = computed(() => {
    return tableProps.items.length > 6
        ? 'lg:w-full lg:h-64 lg:flex-grow' // Set a specific height with overflow
        : 'lg:w-full lg:flex-shrink';
});

// State to track selected index
const selectedIndex = ref(null);

// Define methods
const toggleRow = (index) => {
    selectedIndex.value = selectedIndex.value === index ? null : index;
};

const getCellClass = (header, item) => {
    return item[header] === 'SomeCondition' ? 'text-red-500' : '';
};

const getTextClass = (header, item) => {
    return '';
};

// Function to get dynamic row classes
const getRowClass = (item, index) => {
    return selectedIndex.value === index
        ? (index % 2 === 0 ? 'bg-light-accent' : 'bg-accent')
        : (index % 2 === 0 ? 'bg-pure-white' : 'bg-light-accent');
};
</script>