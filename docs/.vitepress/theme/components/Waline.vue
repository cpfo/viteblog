<template>
  <Waline :serverURL="serverURL" :path="path" />
</template>
<script setup lang="ts">
import { Waline } from '@waline/client/component'
import { computed } from 'vue'
import { useRoute } from 'vitepress'

import '@waline/client/style'

const serverURL = 'https://hexo-comments-weld.vercel.app/'
const path = computed(() => useRoute().path)
</script>
