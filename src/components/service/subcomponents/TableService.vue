<template>
    <div class="lg:max-h-[25rem] xl:max-h-[27rem] 2xl:max-h-[30rem] overflow-y-auto rounded-b-lg border border-gray">
        <table class="min-w-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr>
                    <!-- Table Headers -->
                    <th 
                        v-for="(header, index) in headers" 
                        :key="index" 
                        class="text-left text-[.60rem] lg:text-[.70rem] py-4 px-2 cursor-default w-1/6"
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
                    <!-- Table Items -->
                    <template v-for="(header, hIndex) in headers" :key="hIndex"
                    >
                        <!-- Special handling for the status column -->
                        <td v-if="header === tableProps.statusColumn" class="px-2 py-4"> 
                            <span :class="tableProps.statusClasses[item[header]]">
                                {{ item[header] }}
                            </span>
                        </td>
                        <td v-else-if="header === ''" class="w-16 h-14 lg:w-24 lg:h-16 text-center text-sm px-2 py-4 flex items-center justify-end ml-auto">
                                <ButtonContainer
                                    text="Edit"
                                    textClass="text-white text-xs"
                                    sizeClass="w-full h-full"
                                    buttonRadius="rounded-lg"
                                    bgColorClass="bg-[#138FCD]"
                                    @click="handleEditClick(item)"
                                />
                        </td>

                        <td v-else class="text-left text-[.60rem] lg:text-[.70rem] px-2 py-4 cursor-default max-w-xs overflow-hidden text-ellipsis w-[15%]">
                            {{ item[header] }}
                        </td> 
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
</template>



<script setup>
import { ref, watch, computed, onMounted } from 'vue';
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

const getRowClass = (item, index) => {
    return item.selected
        ? (index % 2 === 0 ? 'bg-light-accent' : 'bg-accent')
        : (index % 2 === 0 ? 'bg-pure-white' : 'bg-light-accent');
};

const emit = defineEmits(['edit:item']);

const handleEditClick = (item) => {
    emit('edit:item', item);  // Emit the item that was clicked for editing
};

const paginatedItems = computed(() => {
    const totalItems = tableProps.items.length;
    const totalPages = Math.ceil(totalItems / tableProps.itemsPerPage);

    // Ensure valid page number
    const validPage = Math.min(Math.max(1, tableProps.currentPage), totalPages);
    
    const start = (validPage - 1) * tableProps.itemsPerPage;
    const end = start + tableProps.itemsPerPage;
    return tableProps.items.slice(start, end);
});

const getTextClass = (header, item) => {
    return '';
};
</script>
