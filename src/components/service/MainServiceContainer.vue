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
                    text="Create"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-24 h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconAdd'
                />
            </div>
    
        </div>

        <!-- Table -->
        <div class="relative w-full flex flex-col h-full">
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
        @update="handleUpdate"
        @add="handleAdd"
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
import { useNotification } from '@kyvg/vue3-notification';


//Sample Data
const tableHeaders = ref([ 'Service Name', 'Role Type', 'Status', '']);
const tableItems = ref([]);
const selectedItem = ref({})
const {notify} = useNotification()

const listCounters = ref([{label: 'All', type: ''}, {label: 'Cashier', type: 'C'}, {label: 'Registrar', type: 'R'}, {label: 'Admission', type: 'A'}])

const selectedCounterOption = ref(listCounters.value[0])
const filteredData = computed(() => {
    if(selectedCounterOption.value.type == '') return tableItems.value
    else return tableItems.value.filter(service => service['Role Type'] == selectedCounterOption.value.label)
})

// Status Classes
const statusClasses = ref({
    Open: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]' ,
    Closed: 'bg-red-600 text-white p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]',
});

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

//Add Announcement Dialogbox
const isServicesVisible = ref(false)
const dialogMode = ref('add')


const handleEditItem = async (item) => {
    selectedItem.value = item
    openDialog('edit');  // Show the dialog
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
const totalItems = computed(()=>filteredData.value.length);

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

    return filteredData.value.slice(start, end);
});

//Handle Page Changes
const handlePageChange = (page) => {
    currentPage.value = page;
    // Fetch new data or update table based on new page
};

// Handle Update Request
const handleUpdate = async (valuesToUpdate, callback) => {
    const serviceID = selectedItem.value.serviceID
    if(serviceID && Object.entries(valuesToUpdate).length > 0) {
        const data = await updateService(serviceID, valuesToUpdate)
        if(!data) return
        console.log(data)
        if(data.updated) {
            tableItems.value = await getServices()
            notify({
                title: 'Success',
                text: data.status,
                type: 'success'
            })
            callback()
        }
        else {
            notify({
                title: 'Error',
                text: data.status,
                type: 'error'
            })
        }
    }
}

// Handle Add Request
const handleAdd = async(service, callback) => {
    if(service) {
        const data = await createService(service)
        if(!data) return
        console.log(data)
        if(data.created) {
            tableItems.value = await getServices()
            notify({
                title: 'Success',
                text: data.status,
                type: 'success'
            })
            callback()
        }
        else {
            notify({
                title: 'Error',
                text: data.status,
                type: 'error'
            })
        }
    }
}

const getServices = async() => {
    try{
        const token = localStorage.getItem('jwtadmin')
        let request = '/api/services'
        const response = await fetch(request, { 
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        if(!response.ok) return alert(`An error occured: ${data.error}`)
        const services = data.services.map(service => ({
            serviceID: service.serviceID,
            'Role Type': service.roleType,
            'Service Name': service.name,
            'Status': service.status
        }))
        return services
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

// REQUEST UPDATE PERSONNEL
const updateService = async(id, valuesToUpdate) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/services/${id}`
        const response = await fetch(request, { 
            method: 'PATCH', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(valuesToUpdate)
        })
        const data = await response.json()
        if(!response.ok) {
            notify({
                title: 'Error',
                text: data.error,
                type: 'error',
                closeOnClick: true,
            })
            return
        }
        return data
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

// REQUEST CREATE PERSONNEL
const createService = async(service) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/services`
        const response = await fetch(request, { 
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(service)
        })
        const data = await response.json()
        if(!response.ok){
            notify({
                title: 'Error',
                text: data.error,
                type: 'error',
                closeOnClick: true,
            })
            return
        }
        return data
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}


onMounted(async() => {
    tableItems.value = await getServices()
})

// Watcher for Dropdown Changes
watch(selectedRows, (newValue) => {
    itemsPerPage.value = parseInt(newValue.split(' ')[0], 10);
    currentPage.value = 1; // Reset to the first page whenever items per page changes
    totalItems.value = tableItems.value.length
});
</script>