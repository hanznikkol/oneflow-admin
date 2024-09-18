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
            <TableAnnoucement @selection:changed = "handleSelectionChanged"/>
        </div>
    </div>
    
    <!-- Bottom Container -->
    <div class="bg-pure-white w-full h-[10%] p-2 rounded-lg">
        <div class="w-full h-full flex justify-end items-center">
            <ButtonContainer
                text="Next"
                textClass = "text-xs lg:text-sm font-bold"
                sizeClass = "w-24 h-9 px-2"
                buttonRadius = "rounded-lg"
            />
        </div>
    </div>
    <!-- Show Dialog Box -->
    <DialogBoxAnnouncement 
        v-if="isAnnouncementVisible"  
        @close="isAnnouncementVisible = false"
        :mode ="dialogMode"
    />
</template>

<script setup>
import { ref } from 'vue';

//Components
import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';
import DropdownBoxContainer from '../main/subcomponents/DropdownBoxContainer.vue';
import TableAnnoucement from './subcomponents/TableAnnoucement.vue';

//Dialog Box
import DialogBoxAnnouncement from '../dialogbox/DialogBoxAnnouncement.vue';

//Icons
import IconEdit from '../icons/announcement_icons/IconEdit.vue';
import IconDelete from '../icons/announcement_icons/IconDelete.vue';
import IconAdd from '../icons/announcement_icons/IconAdd.vue';

//Dropdown
const rowOptions = ['10 rows', '20 rows', '50 rows', '100 rows']
const selectedRows = ref(rowOptions[0]);
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
</script>