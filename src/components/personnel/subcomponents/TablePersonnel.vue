<template>
    <div class="lg:max-h-[25rem] xl:max-h-[27rem] 2xl:max-h-[30rem] overflow-y-auto rounded-b-lg border border-gray">
        <table class="min-w-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex items-center">
                    <!-- Table Headers -->
                    <th 
                        v-for="(header, index) in headers" 
                        :key="index" 
                        :class="index === 0 ? 'w-20 lg:w-28' : 'flex-1'"
                        class="text-left text-[.58rem] py-4 px-2 cursor-default"
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
                    :class="{'bg-light-accent': item.selected}"
                >
                    <!-- Table Items -->
                    <td v-for="(header, hIndex) in headers" :key="hIndex"
                        :class="hIndex === 0 ? 'w-20 lg:w-28' : 'flex-1'"
                        class="text-left text-[.58rem] px-2 py-4 cursor-default"
                    >
                        <span :class="getTextClass(header, item)">
                            <!-- Special handling for the status column -->
                            <template v-if="header === tableProps.statusColumn"> 
                                <span :class="tableProps.statusClasses[item[header]]">
                                    {{ item[header] }}
                                </span>
                            </template>
                            <template v-else>
                                {{ item[header] }}
                            </template>
                        </span>
                    </td>
                    <!-- Checkbox -->
                    <td class="w-20 text-center text-sm py-4 px-2 flex items-center justify-center">
                        <CheckboxSelector
                            :checked="item.selected"
                            @update:checked= "(checked) => toggleSelectItem(index, checked)" 
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

const emit = defineEmits(['selection:changed']);
const headerChecked = ref(false)

const paginatedItems = computed(() => {
    const totalItems = tableProps.items.length;
    const totalPages = Math.ceil(totalItems / tableProps.itemsPerPage);

    // Make sure we only calculate once and avoid mutating props directly
    const validPage = Math.min(Math.max(1, tableProps.currentPage), totalPages);
    
    const start = (validPage - 1) * tableProps.itemsPerPage;
    const end = start + tableProps.itemsPerPage;
    return tableProps.items.slice(start, end);
});


//Select All Items
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
    const selectedItems = tableProps.items.filter(item => item.selected).length;
    return {
        allSelected: totalItems > 0 && selectedItems === totalItems,
        anySelected: selectedItems > 0
    };
};

const getTextClass = (header, item) => {
    return '';
};

</script>