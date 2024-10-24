<template>
    <!-- Announcement Main Content -->
    <div class="w-full h-full flex flex-col">
        <!-- Buttons -->
        <div class="w-full border-r border-l border-t border-gray h-[12%] flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-2 md:items-center bg-pure-white rounded-t-xl">
            <div class="w-[54%] items-center justify-start h-auto flex gap-4 ">
                <DropdownBoxContainer
                    :options = "rowOptions"
                    v-model= "selectedRows"
                    size = "w-full lg:w-36 h-9"
                />

                <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                        <span :class="['text-sm font-medium dark:text-white', storageClass['TEXT']]">Storage</span>
                        <span :class="['text-xs font-medium dark:text-white', storageClass['TEXT']]">{{ `${totalUploadedBytes} / ${uploadLimit}`}}</span>
                    </div>
                    <div class="w-full bg-gray rounded-full h-2.5 dark:bg-gray-700">
                        <div :class="['h-2.5 rounded-full', storageClass['BG']]" :style="{width: `${sizeDifference}%`}"></div>
                    </div>
                </div>

                <div class="ms-6 flex-1">
                    <template v-if="isUploading">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-sm text-primary font-medium dark:text-white">Uploading...</span>
                            <span class="text-xs font-medium dark:text-white">{{ `${uploadProgress}%`}}</span>
                        </div>
                        <div class="w-full bg-gray rounded-full h-2.5 dark:bg-gray-700">
                            <div class="h-2.5 bg-primary rounded-full" :style="{width: `${uploadProgress}%`}"></div>
                        </div>
                    </template>
                </div>
            </div>
            <!-- Create/Add Item -->
            <div class="flex flex-row h-auto justify-around items-center gap-2">
                <ButtonContainer
                    @click="openDialog('add')"
                    v-if = "selectedItems.length === 0"
                    text="Add Video"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-full lg:w-auto h-8 px-2"
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
            <TableVideos 
                :headers="tableHeaders"
                :items="paginatedItems"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                @update="handleUpdate"
                @selection:changed = "handleSelectionChanged" />
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

    <DialogConfirmation 
        v-if="isConfirmationDialogVisible"
        :title="confirmationDialogTitle"
        :content="confirmationDialogContent"
        :mode="confirmationDialogMode"
        @delete="handleDelete"
        @close="isConfirmationDialogVisible = false"
    />

    <DialogBoxVideos
        v-if="isAddVideoVisible"
        @add="handleAdd"
        @update="handleUpdate"
        :item = "selectedItems[0]"
        @close="isAddVideoVisible = false"
        :mode="dialogMode"
    />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

//Components
import DialogBoxVideos from '../dialogbox/DialogBoxVideos.vue';
import TableVideos from './subcomponents/TableVideos.vue';
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import Pagination from '../pagination/Pagination.vue';
import DialogConfirmation from '../dialogbox/DialogConfirmation.vue';
//Icons
import IconEdit from '../icons/announcement_icons/IconEdit.vue';
import IconDelete from '../icons/announcement_icons/IconDelete.vue';
import IconAdd from '../icons/announcement_icons/IconAdd.vue';
import axios from 'axios';
import { useNotification } from '@kyvg/vue3-notification';
import moment from 'moment';
import { useRoute } from 'vue-router';

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);

const {notify} = useNotification()

//Items 

const tableHeaders = ref(['', 'Title', 'File Name', 'Duration', 'Size', 'Date Added', 'Show']);
const tableItems = ref([]);

//DialogBox
const isAddVideoVisible = ref(false)
const dialogMode = ref('add')
//Dialog
const isConfirmationDialogVisible = ref(false)
const confirmationDialogMode = ref('')
const confirmationDialogTitle = ref('')
const confirmationDialogContent = ref('')

const uploadLimit = ref('')
const totalUploadedBytes = ref('')
const sizeDifference = ref('')
const uploadProgress = ref(0)
const isUploading = ref(false)
const route = useRoute()

//Selection in Table
const selectedItems = ref([])

const storageClass = computed(() => {
    if(sizeDifference.value > 80){
        return {
            TEXT: 'text-red-600',
            BG: 'bg-red-600'
        }
    }
    else if(sizeDifference.value > 60){
        return {
            TEXT: 'text-orange-600',
            BG: 'bg-orange-600'
        }
    }
    else {
        return {
            TEXT: 'text-blue-700',
            BG: 'bg-blue-600'
        }
    }
})

const handleSelectionChanged = (selectionStatus) => {
    selectedItems.value = selectionStatus.selectedItems
    console.log(selectedItems.value)
};

const openDialog = (mode) => {
    dialogMode.value = mode;
    isAddVideoVisible.value = true;
};

const showDeleteDialog = async () => {
    confirmationDialogMode.value = 'delete'
    confirmationDialogTitle.value = 'Delete Video'
    confirmationDialogContent.value = 'Do you want to delete all the selected video(s)?'
    isConfirmationDialogVisible.value = true
}


//Pagination
const currentPage = ref(1);
const itemsPerPage = computed(() => parseInt(selectedRows.value.split(' ')[0], 10));
const totalItems = computed(() => (tableItems.value.length));

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

const showNotification = (IsSuccess, text) => {
    notify({
        title: IsSuccess ? 'Success' : 'Error',
        text: text,
        type: IsSuccess ? 'success' : 'error'
    })
}

// Handle Add Request
const handleAdd = async(video, callback) => {
    if(video) {
        isAddVideoVisible.value = false
        const data = await uploadVideo(video)
        if(!data) return
        console.log(data)
        if(data.created) {
            showNotification(true, data.status)
            // Refresh Items
            tableItems.value = await getVideos()
            callback()
        }
        else {
            showNotification(false, data.status)
        }
    }
}

// Handle Add Request
const handleUpdate = async(id, video, callback) => {
    if(video) {
        const data = await updateVideo(id, video)
        if(!data) return
        console.log(data)
        if(data.updated) {
            showNotification(true, data.status)
            // Refresh Items
            selectedItems.value = []
            tableItems.value = await getVideos()
            callback()
        }
        else {
            showNotification(false, data.status)
        }
    }
}

// Handle Delete Request
const handleDelete = async () => {
    const videoIDs = selectedItems.value.map(item => item.videoID)
    if(videoIDs.length > 0) {
        const data = await deleteVideos(videoIDs)
        if(!data) return
        console.log(data)
        if(data.deleted) {
            tableItems.value = await getVideos()
            showNotification(true, data.status)
            selectedItems.value = selectedItems.value.filter(i=>!videoIDs.includes(i.videoID))
        }
        else {
            showNotification(false, data.status)
        }
        isConfirmationDialogVisible.value = false
    }
}

// Upload the video file and duration as a POST request
const uploadVideo = async (video) => {
  const formData = new FormData();
  formData.append('video', video.data); // Append the video file
  formData.append('title', video.title);
  formData.append('duration', video.duration); // Append the video duration
  formData.append('show', video.show)
  
  try {
    const token = localStorage.getItem('jwtadmin')
    isUploading.value = true
    const response = await axios.post('/api/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        uploadProgress.value = percentCompleted;
      }
    });
    return response.data
  } catch (error) {
    if (error.response) {
      showNotification(false, error.response.data.error);
    }
  }
  finally{
    isUploading.value = false
  }
};

const updateStorage = (total, limit) => {
    // Storage Calculation
    uploadLimit.value = formatFileSize(limit)
    totalUploadedBytes.value = formatFileSize(total)
    sizeDifference.value = (total / limit) * 100
}

const getVideos = async() => {
    try{
        const token = localStorage.getItem('jwtadmin')
        let request = '/api/video'
        const response = await fetch(request, { 
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        if(!response.ok) return alert(`An error occured: ${data.error}`)

        updateStorage(data.totalUploadedBytes, data.uploadLimit)

        const videos = data.videos.map(v => ({
            videoID: v.videoID,
            'Video': getVideoUrl(v.name),
            'Title': v.title,
            'File Name': v.name,
            'Duration': formatVideoDuration(v.duration),
            'Date Added': v.Date,
            'Size': formatFileSize(v.size),
            'Show': v.showing == 'Y' ? true : false
        }))
        return videos
    }
    catch(err){
        alert(`An error occured: ${err}`)
    }
}

const getVideoUrl = (videoName) => {
return window.location.hostname === 'localhost'
  ? 'http://localhost:3000/videos/' + videoName
  : `${window.location.protocol}//${window.location.hostname}/videos/${videoName}`
}

const updateVideo = async(id, video) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        let request = `/api/video/${id}`
        const response = await fetch(request, { 
            method: 'PATCH', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: video.title, show: video.show})
        })
        const data = await response.json()
        if(!response.ok) return showNotification(false, data.error)
        return data
    }
    catch(err) { 
        alert(`An error occured: ${err}`)
    }
}

const deleteVideos = async(videoIDs) => {
    try{
        const token = localStorage.getItem('jwtadmin')
        const request = `/api/video`
        const response = await fetch(request, { 
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({videoIDs: videoIDs})
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

function formatVideoDuration(duration) {
  // Moment.js duration function, given in seconds
  const formattedDuration = moment.utc(moment.duration(duration, "seconds").asMilliseconds()).format("HH:mm:ss");

  return formattedDuration;
}

function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  // Calculate log of bytes to get the size index
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  // Divide by the appropriate power of 1024 and fix to 2 decimal places
  const size = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${size} ${sizes[i]}`;
}


onMounted(async() => {
    tableItems.value = await getVideos()
})

// Watcher for Dropdown Changes
watch(selectedRows, (newValue) => {
    itemsPerPage.value = parseInt(newValue.split(' ')[0], 10);
    currentPage.value = 1; // Reset to the first page whenever items per page changes
    totalItems.value = tableItems.value.length
});


</script>