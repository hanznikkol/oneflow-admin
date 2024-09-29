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
                    text="Add Personnel"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-auto h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconAdd'
                />
            </div>
            
            <!-- Selected Item -->
            <div v-if="showActionButton" class="  flex flex-row w-auto h-full justify-around items-center gap-2">
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
        <div class="w-full flex-grow">
            <TablePersonnel 
                :headers="tableHeaders"
                :items="paginatedItems"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                :status-column= "Status"
                :status-classes="statusClasses"
                @selection:changed="handleSelectionChanged"
                @edit:item = "handleEditItem"
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
    <DialogBoxPersonnel 
        v-if="isPersonnelVisible"  
        @close="isPersonnelVisible = false"
        :mode ="dialogMode"
        :item="selectedItem" 
    />
</template>

<script setup>
import { ref, computed , watch } from 'vue';

//Icon
import IconAdd from '../icons/announcement_icons/IconAdd.vue';
import IconEdit from '../icons/announcement_icons/IconEdit.vue';
import IconDelete from '../icons/announcement_icons/IconDelete.vue';

//Components
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import TablePersonnel from './subcomponents/TablePersonnel.vue';
import Pagination from '../pagination/Pagination.vue';
import DialogBoxPersonnel from '../dialogbox/DialogBoxPersonnel.vue';

//Sample Data
const tableHeaders = ref(['Account ID', 'Admin Type', 'Counter No', 'Email', 'First Name', 'Last Name', 'Phone', 'Status', ' '])
const tableItems = ref([
    { ID: 1, 'Account ID': 'A001', 'Admin Type': 'Registrar', 'Counter No': '213123', 'Email': 'john1@example.com', 'First Name': 'John', 'Last Name': 'Doe', 'Phone': '123-456-7890', Status: 'Online' },
    { ID: 2, 'Account ID': 'A002', 'Admin Type': 'Cashier', 'Counter No': '123123', 'Email': 'jane2@example.com', 'First Name': 'Jane', 'Last Name': 'Smith', 'Phone': '234-567-8901', Status: 'Offline' },
]);

for (let i = 1; i <= 100; i++) {
    tableItems.value.push({
        ID: i,
        'Account ID': `A00${i}`,
        'Admin Type': i % 2 === 0 ? 'Cashier' : 'Registrar',
        'Counter No': i % 2 === 0 ? '20398192' : '129319283',
        Email: `user${i}@example.com`,
        'First Name': `FirstName${i}`,
        'Last Name': `LastName${i}`,
        Phone: `123-456-78${i % 100}`,
        Status: i % 2 === 0 ? 'Offline' : 'Online',
    });
}

// Status Classes
const statusClasses = ref({
    Online: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center',
    Offline: 'bg-red-600 text-white p-1 rounded w-16 h-auto flex items-center justify-center',
});

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

//Add Announcement Dialogbox
const isPersonnelVisible = ref(false)
const dialogMode = ref('add')
const selectedItem = ref(null);

const handleEditItem = (item) => {
    selectedItem.value = item;  // Set the selected item to be edited
    dialogMode.value = 'edit';
    isPersonnelVisible.value = true;  // Show the dialog
};

const openDialog = (mode) => {
    dialogMode.value = mode;
    isPersonnelVisible.value = true;
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