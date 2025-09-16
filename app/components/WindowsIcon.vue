<template>
  <div
      class="h-auto flex flex-col items-center justify-center
           hover:bg-gray-200 hover:bg-opacity-20 hover:cursor-pointer p-1"
  >
    <img
        :src="iconUrl"
        :alt="alt"
        :title="title"
        class="w-24 object-contain"
    />
    <span
        v-if="description"
        class="px-2 mt-2 text-center text-gray-200 leading-tight
             text-lg"
    >
      {{ description }}
    </span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  iconUrl: { type: String, required: true },
  alt: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})
</script>
