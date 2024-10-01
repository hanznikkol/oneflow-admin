<template>
    <!-- Announcement Main Content -->
    <div class="w-full h-full flex flex-col">
        <!-- Buttons -->
        <div class="w-full h-[12%] flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-t-xl">
            <div class="w-auto h-auto flex flex-row gap-2">
                <!-- Dropdown Rows -->
                <DropdownBoxContainer
                    :options = "rowOptions"
                    v-model= "selectedRows"
                    size = "w-full lg:w-36 h-9"
                />
                <!--  -->
                <DropdownBoxContainer
                    size = "w-full lg:w-60 h-9"
                    icon = "IconAdmin"
                    v-model= "selectedCounterOption"
                    :options = "listCounters"
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
    
        </div>

        <!-- Table -->
        <div class="w-full flex-grow">
            <TableService 
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
    <DialogBoxServices 
        v-if="isServicesVisible"  
        :item = "selectedItem"
        @close="handleClose"
        :mode ="dialogMode"
    />
</template>

<script setup>
import { ref, computed , watch, onMounted } from 'vue';
import DialogBoxServices from '../dialogbox/DialogBoxServices.vue';
import IconAdd from '../icons/announcement_icons/IconAdd.vue';
import IconAdmin from '../icons/statistics_icons/IconAdmin.vue';
//Components
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import TableService from './subcomponents/TableService.vue';
import Pagination from '../pagination/Pagination.vue';


//Sample Data
const tableHeaders = ref([ 'Service Name', 'Admin Type', 'Status', ' ']);
const tableItems = ref([
    // Cashier-related services
    {
        'Service ID': 'C001',
        'Service Name': 'Tuition Fee Payment',
        'Admin Type': 'Cashier',
        'Status': 'Online',
    },
    {
        'Service ID': 'C002',
        'Service Name': 'Miscellaneous Fee Payment',
        'Admin Type': 'Cashier',
        'Status': 'Offline',
    },
    {
        'Service ID': 'C003',
        'Service Name': 'Scholarship Processing',
        'Admin Type': 'Cashier',
        'Status': 'Online',
    },

    // Registrar-related services
    {
        'Service ID': 'R001',
        'Service Name': 'Transcript of Records Request',
        'Admin Type': 'Registrar',
        'Status': 'Online',
    },
    {
        'Service ID': 'R002',
        'Service Name': 'Enrollment Verification',
        'Admin Type': 'Registrar',
        'Status': 'Offline',
    },
    {
        'Service ID': 'R003',
        'Service Name': 'Degree Certification',
        'Admin Type': 'Registrar',
        'Status': 'Online',
    },

    // Admission-related services
    {
        'Service ID': 'A001',
        'Service Name': 'New Student Enrollment',
        'Admin Type': 'Admission',
        'Status': 'Online',
    },
    {
        'Service ID': 'A002',
        'Service Name': 'Admission Application Processing',
        'Admin Type': 'Admission',
        'Status': 'Offline',
    },
    {
        'Service ID': 'A003',
        'Service Name': 'Transfer Student Evaluation',
        'Admin Type': 'Admission',
        'Status': 'Online',
    },
]);
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
const isServicesVisible = ref(false)
const dialogMode = ref('add')

const handleEditItem = async (item) => {
    // fetch the selected user
    // selectedItem.value = await getPersonnel(item.adminID)
    dialogMode.value = 'edit';
    isServicesVisible.value = true;  // Show the dialog
};

const openDialog = (mode) => {
    dialogMode.value = mode;
    isServicesVisible.value = true;
};

const handleClose = () => {
    selectedItem.value = {}
    isServicesVisible.value = false
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

// onMounted(async() => {
//     tableItems.value = await getPersonnel()
// })

// Watcher for Dropdown Changes
watch(selectedRows, (newValue) => {
    itemsPerPage.value = parseInt(newValue.split(' ')[0], 10);
    currentPage.value = 1; // Reset to the first page whenever items per page changes
    totalItems.value = tableItems.value.length
});
</script>