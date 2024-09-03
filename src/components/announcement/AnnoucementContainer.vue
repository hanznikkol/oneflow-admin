<template>
    <!-- Top Container (Filter Section) -->
    <div class="w-full h-[12%] bg-pure-white rounded-xl p-2 flex flex-row justify-between items-center gap-2">
        <!-- Dropdown -->
        <div class="w-full h-full ">
            
        </div>
        <!-- Buttons -->
        <div class="w-full h-full flex justify-end items-center">

            <!-- Create/Add Item -->
            <div class="flex flex-row w-auto h-auto justify-around items-center gap-2">
                <ButtonContainer
                    v-if = "!showActionButton"
                    text="Create"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-24 h-10 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconAdd'
                />
            </div>
            
            <!-- Selected Item -->
            <div v-if="showActionButton" class="flex flex-row w-auto h-full justify-around items-center gap-2">
                <ButtonContainer
                    text="Delete"
                    textClass = "text-xs lg:text-sm font-bold text-white"
                    bgColorClass = "bg-custom-red hover:bg-[#9f202f]"
                    sizeClass = "w-24 h-10 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconDelete'
                />
                <ButtonContainer
                    v-if = "!isAllSelected"
                    text="Edit"
                    textClass = "text-xs lg:text-sm font-bold"
                    sizeClass = "w-24 h-10 px-2"
                    buttonRadius = "rounded-lg"
                    :icon = 'IconEdit'
                />
            </div>
        </div>
    </div>
    <!-- Bottom Container (Tables) -->
    <div class="w-full h-full rounded-xl">
        <TableAnnoucement @selection:changed = "handleSelectionChanged"/>
    </div>

</template>

<script setup>
import { ref } from 'vue';

import ButtonContainer from '../main/subcomponents/ButtonContainer.vue';

import IconEdit from '../icons/announcement_icons/IconEdit.vue';
import IconDelete from '../icons/announcement_icons/IconDelete.vue';
import IconAdd from '../icons/announcement_icons/IconAdd.vue';

import TableAnnoucement from './subcomponents/TableAnnoucement.vue';

const showActionButton = ref(false)
const isAllSelected = ref(false)

const handleSelectionChanged = (selectionStatus) => {
    showActionButton.value = selectionStatus.anySelected;
    isAllSelected.value = selectionStatus.allSelected;
};
</script>