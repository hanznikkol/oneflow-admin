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
                    text="Add Personnel"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-auto h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconAdd'
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
                :status-classes="statusClasses"
                @edit:item="handleEditItem"
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
        :item = "selectedItem"
        @close="handleClose"
        :mode ="dialogMode"
    />
</template>

<script setup>
import { ref, computed , watch, onMounted } from 'vue';

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
const tableHeaders = ref(['Counter No.', 'Assigned Employee', 'Email', 'Phone', 'Status', ''])
const tableItems = ref([]);
const selectedItem = ref({})

// Status Classes
const statusClasses = ref({
    Online: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]' ,
    Offline: 'bg-red-600 text-white p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]',
});

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

//Add Announcement Dialogbox
const isPersonnelVisible = ref(false)
const dialogMode = ref('add')


const handleEditItem = async (item) => {
    // fetch the selected user
    selectedItem.value = await getPersonnel(item.adminID)
    dialogMode.value = 'edit';
    isPersonnelVisible.value = true;  // Show the dialog
};

const openDialog = (mode) => {
    dialogMode.value = mode;
    isPersonnelVisible.value = true;
};

const handleClose = () => {
    selectedItem.value = {}
    isPersonnelVisible.value = false
}

// Pagination state
const currentPage = ref(1);
const itemsPerPage = computed(()=>parseInt(selectedRows.value.split(' ')[0], 10));
const totalItems = computed(()=>tableItems.value.length);

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

const getPersonnel = async(id) => {
    try{
        const token = localStorage.getItem('jwt')
        let request = '/api/personnel'
        if(id)
            request += `/${id}`
        const response = await fetch(request, { 
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        if(!response.ok) return alert(`An error occured: ${data.error}`)
        return data.personnel
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

onMounted(async() => {
    tableItems.value = await getPersonnel()
})

// Watcher for Dropdown Changes
watch(selectedRows, (newValue) => {
    itemsPerPage.value = parseInt(newValue.split(' ')[0], 10);
    currentPage.value = 1; // Reset to the first page whenever items per page changes
    totalItems.value = tableItems.value.length
});
</script>