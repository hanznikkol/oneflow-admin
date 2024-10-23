<template>
    <div :class="itemClass">
        <div class="w-full h-full overflow-y-auto rounded-b-lg border border-gray">
            <table class="min-w-full h-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex items-center">
                    <!-- Table Headers -->
                    <th 
                        v-for="(header, index) in headers" 
                        :key="index" 
                        :class="index === 0 ? 'w-24 lg:w-40' : 'flex-1'"
                        class="text-left text-[.60rem] lg:text-[.70rem] py-4 px-2 cursor-default" 
                    >
                        {{ header }}
                    </th>
                    <!-- Checkbox -->
                    <th class="w-20 text-center text-sm py-4 px-2 flex items-center justify-center">
                        <CheckboxSelector
                            v-model:checked="headerChecked"
                            @update:checked="toggleSelectAll"
                        />
                    </th>
                </tr>
            </thead>

            <!-- Content -->
            <tbody>
                <!-- Table Row -->
                <tr v-for="(item, index) in paginatedItems" :key="index" 
                    class="flex items-center"
                    :class="getRowClass(item, index)"
                >
                    <!-- Table Items -->
                    <td v-for="(header, hIndex) in headers" :key="hIndex"
                        @mouseover="playVideo(index)" @mouseleave="pauseVideo(index)"
                        :class="hIndex === 0 ? 'w-24 lg:w-40' : 'flex-1'"
                        class="text-left whitespace-nowrap max-w-sm overflow-hidden text-ellipsis w-[10%] text-[.60rem] lg:text-[.70rem] px-2 py-4 cursor-default" 
                    >   
                        <!-- Show video thumbnail in the first column -->
                        <template v-if="header === ''">
                           <!-- Change This to Img -->
                           <div class="w-28"><video ref="videoElements" class="w-full h-full" :src="item['Video']" muted></video></div>
                        </template>
                        <!-- Show Toggle Switch if the header is Show -->
                        <template v-else-if="header === 'Show'">
                            <ToggleSwitchContainer v-model="item.Show" @click="emitUpdate(item.videoID, item.Show)" />
                        </template>
                        <!-- Default Item -->
                        <template v-else
                        :class= "'flex-1'"
                        class="text-left text-[.60rem] lg:text-[.70rem] px-2 py-4 cursor-default"
                        >
                            {{ item[header] }}
                        </template>
                    </td>
                    <!-- Checkbox -->
                    <td class="w-20 text-center text-sm py-4 px-2 flex items-center justify-center">
                       <CheckboxSelector
                            :checked="item.selected"
                            @update:checked= "checked => toggleSelectItem(index, checked)"
                        />                        
                    </td>
                </tr>
            </tbody>

        </table>
    </div>
    </div>
</template>


<script setup>
import { ref, watch, computed } from 'vue';
import CheckboxSelector from '../../main/subcomponents/CheckboxSelector.vue';
import ToggleSwitchContainer from '../../main/subcomponents/ToggleSwitchContainer.vue';

const tableProps = defineProps({
    headers: {
        type: Array,
        required: true,
    },
    currentPage: {
        type: Number,
        required: true,
        default: 1
    },
    itemsPerPage: {
        type: Number,
        required: true,
        default: 10
    },
    items: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['selection:changed', 'update']);
const headerChecked = ref(false);

const emitUpdate = (id, show) => {
    emit('update', id, {show: show ? 'Y' : 'N'}, () => {})
}

const itemClass = computed(() => {
    return tableProps.items.length > 3
        ? 'lg:w-full lg:h-64 lg:flex-grow' // Set a specific height with overflow
        : 'lg:w-full lg:flex-shrink';
});

const getRowClass = (item, index) => {
    return item.selected
        ? (index % 2 === 0 ? 'bg-light-accent' : 'bg-accent')
        : (index % 2 === 0 ? 'bg-pure-white' : 'bg-light-accent');
};

const videoElements = ref([]); // This will hold references to all video elements

const playVideo = (index) => {
  const videoElement = videoElements.value[index];
  if (videoElement) {
    videoElement.play();
  }
};

const pauseVideo = (index) => {
  const videoElement = videoElements.value[index];
  if (videoElement) {
    videoElement.pause();
  }
};


// Pagination
const paginatedItems = computed(() => {
    const totalItems = tableProps.items.length;
    const totalPages = Math.ceil(totalItems / tableProps.itemsPerPage);

    // Make sure we only calculate once and avoid mutating props directly
    const validPage = Math.min(Math.max(1, tableProps.currentPage), totalPages);
    
    const start = (validPage - 1) * tableProps.itemsPerPage;
    const end = start + tableProps.itemsPerPage;
    return tableProps.items.slice(start, end);
});

// Select All Items
const toggleSelectAll = (isChecked) => {
    paginatedItems.value.forEach(item => item.selected = isChecked);
    emit('selection:changed', getSelectionStatus())
}

// Watch for changes in the headerChecked state to update all items
watch(headerChecked, (newValue) => {
    toggleSelectAll(newValue);
});

// Watch for changes in the items to update headerChecked
watch(() => tableProps.items, () => {
    const { allSelected } = getSelectionStatus();
    headerChecked.value = allSelected;
}, { deep: true });

// Select Specific Items
const toggleSelectItem = (index, isChecked) => {
    if (tableProps.items[index]) {
        tableProps.items[index].selected = isChecked;
        emit('selection:changed', getSelectionStatus());
    }
}

//Get the Selection Status
const getSelectionStatus = () => {
    const totalItems = tableProps.items.length;
    const selectedItems = tableProps.items.filter(item => item.selected);
    return {
        allSelected: totalItems > 0 && selectedItems.length === totalItems,
        selectedItems: selectedItems
    };
};
</script>
