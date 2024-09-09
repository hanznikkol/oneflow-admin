<template>
    <div class="max-h-96 overflow-y-auto rounded-lg border border-gray">
        <table class="min-w-full bg-pure-white table-fixed">
            <!-- Header -->
            <thead class="bg-accent">
                <tr class="flex">
                    <!-- Table Headers -->
                    <th v-for="headers in header" :key="headers" 
                    class="flex-1 text-left text-sm p-4 cursor-default" 
                    >
                        {{ headers }}
                    </th>
                </tr>
            </thead>
            <!-- Content -->
            <tbody>
                <!-- Table Row -->
                <tr v-for="(item, index) in items" :key="index" 
                    class="flex"
                    :class="{'bg-light-accent': item.selected }"
                >
                    <!-- Table Items -->
                    <td v-for="(header, hIndex) in header" :key="hIndex"
                    class="flex-1 text-left text-sm p-4 cursor-default" 
                    >
                        {{ item[header] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>

<script setup>

</script>