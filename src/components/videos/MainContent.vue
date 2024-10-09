<template>
    <!-- Announcement Main Content -->
    <div class="w-full h-full flex flex-col">
        <!-- Buttons -->
        <div class="w-full h-[12%] flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-t-xl">
            <div class="w-auto h-auto">
                <DropdownBoxContainer
                    :options = "rowOptions"
                    v-model= "selectedRows"
                    size = "w-full lg:w-36 h-9"
                />
            </div>
            <!-- Create/Add Item -->
            <div class="flex flex-row w-auto h-auto justify-around items-center gap-2">
                <ButtonContainer
                    @click="openDialog('add')"
                    v-if = "!showActionButton"
                    text="Add Video"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-auto h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconAdd'
                />
            </div>
            
            <!-- Selected Item -->
            <div v-if="showActionButton" class=" flex flex-row w-auto h-full justify-around items-center gap-2">
                <ButtonContainer
                    text="Delete"
                    textClass = "text-xs lg:text-sm font-bold text-white"
                    bgColorClass = "bg-custom-red hover:bg-[#9f202f]"
                    sizeClass = "w-full lg:w-24 h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconDelete'
                />
                <ButtonContainer
                    @click="openDialog('edit')"
                    v-if = "!isAllSelected"
                    text="Edit"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-24 h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconEdit'
                />
            </div>
        </div>
        <!-- Table -->
        <div class="w-full flex-grow">
            <TableVideos 
                :headers="tableHeaders"
                :items="paginatedItems"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                @selection:changed = "handleSelectionChanged" />
        </div>
    </div>

    <!-- Pagination -->
    <div class="bg-pure-white w-full h-auto p-2 rounded-lg flex items-center">
        <Pagination 
            :itemsPerPage = "itemsPerPage"
            :currentPage = "currentPage"
            :totalItems = "totalItems"
            @update:currentPage = "handlePageChange"
        />
    </div>

    <DialogBoxVideos
        v-if="isAddVideoVisible"
        @close="isAddVideoVisible = false"
        :mode="dialogMode"
    />
</template>

<script setup>
import { ref, computed, watch } from 'vue';

//Components
import DialogBoxVideos from '../dialogbox/DialogBoxVideos.vue';
import TableVideos from './subcomponents/TableVideos.vue';
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import Pagination from '../pagination/Pagination.vue';

//Icons
import IconEdit from '../icons/announcement_icons/IconEdit.vue';
import IconDelete from '../icons/announcement_icons/IconDelete.vue';
import IconAdd from '../icons/announcement_icons/IconAdd.vue';

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

//Items 

const tableHeaders = ref(['', 'Video ID', 'Title', 'File Name', 'Duration', 'Date Added', 'Show']);
const tableItems = ref([
    { thumbnail: 'https://example.com/thumbnail1.jpg', 'Video ID': '12345', Title: 'Sample Video 1', 'File Name': 'video1.mp4', Duration: '2:30', 'Date Added': '2024-09-10', show: true, selected: false },
    { thumbnail: 'https://example.com/thumbnail2.jpg', 'Video ID': '67890', Title: 'Sample Video 2', 'File Name': 'video2.mp4', Duration: '3:45', 'Date Added': '2024-09-11', show: false, selected: false }
]);

//DialogBox
const isAddVideoVisible = ref(false)
const dialogMode = ref('add')
//Selection in Table
const showActionButton = ref(false)
const isAllSelected = ref(false)

const handleSelectionChanged = (selectionStatus) => {
    showActionButton.value = selectionStatus.anySelected;
    isAllSelected.value = selectionStatus.allSelected;
};

const openDialog = (mode) => {
    dialogMode.value = mode;
    isAddVideoVisible.value = true;
};


//Pagination
const currentPage = ref(1);
const itemsPerPage = ref(parseInt(selectedRows.value.split(' ')[0], 10));
const totalItems = ref(tableItems.value.length);

// Compute paginated items based on current page and items per page
const paginatedItems = computed(() => {
    const totalItems = tableItems.value.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage.value);

    // Ensure currentPage is within valid range
    if (currentPage.value < 1) {
        currentPage.value = 1;
    }
    if (currentPage.value > totalPages) {
        currentPage.value = totalPages;
    }

    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;

    return tableItems.value.slice(start, end);
});

//Handle Page Changes
const handlePageChange = (page) => {
    currentPage.value = page;
    // Fetch new data or update table based on new page
};

// Watcher for Dropdown Changes
watch(selectedRows, (newValue) => {
    itemsPerPage.value = parseInt(newValue.split(' ')[0], 10);
    currentPage.value = 1; // Reset to the first page whenever items per page changes
    totalItems.value = tableItems.value.length
});


</script>