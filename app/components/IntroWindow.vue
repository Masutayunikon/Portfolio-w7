<!-- components/IntroWindow.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean // v-model:is-open proxy
}>()
const emit = defineEmits<{
  (e:'update:modelValue', v:boolean): void
  (e:'finish'): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const steps = [
  {
    title: 'Bienvenue dans l’assistant d’installation de mon portfolio',
    paragraphs: [
      'Merci d’avoir lancé l’installation.',
      'Cet assistant va vous guider pour découvrir mon univers de développeur.',
      'Cliquez sur Suivant pour commencer 🚀',
    ],
  },
  {
    title: 'Qui suis-je ?',
    paragraphs: [
      'Je m’appelle Quentin, développeur web diplômé d’Epitech et spécialisé en front-end avec Vue.js et Nuxt 3.',
      'J’aime concevoir des interfaces réactives, élégantes et scalables, tout en gardant un code clair et maintenable.',
      'Bref, un passionné de JavaScript et du web moderne 👨‍💻',
    ],
  },
  {
    title: 'Ma philosophie',
    paragraphs: [
      'J’ai choisi Vue.js comme framework principal, parce qu’il est simple, puissant… et parce que je suis un peu têtu 😅',
      'Oui, je sais, la plupart des entreprises jurent par React, mais Vue c’est cool ✌️',
      'Mon credo : coder proprement, collaborer efficacement, et toujours apprendre de nouvelles choses.',
    ],
  },
  {
    title: 'Fun fact',
    paragraphs: [
      'Quand je ne code pas, je joue (un peu trop) à League of Legends.',
      'D’où le chapeau de Teemo que vous croiserez parfois 🎩',
      'Astuce : certaines icônes du bureau cachent des easter eggs 👀',
    ],
  },
  {
    title: 'Installation terminée',
    paragraphs: [
      'Je pourrais tout vous raconter… mais je dois retourner coder 💻.',
      'Alors j’ai laissé plein d’applications sur le bureau pour me découvrir :',
      '— Mon CV, mes projets, mes skills, et quelques surprises 🎁',
      'Cliquez sur les icônes et explorez. Bonne visite !',
    ],
  },
]

const current = ref(0)
const isFirst = computed(() => current.value === 0)
const isLast  = computed(() => current.value === steps.length - 1)
const progress = computed(() => Math.round((current.value / (steps.length - 1)) * 100))
const nextLabel = computed(() => (isLast.value ? 'Terminer' : 'Suivant'))

function prev() {
  if (!isFirst.value) current.value--
}
function next() {
  if (isLast.value) {
    emit('finish')
    isOpen.value = false
  } else {
    current.value++
  }
}
</script>

<template>
  <WindowsWindow
      v-model:is-open="isOpen"
      title="Assistant d’installation – Mon Portfolio"
      :width="'720px'"
      :height="'520px'"
  >
    <!-- Corps de l'installeur -->
    <div class="flex h-full flex-col items-center gap-2 p-8">
      <!-- Bandeau titre (style Windows) -->
      <h2 class="instruction instruction-primary">{{ steps[current]?.title }}</h2>

      <Lottie link="https://lottie.host/f20ad54a-2961-4153-8107-446dbeb456ad/D2TAG5NhmU.json"  />


      <p v-for="(p, i) in steps[current]?.paragraphs" :key="i" class="mb-2 text-gray-700 text-center">
        {{ p }}
      </p>

      <!-- Boutons dans la SLOT (format imposé) -->
      <section style="display: flex; justify-content: flex-end; gap: 6px">
        <button :disabled="isFirst" @click="prev">Précédent</button>
        <button class="default"  @click="next">{{ nextLabel }}</button>
      </section>
    </div>
  </WindowsWindow>
</template>
