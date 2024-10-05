<template>
    <div v-if="value != 0 && value != null " class="flex items-center justify-center">
        <component :is="value > 0 ? IconUptrend : IconDowntrend" :class="iconClass"/>
        <h1 :class="textClass">{{ props.value }}%</h1>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import IconUptrend from '../../icons/dashboard_icons/IconUptrend.vue';
import IconDowntrend from '../../icons/dashboard_icons/IconDowntrend.vue'

const props = defineProps({
    value: {
        type: String,
    },
    isImproved: {
        type: Boolean,
    }
})

const iconClass = computed(()=> props.isImproved ? 'w-6 h-6 stroke-green-400' : 'w-6 h-6 stroke-red-600')
const textClass = computed(()=> props.isImproved ? 'text-sm ms-1 lg:text-sm font-bold text-green-400' : 'text-sm ms-1 lg:text-sm font-bold text-red-600')
</script>