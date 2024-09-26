<template>
    <div class="max-h-[30rem] lg:max-h-[25rem] xl:max-h-[27rem] 2xl:max-h-[30rem] overflow-y-auto rounded-b-lg border border-gray">
        <table class="min-w-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex items-center">
                    <!-- Table Headers -->
                    <th 
                        v-for="(header, index) in headers" 
                        :key="index" 
                        class="flex-1 text-left text-[.58rem] py-4 px-2 cursor-default whitespace-nowrap" 
                    >
                        {{ header }}
                    </th>
                </tr>
            </thead>

            <!-- Content -->
            <tbody>
                <!-- Table Row -->
                <tr v-for="(item, index) in paginatedItems" :key="index" 
                    class="flex items-center"
                    :class="{'bg-light-accent': item.selected }"
                >
                    <template v-for="(header, hIndex) in headers" :key="hIndex">
                        <td v-if="header === 'Reaction'" 
                            class="flex-1 text-left text-[.58rem] px-2 py-4 cursor-default"
                        >
                            <ReactionContainer :reaction="item.Reaction" />
                        </td>

                        <td v-else 
                            class="flex-1 text-left text-[.58rem] px-2 py-4 cursor-default whitespace-nowrap max-w-xs overflow-hidden text-ellipsis"
                        >
                            {{ item[header] }}
                        </td>
                    </template>
                    
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ReactionContainer from './ReactionContainer.vue';

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
