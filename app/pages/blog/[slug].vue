<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(
    () => queryCollection('blog').path(route.path).first(),
    { default: () => null }
)
</script>

<template>
  <section class="min-h-screen bg-gray-800 text-white">
    <div class="has-scrollbar mx-auto max-w-3xl px-4 py-10">
      <article class="has-scrollbar prose prose-invert prose-headings:scroll-mt-20 max-w-none">
        <ContentRenderer :value="post" />
      </article>
    </div>
  </section>
</template>
