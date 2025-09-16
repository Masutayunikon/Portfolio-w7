<script setup lang="ts">
type BlogPost = {
  path: string
  title: string
  date?: string
  description?: string
  draft?: boolean
}

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const { data: posts, pending, error } = await useAsyncData<BlogPost[]>(
    'posts',
    () =>
        queryCollection('blog')
            .where('draft', '=', false)
            .order('date', 'DESC')
            .select('path', 'title', 'date', 'description')
            .all(),
    { default: () => [] }
)
</script>

<template>
  <section class="min-h-screen bg-gray-800 text-white px-4 py-10">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Blog</h1>
      <p class="text-gray-300">Articles techniques, Nuxt, Vue, dev & self-hosting.</p>
    </header>

    <!-- Loading / Error -->
    <div v-if="pending" class="text-gray-400 italic">Chargement…</div>
    <div v-else-if="error" class="text-red-400">Une erreur est survenue.</div>

    <!-- List -->
    <div v-else>
      <p v-if="!posts.length" class="text-gray-400">Aucun article pour le moment.</p>

      <div v-else class="grid gap-4 lg:grid-cols-3">
        <NuxtLink
            v-for="post in posts"
            :key="post.path"
            :to="post.path"
            class="group block rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="mb-2 flex items-center justify-between">
            <h2 class="text-lg font-semibold leading-snug group-hover:text-blue-400">
              {{ post.title }}
            </h2>
            <time
                v-if="post.date"
                :datetime="post.date"
                class="ml-3 shrink-0 text-xs text-gray-400"
            >
              {{ formatDate(post.date) }}
            </time>
          </div>

          <p class="line-clamp-3 text-sm text-gray-300">
            {{ post.description || 'Lire l’article →' }}
          </p>

          <div class="mt-4 text-sm font-medium text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
            Lire →
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
