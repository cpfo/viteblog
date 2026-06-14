<template>
  <div ref="walineRef"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import { init } from '@waline/client'
import '@waline/client/style'

const route = useRoute()
const walineRef = ref<HTMLElement>()
let instance: ReturnType<typeof init> | null = null

async function initWaline() {
  instance?.destroy()
  instance = init({
    el: walineRef.value!,
    serverURL: 'https://hexo-comments-weld.vercel.app/',
    path: route.path,
  })
}

onMounted(initWaline)
watch(() => route.path, initWaline)
</script>
