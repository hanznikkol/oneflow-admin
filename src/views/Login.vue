<template>
    <div class="w-full min-h-screen flex flex-col justify-center lg:flex-row">
        <LoginContainer/>
    </div>
</template>

<script setup>
//Component
import { onMounted } from 'vue';
import LoginContainer from '../components/login/LoginContainer.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
onMounted(() => {
    const token = localStorage.getItem('jwt')
    if(token) router.push('/admin')
})
</script>