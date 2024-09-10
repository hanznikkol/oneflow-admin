<template>
    <div class="max-h-[26rem] overflow-y-auto rounded-b-lg border border-gray">
        <table class="min-w-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex items-center">
                    <!-- Table Headers -->
                    <th 
                        v-for= "(headers, index) in header" 
                        :key = "index" 
                        :class= "index === 0 ? 'w-20' : 'flex-1'"
                        class=" text-left text-[.58rem] py-4 px-2 cursor-default whitespace-nowrap" 
                    >
                        {{ headers }}
                    </th>
                    <!-- Checkbox -->
                    <th class="w-20 text-center text-sm py-4 px-2 flex items-center justify-center">
                        <CheckboxSelector
                            v-model:checked = "headerChecked"
                            @update:checked = "toggleSelectAll"
                        />
                    </th>
                </tr>
            </thead>

            <!-- Content -->
            <tbody>
                <!-- Table Row -->
                <tr v-for="(item, index) in items" :key="index" 
                    class="flex items-center"
                    :class="{'bg-light-accent': item.selected }"
                >
                    <!-- Table Items -->
                    <td v-for="(header, hIndex) in header" :key="hIndex"
                        :class= "hIndex === 0 ? 'w-20' : 'flex-1'"
                        class=" text-left text-[.58rem] px-2 py-4 cursor-default whitespace-nowrap" 
                    >
                        {{ item[header] }}
                    </td>
                    <!-- Checkbox -->
                    <td class="w-20 text-center text-sm py-4 px-2 flex items-center justify-center">
                       <CheckboxSelector
                            :checked ="item.selected"
                            @update:checked = "(checked) => toggleSelectItem(index, checked)"
                       />
                    </td>
                </tr>
            </tbody>

        </table>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CheckboxSelector from '../../main/subcomponents/CheckboxSelector.vue';

const header = ref(['ID', 'Announced To', 'Message', 'Enabled'])
const items = ref([
    { ID: 1, 'Announced To': 'Registrar', Message: 'Example message 1', Enabled: 'True', selected: false },
    { ID: 2, 'Announced To': 'Cashier', Message: 'Example message 2', Enabled: 'False', selected: false },
])

const emit = defineEmits(['selection:changed']);
const headerChecked = ref(false)

//Select All Items
const toggleSelectAll = (isChecked) => {
    items.value.forEach(item => item.selected = isChecked);
    emit('selection:changed', getSelectionStatus())
}

// Watch for changes in the headerChecked state to update all items
watch(headerChecked, (newValue) => {
    toggleSelectAll(newValue);
});

// Watch for changes in the items to update headerChecked
watch(items, () => {
    const { allSelected } = getSelectionStatus();
    headerChecked.value = allSelected;
}, { deep: true });

// Select Specific Items
const toggleSelectItem = (index, isChecked) => {
    if (items.value[index]) {
        items.value[index].selected = isChecked;
        emit('selection:changed', getSelectionStatus());
    }
}

//Get the Selection Status
const getSelectionStatus = () => {
    const totalItems = items.value.length;
    const selectedItems = items.value.filter(item => item.selected).length;
    return {
        allSelected: totalItems > 0 && selectedItems === totalItems,
        anySelected: selectedItems > 0
    };
};
</script>