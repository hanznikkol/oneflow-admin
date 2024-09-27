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
                    @click="openDialog('create')"
                    v-if = "!showActionButton"
                    text="Create"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-24 h-8 px-2"
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
                    text= "Edit"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-24 h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconEdit'
                />
            </div>
        </div>
        <!-- Table -->
        <div class="w-full">
            <TableAnnoucement 
                :headers="tableHeaders"
                :items="paginatedItems"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                @selection:changed="handleSelectionChanged"
            />
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

    <!-- Show Dialog Box -->
    <DialogBoxAnnouncement 
        v-if="isAnnouncementVisible"  
        @close="isAnnouncementVisible = false"
        :mode ="dialogMode"
    />
</template>

<script setup>
import { ref, computed, watch } from 'vue';

//Components
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import TableAnnoucement from './subcomponents/TableAnnoucement.vue';
import Pagination from '../pagination/Pagination.vue';

//Dialog Box
import DialogBoxAnnouncement from '../dialogbox/DialogBoxAnnouncement.vue';

//Icons
import IconEdit from '../icons/announcement_icons/IconEdit.vue';
import IconDelete from '../icons/announcement_icons/IconDelete.vue';
import IconAdd from '../icons/announcement_icons/IconAdd.vue';

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

// Table Data
const tableHeaders = ref(['ID', 'Announced To', 'Message', 'Enabled'])
const tableItems = ref([
    { ID: 1, 'Announced To': 'Registrar', Message: 'Example message 1', Enabled: 'True', selected: false },
    { ID: 2, 'Announced To': 'Cashier', Message: 'Example message 2', Enabled: 'False', selected: false },
    { ID: 3, 'Announced To': 'Registrar', Message: 'Example message 3', Enabled: 'True', selected: false },
    { ID: 4, 'Announced To': 'Cashier', Message: 'Example message 4', Enabled: 'True', selected: false },
    { ID: 5, 'Announced To': 'Faculty', Message: 'Example message 5', Enabled: 'True', selected: false },
    { ID: 6, 'Announced To': 'Registrar', Message: 'Example message 6', Enabled: 'False', selected: false },
    { ID: 7, 'Announced To': 'Cashier', Message: 'Example message 7', Enabled: 'False', selected: false },
    { ID: 8, 'Announced To': 'Faculty', Message: 'Example message 8', Enabled: 'True', selected: false },
    { ID: 9, 'Announced To': 'Registrar', Message: 'Example message 9', Enabled: 'False', selected: false },
    { ID: 10, 'Announced To': 'Cashier', Message: 'Example message 10', Enabled: 'True', selected: false },
    { ID: 11, 'Announced To': 'Faculty', Message: 'Example message 11', Enabled: 'False', selected: false },
    { ID: 12, 'Announced To': 'Registrar', Message: 'Example message 12', Enabled: 'True', selected: false },
    { ID: 13, 'Announced To': 'Cashier', Message: 'Example message 13', Enabled: 'False', selected: false },
    { ID: 14, 'Announced To': 'Faculty', Message: 'Example message 14', Enabled: 'True', selected: false },
    { ID: 15, 'Announced To': 'Registrar', Message: 'Example message 15', Enabled: 'False', selected: false },
    { ID: 16, 'Announced To': 'Cashier', Message: 'Example message 16', Enabled: 'True', selected: false },
    { ID: 17, 'Announced To': 'Faculty', Message: 'Example message 17', Enabled: 'False', selected: false },
    { ID: 18, 'Announced To': 'Registrar', Message: 'Example message 18', Enabled: 'True', selected: false },
    { ID: 19, 'Announced To': 'Cashier', Message: 'Example message 19', Enabled: 'True', selected: false },
    { ID: 20, 'Announced To': 'Faculty', Message: 'Example message 20', Enabled: 'False', selected: false },
    // Repeat pattern for remaining items up to 99
]);

for (let i = 21; i <= 99; i++) {
    tableItems.value.push({
        ID: i,
        'Announced To': i % 3 === 0 ? 'Faculty' : i % 2 === 0 ? 'Cashier' : 'Registrar',
        Message: `Example message ${i}`,
        Enabled: i % 2 === 0 ? 'True' : 'False',
        selected: false
    });
}

//Add Announcement Dialogbox
const isAnnouncementVisible = ref(false)
const dialogMode = ref('create')

//Selection in Table
const showActionButton = ref(false)
const isAllSelected = ref(false)

const handleSelectionChanged = (selectionStatus) => {
    showActionButton.value = selectionStatus.anySelected;
    isAllSelected.value = selectionStatus.allSelected;
};

const openDialog = (mode) => {
    dialogMode.value = mode;
    isAnnouncementVisible.value = true;
};

// Pagination state
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