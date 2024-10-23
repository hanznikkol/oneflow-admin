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
                    v-if = "selectedItems.length === 0"
                    text="Create"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-24 h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconAdd'
                />
            </div>
            
            <!-- Selected Item -->
            <div v-if="selectedItems.length > 0" class=" flex flex-row w-auto h-full justify-around items-center gap-2">
                <ButtonContainer
                    @click="showDeleteDialog"
                    text="Delete"
                    textClass = "text-xs lg:text-sm font-bold text-white"
                    bgColorClass = "bg-custom-red hover:bg-[#9f202f]"
                    sizeClass = "w-full lg:w-24 h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconDelete'
                /> 
                <ButtonContainer
                    @click="openDialog('edit')"
                    v-if = "selectedItems.length === 1"
                    text= "Edit"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-24 h-8 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconEdit'
                />
            </div>
        </div>
        <!-- Table -->
        <div class="relative w-full flex flex-col h-full">
            <TableAnnoucement 
                :headers="tableHeaders"
                :items="paginatedItems"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                :statusClasses="statusClasses"
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
        @close="handleClose"
        @add="handleAdd"
        @update="handleUpdate"
        :item="selectedItems[0]"
        :mode ="dialogMode"
    />

    <DialogConfirmation 
        v-if="isConfirmationDialogVisible"
        :title="confirmationDialogTitle"
        :content="confirmationDialogContent"
        :mode="confirmationDialogMode"
        @delete="handleDelete"
        @close="isConfirmationDialogVisible = false"
    />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

//Components
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import TableAnnoucement from './subcomponents/TableAnnoucement.vue';
import Pagination from '../pagination/Pagination.vue';

//Dialog Box
import DialogConfirmation from '../dialogbox/DialogConfirmation.vue';
import DialogBoxAnnouncement from '../dialogbox/DialogBoxAnnouncement.vue';

//Icons
import IconEdit from '../icons/announcement_icons/IconEdit.vue';
import IconDelete from '../icons/announcement_icons/IconDelete.vue';
import IconAdd from '../icons/announcement_icons/IconAdd.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { socket } from '../../../socket';

const {notify} = useNotification()

//Dialog
const isConfirmationDialogVisible = ref(false)
const confirmationDialogMode = ref('')
const confirmationDialogTitle = ref('')
const confirmationDialogContent = ref('')

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

// Table Data
const tableHeaders = ref(['Announced To', 'Message', 'Date', 'Status', 'Disable At'])
const tableItems = ref([]);

//Add Announcement Dialogbox
const isAnnouncementVisible = ref(false)
const dialogMode = ref('create')

//Selection in Table
const selectedItems = ref([])

// Status Classes
const statusClasses = ref({
    Enabled: 'bg-green-400 text-black p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]' ,
    Disabled: 'bg-red-600 text-white p-1 rounded w-16 h-auto flex items-center justify-center text-[.60rem]',
});

const handleSelectionChanged = (selectionStatus) => {
    selectedItems.value = selectionStatus.selectedItems
    console.log(selectedItems.value)
};

const showDeleteDialog = async () => {
    confirmationDialogMode.value = 'delete'
    confirmationDialogTitle.value = 'Delete Announcement'
    confirmationDialogContent.value = 'Do you want to delete all the selected announcement(s)?'
    isConfirmationDialogVisible.value = true
}

const openDialog = (mode) => {
    dialogMode.value = mode;
    isAnnouncementVisible.value = true;
};

const handleClose = () => {
    isAnnouncementVisible.value = false
}

const showNotification = (IsSuccess, text) => {
    notify({
        title: IsSuccess ? 'Success' : 'Error',
        text: text,
        type: IsSuccess ? 'success' : 'error'
    })
}

const scheduleAnnouncement = (announcement, emit) => {
    console.log('emitted')
    socket.emit(emit, announcement, (isScheduled) => {
        if(isScheduled)
            showNotification(true, 'Announcement has been scheduled for disabling')        
    })
}

// Handle Delete Request
const handleDelete = async () => {
    const announcementIDs = selectedItems.value.map(item => item.announcementID)
    if(announcementIDs.length > 0) {
        const data = await deleteAnnouncement(announcementIDs)
        if(!data) return
        console.log(data)
        if(data.deleted) {
            scheduleAnnouncement(announcementIDs, 'deleteAnnouncement')
            tableItems.value = await getAnnouncements()
            showNotification(true, data.status)
            selectedItems.value = selectedItems.value.filter(i=>!announcementIDs.includes(i.announcementID))
        }
        else {
            showNotification(false, data.status)
        }
        isConfirmationDialogVisible.value = false
    }
}

// Handle Update Request
const handleUpdate = async (announcement, callback) => {
    const announcementID = selectedItems.value[0].announcementID
    if(announcementID && Object.entries(announcement).length > 0) {
        const data = await updateAnnouncement(announcementID, announcement)
        if(!data) return
        console.log(data)
        if(data.updated) {
            announcement.announcementID = announcementID
            scheduleAnnouncement(announcement, 'updateAnnouncement')
            tableItems.value = await getAnnouncements()
            showNotification(true, data.status)
            selectedItems.value = []
            callback()
            handleClose()
        }
        else {
            showNotification(false, data.status)
        }
    }
}

// Handle Add Request
const handleAdd = async(announcement, callback) => {
    if(announcement) {
        const data = await createAnnouncement(announcement)
        if(!data) return
        console.log(data)
        if(data.created) {
            announcement.announcementID = data.insertID
            showNotification(true, data.status)
            //schedule announcement
            scheduleAnnouncement(announcement, 'createAnnouncement')
            // Refresh Items
            tableItems.value = await getAnnouncements()
            callback()
        }
        else {
            showNotification(false, data.status)
        }
    }
}

// REQUEST CREATE Announcement
const createAnnouncement = async(announcement) => {
    try{
        console.log(announcement)
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/announcement`
        const response = await fetch(request, { 
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(announcement)
        })
        const data = await response.json()
        if(!response.ok){
            showNotification(false, data.error)
            return
        }
        return data
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

const getAnnouncements = async() => {
    try{
        const token = localStorage.getItem('jwtadmin')
        let request = '/api/announcement'
        const response = await fetch(request, { 
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        if(!response.ok) return alert(`An error occured: ${data.error}`)
        const announcements = data.announcements.map(a=> ({
            announcementID: a.announcementID,
            'Announced To': a.announcedTo,
            'Disable At': a['Disable At'],
            'Status': a.status,
            'Message': a.message,
            'Date': a['Date']
        }))
        return announcements
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

// REQUEST UPDATE Announcement
const updateAnnouncement = async(id, valuesToUpdate) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/announcement/${id}`
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
            showNotification(false, data.error)
            return
        }
        return data
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

// REQUEST DELETE Announcement
const deleteAnnouncement = async(announcementIDs) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/announcement`
        const response = await fetch(request, { 
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({announcementIDs: announcementIDs})
        })
        const data = await response.json()
        if(!response.ok) {
            showNotification(false, data.error)
            return
        }
        return data
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}


// Pagination state
const currentPage = ref(1);
const itemsPerPage = computed(() => parseInt(selectedRows.value.split(' ')[0], 10));
const totalItems = computed(() => tableItems.value.length);

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

const onAnnouncementDisabled = (id) => {
    const announcement = tableItems.value.find(i => i.announcementID == id)
    announcement.Status = 'Disabled'
}

onMounted(async() => {
    tableItems.value = await getAnnouncements()
    socket.on('announcementDisabled', onAnnouncementDisabled)
})

onUnmounted(() => {
    socket.off('announcementDisabled')
})

// Watcher for Dropdown Changes
watch(selectedRows, (newValue) => {
    itemsPerPage.value = parseInt(newValue.split(' ')[0], 10);
    currentPage.value = 1; // Reset to the first page whenever items per page changes
    totalItems.value = tableItems.value.length
});

</script>