<template>
    <div class="max-h-[26rem] overflow-y-auto rounded-b-lg border border-gray">
        <table class="min-w-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex items-center">
                    <!-- Table Headers -->
                    <th 
                        v-for="(header, index) in header" 
                        :key="index" 
                        :class="index === 0 ? 'w-24 lg:w-40' : 'flex-1'"
                        class="text-left text-[.58rem] py-4 px-2 cursor-default" 
                    >
                        {{ index === 0 ? 'Thumbnail' : header }}
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
                <tr v-for="(item, index) in items" :key="index" 
                    class="flex items-center"
                    :class="{'bg-light-accent': item.selected }"
                >
                    <!-- Table Items -->
                    <td v-for="(header, hIndex) in header" :key="hIndex"
                        :class="hIndex === 0 ? 'w-24 lg:w-40' : 'flex-1'"
                        class="text-left text-[.58rem] px-2 py-4 cursor-default" 
                    >   
                        <!-- Show video thumbnail in the first column -->
                        <template v-if="hIndex === 0">
                           <!-- Change This to Img -->
                           <div class="w-16 h-8 bg-label-gray"></div>
                        </template>
                        <!-- Show Toggle Switch if the header is Show -->
                        <template v-if="header === 'Show'">
                            <ToggleSwitchContainer v-model="item.show" />
                        </template>
                        <!-- Default Item -->
                        <template v-else>
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
</template>


<script setup>
import { ref, watch } from 'vue';
import CheckboxSelector from '../../main/subcomponents/CheckboxSelector.vue';
import ToggleSwitchContainer from '../../main/subcomponents/ToggleSwitchContainer.vue';

// Define the header and items
const header = ref(['', 'Video ID', 'Title', 'File Name', 'Duration', 'Date Added', 'Show']);
const items = ref([
    { thumbnail: 'https://example.com/thumbnail1.jpg', 'Video ID': '12345', Title: 'Sample Video 1', 'File Name': 'video1.mp4', Duration: '2:30', 'Date Added': '2024-09-10', show: true, selected: false },
    { thumbnail: 'https://example.com/thumbnail2.jpg', 'Video ID': '67890', Title: 'Sample Video 2', 'File Name': 'video2.mp4', Duration: '3:45', 'Date Added': '2024-09-11', show: false, selected: false }
]);

const emit = defineEmits(['selection:changed']);
const headerChecked = ref(false);

// Select All Items
const toggleSelectAll = (isChecked) => {
    items.value.forEach(item => item.selected = isChecked);
    emit('selection:changed', getSelectionStatus());
};

// Watch for changes in the headerChecked state to update all items
watch(headerChecked, (newValue) => {
    toggleSelectAll(newValue);
});

// Watch for changes in the items to update headerChecked
watch(items, () => {
    const { allSelected } = getSelectionStatus();
    headerChecked.value = allSelected;
}, { deep: true });

// Select Specific Items
const toggleSelectItem = (index, isChecked) => {
    if (items.value[index]) {
        items.value[index].selected = isChecked;
        emit('selection:changed', getSelectionStatus());
    }
};

// Get the Selection Status
const getSelectionStatus = () => {
    const totalItems = items.value.length;
    const selectedItems = items.value.filter(item => item.selected).length;
    return {
        allSelected: totalItems > 0 && selectedItems === totalItems,
        anySelected: selectedItems > 0
    };
};
</script>
