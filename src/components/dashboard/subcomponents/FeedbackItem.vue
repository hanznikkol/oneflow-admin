<template>
    <div class="w-full h-full lg:h-0 flex-grow flex flex-col justify-between border-4 border-main-gray rounded-lg gap-2 p-2">
        <p class="text-sm text-ellipsis max-h-50 line-clamp-4 overflow-clip">The online queue ticket is superb!! ang laking tulong nya especially kapag may inaabyad ka pa na iba and ayaw mo mawala sa pila, just a glance sa phone mo makikita mo na kung anong queue number na ung currently being served!</p>
        <div>
            <ReactionContainer reaction="Very Good"/>
        </div>
    </div> 
</template>

<script setup>
import ReactionContainer from '../../feedback/subcomponents/ReactionContainer.vue';
</script>