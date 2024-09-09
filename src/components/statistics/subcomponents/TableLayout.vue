<template>
    <div class="max-h-96 overflow-y-auto rounded-lg border border-gray">
        <table class="min-w-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex">
                    <!-- Table Headers -->
                    <th v-for="header in headers" :key="header" 
                    class="flex-1 text-left text-[.58rem] py-4 px-2 cursor-default whitespace-nowrap" 
                    >
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <!-- Content -->
            <tbody>
                <!-- Table Row -->
                <tr v-for="(item, index) in items" :key="index" 
                    class="flex"
                    :class="{'bg-light-accent': index === selectedIndex, 'bg-pure-white': item.selected && index !== selectedIndex}"
                    @click="toggleRow(index)"
                >
                    <!-- Table Items -->
                    <td v-for="header in headers" :key="header"
                        :class="getCellClass(header, item)"
                        class="flex-1 text-left text-[.58rem] px-2 py-4 cursor-default whitespace-nowrap" 
                    >
                        <span :class="getTextClass(header, item)">
                            {{ item[header] }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>

<script setup>
import { ref } from 'vue';

const tableProps = defineProps({
    headers: {
        type: Array,
        required: true,
        default: () => [],
    },
    items: {
        type: Array,
        required: true,
        default: () => [],
    },
    statusColumn: {
        type: String,
        default: '',
    },
    statusClasses: {
        type: Object,
        default: () => ({}),
    }
})

const selectedIndex = ref(null)

function toggleRow(index) {

     if (index === selectedIndex.value) {
        selectedIndex.value = null;
    } else {
        // Otherwise, select the new row
        selectedIndex.value = index;
    }
}

//Customer Journey Status
function getCellClass(header, item) {
    // Return basic cell class, customizable per component
    if (header === 'Status') {
        const status = item[header];
        if (status === 'completed') {
            return 'bg-green-100';
        } else if (status === 'pending') {
            return 'bg-custom-red';
        }
    }
    return '';
}

function getTextClass(header, item) {
    if (header === tableProps.statusColumn) {
        const status = item[header];
        return tableProps.statusClasses[status] || '';
    }
    return '';
}
</script>