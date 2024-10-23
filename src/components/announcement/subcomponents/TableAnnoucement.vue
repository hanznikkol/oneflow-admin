<template>
    <div :class="itemClass">
        <div class="w-full h-full overflow-y-auto rounded-b-lg border border-gray">
            <table class="min-w-full h-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex items-center">
                    <!-- Table Headers -->
                    <th 
                        v-for= "(header, index) in headers" 
                        :key = "index" 
                        :class= "'flex-1'"
                        class=" text-left text-[.60rem] lg:text-[.70rem] py-4 px-2 cursor-default whitespace-nowrap" 
                    >
                        {{ header }}
                    </th>
                    <!-- Checkbox -->
                    <th class="w-20 text-center text-sm py-4 px-2 flex items-center justify-center">
                        <CheckboxSelector
                            v-model:checked = "headerChecked"
                            @update:checked = "toggleSelectAll"
                        />
                    </th>
                </tr>
            </thead>

            <!-- Content -->
            <tbody>
                <!-- Table Row -->
                <tr v-for="(item, index) in paginatedItems" :key="index" 
                    class="flex items-center"
                    :class="getRowClass(item,index)"
                >
                    <!-- Table Items -->
                     
                    <template v-for="(header, hIndex) in headers" :key="hIndex">
                        <!-- Special handling for the status column -->
                        <td v-if="header === tableProps.statusColumn" class="flex-1 px-2 py-4"> 
                            <span :class="tableProps.statusClasses[item[header]]">
                                {{ item[header] }}
                            </span>
                        </td>
                        <td 
                        v-else
                            :class= "'flex-1'"
                            class="text-left text-[.60rem] lg:text-[.70rem] px-2 py-4 cursor-default whitespace-nowrap max-w-xs overflow-hidden text-ellipsis w-[15%]"
                        >
                            {{ item[header] }}
                        </td>
                    </template>
                    <!-- Checkbox -->
                    <td class="w-20 text-center text-sm py-4 px-2 flex items-center justify-center">
                       <CheckboxSelector
                            :checked ="item.selected"
                            @update:checked = "(checked) => toggleSelectItem(index, checked)"
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
    statusColumn: {
        type: String,
        required: false,
        default: 'Status'
    },
    statusClasses: {
        type: Object,
        required: false,
        default: () => ({}),
    },
    items: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['selection:changed']);
const headerChecked = ref(false)

const getRowClass = (item, index) => {
    return item.selected
        ? (index % 2 === 0 ? 'bg-light-accent' : 'bg-accent')
        : (index % 2 === 0 ? 'bg-pure-white' : 'bg-light-accent');
};

//Sizing of the table
const itemClass = computed(() => {
    return tableProps.items.length > 6
        ? 'lg:w-full lg:h-64 lg:flex-grow' // Set a specific height with overflow
        : 'lg:w-full lg:flex-shrink';
});


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
    const selectedItems = tableProps.items.filter(item => item.selected);
    return {
        allSelected: totalItems > 0 && selectedItems.length === totalItems,
        selectedItems: selectedItems
    };
};
</script>