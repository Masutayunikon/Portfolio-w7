<template>
  <ClientOnly>
    <PdfCanvas/>
  </ClientOnly>
</template>

<script lang="ts" setup>

onMounted(() => {
  document.documentElement.classList.add('has-scrollbar')
})
</script>