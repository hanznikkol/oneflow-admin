<template>
    <!-- Announcement Main Content -->
    <div class="w-full h-full flex flex-col">
        <!-- Buttons -->
        <div class="w-full border-r border-l border-t border-gray h-[12%] flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-t-xl">
            <div class="w-auto items-center justify-center flex h-auto">
                <DropdownBoxContainer
                    :options = "rowOptions"
                    v-model= "selectedRows"
                    size = "w-full lg:w-36 h-9"
                />
                <ButtonSegmented @update:selected="handleStatusSelectChange" class="ms-2"/>
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
        <div class="relative w-full flex flex-col h-full">
            <TablePersonnel 
                :headers="tableHeaders"
                :items="paginatedItems"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                :status-classes="statusClasses"
                @edit:item="handleEditItem"
                @restore:item="showRestoreDialog"
            />
        </div>
    </div>
    
    <!-- Pagination -->
    <div class="bg-pure-white border border-gray w-full h-auto p-2 rounded-lg flex items-center">
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
        @update="handleUpdate"
        @delete="showDeleteDialog"
        @add="handleAdd"
        :mode ="dialogMode"
    />
    <DialogConfirmation 
        v-if="isConfirmationDialogVisible"
        :title="confirmationDialogTitle"
        :content="confirmationDialogContent"
        :mode="confirmationDialogMode"
        @delete="handleDelete"
        @restore="handleRestore"
        @close="isConfirmationDialogVisible = false"
    />
</template>

<script setup>
import { ref, computed , watch, onMounted, onUnmounted } from 'vue';

//Icon
import IconAdd from '../icons/announcement_icons/IconAdd.vue';
import IconEdit from '../icons/announcement_icons/IconEdit.vue';
import IconDelete from '../icons/announcement_icons/IconDelete.vue';
import ButtonSegmented from './subcomponents/ButtonSegmented.vue';

//Components
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import DialogConfirmation from '../dialogbox/DialogConfirmation.vue';
import TablePersonnel from './subcomponents/TablePersonnel.vue';
import Pagination from '../pagination/Pagination.vue';
import DialogBoxPersonnel from '../dialogbox/DialogBoxPersonnel.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { socket, state } from '../../../socket';

//Sample Data
const tableHeaders = ref(['Role Name', 'Assigned Employee', 'Email', 'Phone', 'Status', ''])
const tableItems = ref([]);
const selectedItem = ref({})

const {notify} = useNotification()

// Status Classes
const statusClasses = ref({
    Online: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]' ,
    Offline: 'bg-red-600 text-white p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]',
    Deleted: 'bg-stone-600 text-white p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]',
});

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

// Dialogbox
const isPersonnelVisible = ref(false)
const isConfirmationDialogVisible = ref(false)
const dialogMode = ref('add')
const confirmationDialogMode = ref('')
const confirmationDialogTitle = ref('')
const confirmationDialogContent = ref('')


const handleEditItem = async (item) => {
    // fetch the selected user
    selectedItem.value = await getPersonnel(item.adminID)
    dialogMode.value = 'edit';
    isPersonnelVisible.value = true;  // Show the dialog
};

const showRestoreDialog = async (item) => {
    selectedItem.value = item
    confirmationDialogMode.value = 'restore'
    confirmationDialogTitle.value = 'Restore Personnel'
    confirmationDialogContent.value = 'Do you want to restore this personnel?'
    isConfirmationDialogVisible.value = true
}

const showDeleteDialog = async () => {
    confirmationDialogMode.value = 'delete'
    confirmationDialogTitle.value = 'Delete Personnel'
    confirmationDialogContent.value = 'Do you want to delete this personnel?'
    isConfirmationDialogVisible.value = true
}

const openDialog = (mode) => {
    dialogMode.value = mode;
    isPersonnelVisible.value = true;
};

const handleClose = () => {
    selectedItem.value = {}
    isPersonnelVisible.value = false
    isConfirmationDialogVisible.value = false
}

// Handle Restore Request
const handleRestore = async() => {
    const adminID = selectedItem.value.adminID
    if(adminID) {
        const data = await restorePersonnel(adminID)
        console.log(data)
        if(data.restored) {
            await fetchUpdatedPersonnels('Deleted')
            notify({
                title: 'Success',
                text: data.status,
                type: 'success'
            })
            handleClose()
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

// Handle Delete Request
const handleDelete = async() => {
    const adminID = selectedItem.value.adminID
    if(adminID) {
        const data = await deletePersonnel(adminID)
        console.log(data)
        if(data.deleted) {
            await fetchUpdatedPersonnels('Active')
            notify({
                title: 'Success',
                text: data.status,
                type: 'success'
            })
            handleClose()
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

// Handle Update Request
const handleUpdate = async (valuesToUpdate, callback) => {
    const adminID = selectedItem.value.adminID
    if(adminID && Object.entries(valuesToUpdate).length > 0) {
        const data = await updatePersonnel(adminID, valuesToUpdate)
        if(!data) return
        console.log(data)
        if(data.updated) {
            await fetchUpdatedPersonnels('Active')
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
const handleAdd = async(personnel, callback) => {
    if(personnel) {
        const data = await createPersonnel(personnel)
        if(!data) return
        console.log(data)
        if(data.created) {
            notify({
                title: 'Success',
                text: data.status,
                type: 'success'
            })
            await fetchUpdatedPersonnels('Active')
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

const handleStatusSelectChange = async (status) => {
    await fetchUpdatedPersonnels(status)
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


// REQUEST GET A PERSONNEL
const getPersonnel = async(id) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        let request = `/api/personnel/${id}`
        const response = await fetch(request, { 
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        if(!response.ok) return alert(`An error occured: ${data.error}`)
        const personnel = data.personnel
        personnel.Status = tableItems.value.find(personnel => personnel.adminID == id).Status // set current status
        return personnel
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

//REQUEST GET ALL PERSONNEL
const getAllPersonnel = async(status) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        let request = `/api/personnel?s=${status}`
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

// REQUEST UPDATE PERSONNEL
const updatePersonnel = async(id, valuesToUpdate) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/personnel/${id}`
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
const createPersonnel = async(personnel) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/personnel`
        const response = await fetch(request, { 
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(personnel)
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

// REQUEST DELETE PERSSONNEL
const deletePersonnel = async(id) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/personnel/${id}`
        const response = await fetch(request, { 
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json()
        if(!response.ok) return alert(`An error occured: ${data.error}`)
        return data
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}


// REQUEST RESTORE PERSONNEL
const restorePersonnel = async(id) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/personnel/${id}/restore`
        const response = await fetch(request, { 
            method: 'PATCH', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
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

// SOCKET LISTENERS
const handlePersonnelConnected = (adminID) => {
    const personnel = tableItems.value.find(personnel => personnel.adminID === adminID)
    personnel.Status = 'Online'
}
const handlePersonnelDisconnected = (adminID) => {
    const personnel = tableItems.value.find(personnel => personnel.adminID === adminID)
    personnel.Status = 'Offline'
}

onMounted(async() => {
    // Initialize Socket Event Listeners
    socket.on('personnelConnected', handlePersonnelConnected)
    socket.on('personnelDisconnected', handlePersonnelDisconnected)
    await fetchUpdatedPersonnels('Active')
})
onUnmounted(()=>{
    // Remove Socket Event Listeners
    socket.off('personnelConnected')
    socket.off('personnelDisconnected')
})

const fetchUpdatedPersonnels = async(status) => {
    tableItems.value = await getAllPersonnel(status)
    console.log(tableItems.value)
    // Get all online personnels after fetching data 
    fetchOnlinePersonnels()

}

// Fetch the list of online personnels
const fetchOnlinePersonnels = () => {
    if(tableItems.value.length > 0) {
        socket.emit('onlinePersonnels', (onlinePersonnels) => {
            onlinePersonnels.forEach(adminID => {
                // Set status to active for each list in onlinePersonnels
                const personnel = tableItems.value.find(personnel => personnel.adminID == adminID)
                if(personnel) {
                    personnel.Status = 'Online'
                }
            });
        })
    }
}

// Watcher for Dropdown Changes
watch(selectedRows, (newValue) => {
    itemsPerPage.value = parseInt(newValue.split(' ')[0], 10);
    currentPage.value = 1; // Reset to the first page whenever items per page changes
    totalItems.value = tableItems.value.length
});

</script>