<template>
    <div class="w-full h-1/3 md:h-1/5 bg-pure-white rounded-2xl p-4">
        <div class="w-full h-full flex flex-col md:flex-row gap-2">
            <TextSection 
                v-for ="(section, index) in sections"
                :key = "section.id"
                :label = "section.label"
                :value = "section.value"
                :hasBorder = "index < sections.length - 1"
            />
        </div>
    </div>
</template>

<script setup>
import TextSection from './subcomponents/TextSection.vue';

const props = defineProps({
    sections: {
        type: Array,
        require: true
    }
})
</script>