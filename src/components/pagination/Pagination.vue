<template>
    <div class="w-full h-auto flex justify-between items-center px-2">
        <!-- Control -->
        <div class="flex flex-start flex-1">

            <div class="flex items-center gap-4">
                <!-- Previous Button -->
                <button
                    @click = "goPreviousPage"
                    class="flex items-center text-sm"
                >
                    <!-- Icon -->
                    <component class="w-6 h-6":is = "IconPrevious"/> 
                    Previous
                </button>
                
                <!-- Page Numbers -->
                <div class="flex items-center">
                    <!-- First Page Button -->
                    <button
                        v-if = "showFirstPage"
                        @click = "goToPage(1)"
                        class="text-sm p-1"
                    >
                        1
                    </button>
 
                    <!-- Ellipses Before (Page Number) -->
                    <span v-if="showEllipsesBefore" class="text-sm flex items-center">...</span>

                    <!-- Page Number Buttons -->
                    <button
                        v-for="page in pageRange"
                        :key="page"
                        @click="goToPage(page)"
                        :class = "{'bg-[#FFFCC6] text-dark-secondary': page === currentPage}"
                        class="text-sm items-center p-1 rounded-md"
                    >
                        {{ page }}
                    </button>

                    <!-- Ellipses After (Page Number) -->
                    <span v-if="showEllipsesAfter" class="text-sm flex items-center">...</span>

                    <!-- Last Number Page Button -->
                    <button
                        v-if="showLastPage"
                        @click = "goToPage(totalPages)"
                        class="text-sm items-center rounded-md p-1"
                    >
                        {{ totalPages }}
                    
                    </button>
                </div>
                
                <!-- Next Button -->
                <button
                    @click = "goNextPage"
                    class="flex items-center text-sm"
                >   
                    Next
                    <!-- Icon -->
                    <component class="w-6 h-6":is = "IconNext"/> 
                </button>
            </div>
        </div>
        <!-- Pagination Results -->
        <div class="flex flex-1 justify-end">
            <span class="text-sm">Showing {{ startResult }} - {{ endResult }} of {{ totalItems }} results</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
//Icons
import IconNext from '../icons/pagination_icons/IconNext.vue';
import IconPrevious from '../icons/pagination_icons/IconPrevious.vue';

const emit = defineEmits(['update:currentPage'])

const paginationProps = defineProps({
    currentPage: {
        type: Number,
        required : true
    },
    itemsPerPage: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }
})

//Total Pages
const totalPages = computed(() => Math.ceil(paginationProps.totalItems / paginationProps.itemsPerPage))
//Start and End Result
const startResult = computed(() => (paginationProps.currentPage - 1) * paginationProps.itemsPerPage + 1);
const endResult = computed(() => Math.min(paginationProps.currentPage * paginationProps.itemsPerPage, paginationProps.totalItems));
const totalItems = computed(() => paginationProps.totalItems);



const pageRange = computed(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, paginationProps.currentPage - 2);
    let endPage = Math.min(totalPages.value, paginationProps.currentPage + 2);

    if (endPage - startPage < maxVisiblePages - 1) {
        if (paginationProps.currentPage < Math.ceil(maxVisiblePages / 2)) {
            endPage = Math.min(totalPages.value, startPage + (maxVisiblePages - 1));
        } else if (paginationProps.currentPage > totalPages.value - Math.ceil(maxVisiblePages / 2)) {
            startPage = Math.max(1, endPage - (maxVisiblePages - 1));
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
});


//Methods for Ellipses
const showFirstPage = computed(() => pageRange.value[0] > 1)
const showLastPage = computed(() => pageRange.value[pageRange.value.length - 1] < totalPages.value)
const showEllipsesBefore = computed(() => pageRange.value[0] > 2)
const showEllipsesAfter = computed(() => pageRange.value[pageRange.value.length - 1] < totalPages.value - 1)

//Methods Page Changes
const goPreviousPage = () => {
    if (paginationProps.currentPage > 1) {
        emit('update:currentPage', paginationProps.currentPage - 1)
    }
}   

const goNextPage = () => {
    if (paginationProps.currentPage < totalPages.value){
        emit('update:currentPage', paginationProps.currentPage + 1)
    }
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        emit('update:currentPage', page)
    }
}

</script>   