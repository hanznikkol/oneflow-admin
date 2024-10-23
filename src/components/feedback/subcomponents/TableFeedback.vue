<template>
    <div :class="itemClass">
        <div class="w-full h-full overflow-y-auto rounded-b-lg border border-gray">
            <table class="min-w-full h-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr>
                    <!-- Table Headers -->
                    <th 
                        v-for="(header, index) in headers" 
                        :key="index" 
                        class="text-left text-[.60rem] lg:text-[.70rem] py-4 px-2 cursor-default whitespace-nowrap w-1/6"
                    >
                        {{ header }}
                    </th>
                </tr>
            </thead>

            <!-- Content -->
            <tbody>
                <!-- Table Row -->
                <tr v-for="(item, index) in paginatedItems" :key="index"
                    :class="getRowClass(item,index)"
                >
                    <template v-for="(header, hIndex) in headers" :key="hIndex">
                        <!-- Reaction Column -->
                        <td v-if="header === 'Reaction'" 
                            class="text-left px-2 py-4 cursor-default w-1/6"
                        >
                            <ReactionContainer :reaction="item.reaction" />
                        </td>

                        <!-- Button at the end (View Feedback) -->
                        <td v-else-if ="header === ' '" class="w-16 h-14 lg:w-24 lg:h-16 text-center text-sm py-4 px-2 flex items-center justify-end ml-auto">
                            <ButtonContainer
                                text="View"
                                textClass="text-white text-xs"
                                sizeClass="w-full h-full"
                                buttonRadius="rounded-lg"
                                bgColorClass="bg-[#138FCD]"
                                @click="handleViewClick(item)"
                            />
                        </td>
                        <!-- Other Columns -->
                        <td v-else 
                            class="text-left text-[.60rem] lg:text-[.70rem] px-2 py-4 cursor-default whitespace-nowrap max-w-xs overflow-hidden text-ellipsis w-[15%]"
                        >
                            {{ item[header] }}
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ReactionContainer from './ReactionContainer.vue';
import ButtonContainer from '../../main/subcomponents/ButtonContainer.vue';

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

const getRowClass = (item, index) => {
    return item.selected
        ? (index % 2 === 0 ? 'bg-light-accent' : 'bg-accent')
        : (index % 2 === 0 ? 'bg-pure-white' : 'bg-light-accent');
};

const emit = defineEmits(['selection:changed', 'showFeedback']);
const headerChecked = ref(false)

const handleViewClick = (item) => {
    emit('showFeedback', item);
};

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
