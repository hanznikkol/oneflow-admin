<template>
    <div class="w-full flex flex-col flex-1 overflow-y-auto rounded-b-lg">
        <div class="w-full max-h-80 border border-gray rounded-b-lg">
            <table class="min-w-full bg-pure-white table-fixed rounded-b-lg">
                <!-- Header -->
                <thead class="bg-accent">
                    <tr class="flex items-center" >
                        <!-- Table Headers -->
                        <th v-for="headers in header" :key="headers" 
                        class="flex-1 text-left text-[.58rem] py-4 px-2 cursor-default " 
                        >
                            {{ headers }}
                        </th>
                    </tr>
                </thead>
                <!-- Content -->
                <tbody>
                    <!-- Table Row -->
                    <tr v-for="(item, index) in items" :key="index" 
                        class="flex items-center"
                        :class="{'bg-light-accent': index === selectedIndex, 'bg-pure-white': item.selected && index !== selectedIndex}"
                        @click="toggleRow(index)"
                    >
                        <!-- Table Items -->
                        <td v-for="headers in header" :key="headers"
                            :class="getCellClass(headers, item)"
                            class="flex-1 text-left text-[.58rem] px-2 py-4 cursor-default whitespace-nowrap">
                            <span :class="getTextClass(headers, item)">
                                <!-- Special handling for the status column -->
                                <template v-if="headers === statusColumn">
                                    <span :class="statusClasses[item[statusColumn]]">
                                        {{ item[statusColumn] }}
                                    </span>
                                </template>
                                <template v-else>
                                    {{ item[headers] }}
                                </template>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const tableProps = defineProps({
    header: {
        type: Array,
        required: true,
    },
    items: {
        type: Array,
        required: true
    },
    statusColumn: {
        type: String,
        required: false,
        default: 'Status',
    },
    statusClasses: {
        type: Object,
        required: false,
        default: () => ({}),
    },
})

// State to track selected index
const selectedIndex = ref(null);

// Define methods
const toggleRow = (index) => {
    selectedIndex.value = selectedIndex.value === index ? null : index;
};

const getCellClass = (header, item) => {
    return item[header] === 'SomeCondition' ? 'text-red-500' : '';
};

const getTextClass = (header, item) => {
    return '';
};
</script>