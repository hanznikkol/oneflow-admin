<template>
    <div :class="itemClass">
        <div class="w-full h-full border border-gray rounded-b-lg overflow-y-auto">
            <table class="min-w-full h-full bg-pure-white table-fixed rounded-b-lg">
                <!-- Header -->
                <thead class="bg-accent">
                    <tr class="flex items-center" >
                        <!-- Table Headers -->
                        <th
                            v-for="(headers,index) in header" 
                            :key="index"
                            :class="index === 0 ? 'w-20 lg:w-28' : 'flex-1'" 
                            class="text-left text-[.58rem] py-4 px-2 cursor-default " 
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
                        <td v-for="(headers, hIndex) in header" :key="headers"
                            :class="[
                                getCellClass(headers, item),
                                hIndex === 0 ? 'w-20 lg:w-28' : 'flex-1', 
                                'text-left text-[.58rem] px-2 py-4 cursor-default whitespace-nowrap'
                            ]">
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
import { computed, ref } from 'vue';

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

 // Computed class binding
 const itemClass = computed(() => {
      return tableProps.items.length > 6
        ? 'w-full h-0 flex-grow' // Grows if items are more
        : 'w-full flex-shrink';  // Shrinks and takes minimal space if items are few
    });

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