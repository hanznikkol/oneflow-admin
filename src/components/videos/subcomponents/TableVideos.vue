<template>
    <div class="max-h-[26rem] overflow-y-auto rounded-b-lg border border-gray">
        <table class="min-w-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex items-center">
                    <!-- Table Headers -->
                    <th 
                        v-for="(header, index) in headers" 
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
                <tr v-for="(item, index) in paginatedItems" :key="index" 
                    class="flex items-center"
                    :class="getRowClass(item, index)"
                >
                    <!-- Table Items -->
                    <td v-for="(header, hIndex) in headers" :key="hIndex"
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

const emit = defineEmits(['selection:changed']);
const headerChecked = ref(false);

const getRowClass = (item, index) => {
    return item.selected
        ? (index % 2 === 0 ? 'bg-light-accent' : 'bg-accent')
        : (index % 2 === 0 ? 'bg-pure-white' : 'bg-light-accent');
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

// Get the Selection Status
const getSelectionStatus = () => {
    const totalItems = tableProps.items.length;
    const selectedItems = tableProps.items.filter(item => item.selected).length;
    return {
        allSelected: totalItems > 0 && selectedItems === totalItems,
        anySelected: selectedItems > 0
    };
};
</script>
