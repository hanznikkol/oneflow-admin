<template>
    <div class="fixed inset-0 flex justify-center items-center z-20">
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black opacity-50 transition-opacity duration-200" ></div>

        <!-- Dialog Box -->
        <div class="flex flex-col relative bg-pure-white w-[55%] h-auto rounded-lg">
            <!-- Exit Button -->
            <div class="absolute top-2 right-4 p-2">
                <button 
                    class="rounded-sm w-6 h-6 lg:w-8 lg:h-8 flex justify-center items-center outline outline-1 outline-gray hover:bg-light-gray shadow-sm duration-200 active:scale-110"
                    @click="emitClose"
                >
                    <IconCancel class="w-6 h-6 lg:w-8 lg:h-8"/>
                </button>
            </div>

            <!-- Main Content -->
            <div class="w-full gap-4 flex-1 py-4 flex flex-col justify-center px-4">
                <label for="announcement" class=" font-bold text-base lg:text-xl">
                    {{ mode === 'edit' ? 'Edit Video' : 'Add Video'}}
                </label>

                <!-- Choose Video File -->
                <div class="relative w-full h-60 flex flex-col rounded-lg border border-dashed border-[#B7B7B7]  bg-[#EFEEF3]">
                    <video v-if="videoURL" class="object-center w-full h-full" :src="videoURL" autoplay controls></video>
                    <input 
                        type="file" 
                        accept="video/*" 
                        ref="fileInput" 
                        @change="handleFileInput" 
                        style="display: none;"
                    />
                    <DialogButtonContainer 
                        v-if="mode == 'add'"
                        bgColorClass = "bg-primary hover:bg-[#0043A8]"
                        sizeClass = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto h-12 p-2"
                        textClass = "text-base opacity-[0.8] font-bold text-white"
                        :text = "pickedFile ? pickedFile.name : 'Choose Video File'"
                        @click="triggerFileInput"
                        :icon = "IconAddFile"
                    />
                </div>

                <!-- Title -->
                <div class="w-full h-auto flex flex-col gap-1">
                    <label for="title" class="text-sm">Title</label>
                    <input 
                        v-model="title"
                        id = "title"
                        class="text-sm w-full h-full flex-1 bg-light-gray p-2 rounded-lg placeholder:text-black placeholder:italic resize-none"
                    />
                </div>

                <!-- Enable -->
                <div class="w-full h-auto flex flex-col gap-2">
                    <h1 class="text-sm">Show</h1>
                    <ToggleSwitchContainer
                        v-model="toggleEnable"
                    />
                </div>
            </div>
            
            <!-- Buttons -->
            <div class="flex-1 flex gap-4 w-full px-6 h-auto py-4 bg-gray">
                <DialogButtonContainer
                    text = "Cancel"
                    textClass = "text-base font-bold"
                    sizeClass = "p-2 w-full"
                    bgColorClass = "bg-pure-white hover:bg-light-gray"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
                    @click="emitClose"
                />

                <DialogButtonContainer
                    v-if="mode == 'edit'"
                    text ='Save'
                    textClass = "text-base text-black font-bold"
                    sizeClass = "p-2 w-full"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
                    @click="emitUpdate"
                />
                <DialogButtonContainer
                    v-else
                    text = 'Add'
                    textClass = "text-base text-black font-bold"
                    sizeClass = "p-2 w-full"
                    buttonRadius = "rounded-md"
                    shadowClass = "shadow-2xl"
                    @click="emitAdd"
                />
            </div>
                
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ToggleSwitchContainer from '../main/subcomponents/ToggleSwitchContainer.vue';
import DialogButtonContainer from './subcomponents/DialogButtonContainer.vue';
//Icons
import IconCancel from '../icons/dialogbox_icons/IconCancel.vue';
import IconAddFile from '../icons/dialogbox_icons/IconAddFile.vue';
import { useNotification } from '@kyvg/vue3-notification';

const {notify} = useNotification()


//Props
const props = defineProps({
    mode: {
       type: String,
       required: true
    },
    item: {
      type: Object
    }
})


const emit = defineEmits(['close', 'add', 'update'])
const title = ref('')
const fileInput = ref(null); // Reference to the hidden file input
const pickedFile = ref()
const videoURL = ref('')
const duration = ref()

const emitAdd = () => {
    if(!pickedFile.value) {
      notify({
        title: 'Invalid',
        text: 'Please select a video file first',
        type: 'warn'
      })
    }
    const video = getVideoInfo()
    emit('add', video, () => {
        emitClose()
    })
}

const emitUpdate = () => {
    const video = getVideoInfo()
    emit('update', item.value.videoID, video, () => {
        emitClose()
    })
}

const getVideoInfo = () => {
    const video = {
        data: pickedFile.value,
        title: title.value.trim(),
        duration: duration.value,
        show: toggleEnable.value ? 'Y' : 'N'
    }
    return video
}

// Function to trigger the hidden file input when button is clicked
const triggerFileInput = () => {
  fileInput.value.click(); // Programmatically click the file input
};


const handleFileInput = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('video/')) {
    pickedFile.value = file
    videoURL.value = URL.createObjectURL(file)
    extractVideoDuration(file)
  }
};

const item = ref(props.item)


// Extract video duration from the selected file
const extractVideoDuration = (file) => {
  const videoURL = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = videoURL;

  video.addEventListener('loadedmetadata', () => {
    duration.value = video.duration; // Get video duration in seconds
    URL.revokeObjectURL(videoURL); // Clean up the video URL object
  });
};
const toggleEnable = ref(false)
onMounted(() => {
  if(props.item) {
    console.log(props.item)
    toggleEnable.value = props.item?.Show
    title.value = props.item?.Title
    duration.value = props.item?.duration
    videoURL.value = props.item?.Video
  }
})

const emitClose = () => emit('close');


</script>
