<template>
  <main class="relative h-dvh w-screen select-none text-white overflow-hidden overscroll-none" :style="mainStyle">
    <!-- Effets -->
    <div class="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay" />
    <div class="pointer-events-none absolute inset-0 z-10" />
    <div class="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>

    <!-- Loading -->
    <div v-if="loading"
         class="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
         style="min-width: 360px; max-width: 70vw;">
      <div class="w-full text-center text-white/90 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,.8)]">
        {{ tip }}
      </div>
      <div role="progressbar" class="marquee" aria-label="Chargement du bureau"></div>
      <div class="w-full text-center text-white/70 mt-2 text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,.7)]">
        Initialisation de l’espace de travail…
      </div>
    </div>

    <!-- Desktop (icônes) -->
    <div v-else class="relative z-20 flex items-center flex-wrap content-start gap-6 w-full bg-transparent p-8">
      <WindowsIcon iconUrl="/img/icons/hire_me.png" description="Mon CV" @click="openWindow.cv = true" />
      <WindowsIcon iconUrl="/img/icons/skills.png" description="Mes Compétences" @click="openWindow.skills = true" />
      <WindowsIcon iconUrl="/img/icons/contact.png" description="Me contacter" @click="openWindow.contact = true" />
      <WindowsIcon iconUrl="/img/icons/blog.png" description="Blog" @click="openWindow.blog = true" />
    </div>

    <!-- Windows layer -->
    <div class="absolute inset-0 pointer-events-none" :style="{ zIndex: z.cv.value }" @pointerdown="bring('cv')">
      <!-- chaque fenêtre réactive les events pour elle-même -->
      <WindowsWindow
          v-model:is-open="openWindow.cv"
          title="Mon CV"
          :width="'800px'"
          :height="'600px'"
          class="pointer-events-auto"
          @focus="bring('cv')"
      >
        <div class="relative w-full h-full">
          <iframe
              src="/pdf?file=contrat.pdf&scroll=win"
              class="has-scrollbar w-full h-full"
          ></iframe>

          <!-- 👇 overlay transparent par-dessus l’iframe -->
          <div
              class="absolute inset-0 z-10"
              v-show="active !== 'cv'"
              @pointerdown.stop.prevent="bring('cv')"
              style="background: transparent; pointer-events: auto;"
          ></div>
        </div>
      </WindowsWindow>
    </div>

    <div class="absolute inset-0 pointer-events-none" :style="{ zIndex: z.blog.value }" @pointerdown="bring('blog')">
      <!-- chaque fenêtre réactive les events pour elle-même -->
      <WindowsWindow
          v-model:is-open="openWindow.blog"
          title="Mon CV"
          :width="'800px'"
          :height="'600px'"
          class="pointer-events-auto"
          @focus="bring('cv')"
      >
        <div class="relative w-full h-full">
          <iframe
              src="/blog"
              class="has-scrollbar w-full h-full"
          ></iframe>

          <!-- 👇 overlay transparent par-dessus l’iframe -->
          <div
              class="absolute inset-0 z-10"
              v-show="active !== 'blog'"
              @pointerdown.stop.prevent="bring('blog')"
              style="background: transparent; pointer-events: auto;"
          ></div>
        </div>
      </WindowsWindow>
    </div>

    <div class="absolute inset-0 pointer-events-none" :style="{ zIndex: z.skills.value}" @pointerdown="bring('skills')">
      <WindowsWindow
          v-model:is-open="openWindow.skills"
          title="Mes Compétences"
          :width="'600px'"
          :height="'300px'"
          class="pointer-events-auto"
          @focus="bring('skills')"
      >
        <!-- MENU -->
        <menu
            role="tablist"
            aria-label="Skills Tabs"
            @keydown.left.prevent="prevTab()"
            @keydown.right.prevent="nextTab()"
            class="flex flex-wrap-reverse"
        >
          <button
              v-for="s in skills"
              :key="s.id"
              role="tab"
              :aria-controls="s.id"
              :aria-selected="activeSkills === s.id"
              @click="setTab(s.id)"
              class="flex items-center gap-2 px-3 py-1 text-sm"
          >
            <Icon :name="s.icon" />
            {{ s.label }}
          </button>
        </menu>

        <!-- PANELS -->
        <article
            v-for="s in skills"
            :key="s.id"
            role="tabpanel"
            :id="s.id"
            :hidden="activeSkills !== s.id"
            class="text-gray-800 p-4 space-y-4"
        >
          <!-- Header skill -->
          <div class="bg-gray-100 border border-gray-300 px-3 py-1 rounded text-sm font-medium">
            {{ s.years?.perso }} ans perso
            <span v-if="s.years?.pro"> — {{ s.years.pro }} an(s) pro</span>
          </div>

          <!-- Description -->
          <p v-if="s.description" class="leading-snug">
            {{ s.description }}
          </p>

          <!-- Projets -->
          <div v-if="s.projects?.length" class="space-y-1">
            <h3 class="text-sm font-semibold text-gray-700">Projets notables :</h3>
            <ul class="list-disc pl-5 text-sm space-y-1">
              <li v-for="p in s.projects" :key="p.url">
                <a :href="p.url" target="_blank" class="text-blue-600 hover:underline">
                  {{ p.name }}
                </a>
                <span v-if="p.note"> — {{ p.note }}</span>
              </li>
            </ul>
          </div>
        </article>
      </WindowsWindow>
    </div>


    <div class="absolute inset-0 pointer-events-none" :style="{ zIndex: z.intro.value}">
      <!-- chaque fenêtre réactive les events pour elle-même -->
      <IntroWindow  @focus="bring('intro')" v-model="openWindow.intro"/>
    </div>

    <div class="absolute inset-0 pointer-events-none" :style="{ zIndex: z.contact.value}">
      <!-- chaque fenêtre réactive les events pour elle-même -->
      <WindowsWindow
          v-model:is-open="openWindow.contact"
          title="Me contacter"
          :width="'300px'"
          :height="'450px'"
          class="pointer-events-auto"
          @focus="bring('contact')"
      >
        <div class="p-4 text-black text-sm flex flex-col items-center w-full">
          <div class="group w-full">
            <label for="text30">Email</label>
            <input v-model="email.from" id="text30" type="text" />
          </div>
          <div class="group w-full">
            <label for="text34">Nom</label>
            <input v-model="email.name" id="text34" type="text" />
          </div>
          
          <div class="group w-full">
            <label for="text31">Sujet</label>
            <input v-model="email.subject" id="text31" type="text" />
          </div>
          <div class="group w-full">
            <label for="text32">Message</label>
            <textarea v-model="email.message" id="text32" rows="8"></textarea>
          </div>
          <button class="mt-2 default"  @click="sendEmail">
            <span v-if="isSending" class="loader animate" aria-label="Envoi en cours"></span>
            <span v-else>Envoyer</span>
          </button>
        </div>
      </WindowsWindow>
    </div>
  </main>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type CSSProperties } from 'vue'
import { useZStack } from '~/composables/useZStack'

type app = 'cv' | 'intro' | 'skills' | 'projects' | 'contact' | 'blog';

const { next } = useZStack(100)

const active = ref<app | null>('intro')

const z = {
  cv: ref(next()),
  intro: ref(next()),
  skills: ref(next()),
  contact: ref(next()),
  blog: ref(next()),
  // plus tard: projects: ref(next()), etc.
}

function bring(id: keyof typeof z) {
  z[id].value = next()
  active.value = id
}

const isSending = ref(false)
const email = ref({
  from: '',
  name: '',
  subject: '',
  message: '',
})

const sendEmail = async () => {

  if (isSending.value) return
  isSending.value = true

  const response = await $fetch('/api/contact', {
    method: 'POST',
    body: {
      email: email.value.from,
      name: email.value.name,
      subject: email.value.subject,
      message: email.value.message,
    },
  })

  isSending.value = false

  if (response && response.ok) {
    alert('Message envoyé avec succès !')
    email.value = { from: '', name: '', subject: '', message: '' }
  } else {
    alert('Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.')
  }
}




const wallpaperUrl = ref('')
const loading = ref(true)

const openWindow = ref({
  cv: false,
  intro: true,
  skills: false,
  contact: false,
  blog: false,
})


const winIds = ['cv','intro','skills', 'contact'] as const
type WinId = typeof winIds[number]

(['cv','intro','skills', 'contact'] as const).forEach((id) => {
  watch(
      () => openWindow.value[id],
      (isOpen) => { if (isOpen) bring(id) }
  )
})

watch(() => openWindow.value[active.value as WinId], (isOpen) => {
  if (active.value && isOpen === false) active.value = null
})

// --- Messages mignons (changent toutes les 2 s)
const tips = [
  "Préparation des pixels…",
  "Astiquage de l’Aero ✨",
  "Démarrage des services du Bureau…",
  "Chargement des gadgets…",
  "Réchauffage du fond d’écran ☕",
  "Optimisation des icônes…",
  "Connexion à l’imaginaire…",
  "Synchronisation des nuages…",
]
const tip = ref(tips[Math.floor(Math.random() * tips.length)])
let tipTimer: number | undefined
function startTips() {
  stopTips()
  tipTimer = window.setInterval(() => {
    let next = tips[Math.floor(Math.random() * tips.length)]
    if (next === tip.value) next = tips[(tips.indexOf(next) + 1) % tips.length]
    tip.value = next
  }, 2000) // ← toutes les 2s
}
function stopTips() {
  if (tipTimer) { clearInterval(tipTimer); tipTimer = undefined }
}

function dims() {
  return { w: Math.max(1, window.innerWidth), h: Math.max(1, window.innerHeight) }
}

function makeUrls() {
  const { w, h } = dims()
  const seed = (crypto?.getRandomValues?.(new Uint32Array(1))?.[0] ?? Math.random()).toString(36)
  const ts = Date.now()

  // 1) Picsum avec seed (redirige parfois vers fastly.*)
  const picsumSeed = `https://picsum.photos/seed/${seed}/${w * 2}/${h * 2}?t=${ts}`
  // 2) Picsum sans seed (autre chemin, souvent plus tolérant)
  const picsumRandom = `https://picsum.photos/${w * 2}/${h * 2}?random=${ts}`
  // 3) Unsplash source (parfois 503 ; on garde en dernier)
  const unsplash = `https://source.unsplash.com/random/${w * 2}x${h * 2}?sig=${seed}&t=${ts}`

  return [picsumSeed, picsumRandom, unsplash]
}


function preload(url: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image()
    // IMPORTANT : pas de crossOrigin -> pas de CORS requis pour un background
    img.onload = async () => {
      try {
        // assure le décodage complet
        // @ts-ignore
        if (typeof img.decode === 'function') await img.decode()
      } catch {}
      resolve(url)
    }
    img.onerror = () => reject(new Error('load error'))
    img.src = url
  })
}

/** Petite aide: attendre que le style soit appliqué ET peint */
function afterNextPaint(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

async function setWallpaper() {
  loading.value = true
  startTips()

  let readyUrl: string | null = null
  for (const u of makeUrls()) {
    try {
      readyUrl = await preload(u) // attend le décodage complet
      break
    } catch { /* essaie l’autre URL */ }
  }

  // si aucun provider n'a répondu, on sort proprement (on garde l'ancien fond s'il existe)
  if (!readyUrl) {
    stopTips()
    loading.value = false
    return
  }

  // Assignation + disparition de la barre dans la même frame -> affichage instantané
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      wallpaperUrl.value = readyUrl!
      requestAnimationFrame(() => {
        stopTips()
        loading.value = false
        resolve()
      })
    })
  })
}

let resizeTimer: number | undefined
function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => setWallpaper(), 250)
}

onMounted(() => {
  setWallpaper()
  //window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  //window.removeEventListener('resize', onResize)
  stopTips()
})

const mainStyle = computed<CSSProperties>(() => ({
  backgroundImage: wallpaperUrl.value ? `url("${wallpaperUrl.value}")` : '',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#000',
  transition: 'filter .35s ease, opacity .35s ease',
  filter: wallpaperUrl.value
      ? 'contrast(1.05) saturate(1.08) hue-rotate(-2deg) brightness(0.98)'
      : '',
}))






// SKILLS

type Skill = {
  id: string
  label: string,
  icon: string,
  years?: { pro?: number, perso?: number },
  description?: string,
  projects?: { name: string, url: string, note?: string }[]
}

const skillsOpen = ref(true)
const skills = ref<Skill[]>([
  {
    id: 'nuxt',
    label: 'Nuxt',
    icon: 'devicon:nuxt',
    years: { pro: 1, perso: 3 },
    description: `Utilisé depuis la sortie de la v3. 1 an en environnement professionnel chez Pappers (refonte front-end de Laravel+Vue vers Nuxt). En parallèle, forte expérience personnelle sur des projets variés (portfolio, dashboard EIP, sites expérimentaux).`,
    projects: [
      { name: 'TinderMovie', url: 'https://github.com/Masutayunikon/TinderMovie', note: 'Reco de films façon Tinder' },
      { name: 'Arasgrasa', url: 'https://github.com/Masutayunikon/Arasgrasa', note: 'Indexation Google (projet solo)' },
      { name: 'GitFolio', url: 'https://github.com/Masutayunikon/GitFolio', note: 'Générateur de portfolio GitHub' },
      { name: 'Flower-Fest', url: 'https://github.com/Masutayunikon/Flower-Fest', note: 'Landing page fictive pour un festival' },
      { name: 'Particule-life-js', url: 'https://github.com/Masutayunikon/Particule-life-js', note: 'Simulation de particules inspirée du jeu de la vie' },
    ],
  },
  {
    id: 'vue',
    label: 'Vue.js',
    icon: 'devicon:vuejs',
    years: { pro: 2, perso: 4 },
    description: `Pratique initiée en 1ère année. Consolidée lors d’un stage chez BBN, via leur framework interne (APPUI) pour micro-apps web. Expérience confirmée sur des projets pros et persos, souvent en combinaison avec Nuxt.`,
  },
  {
    id: 'php',
    label: 'PHP',
    icon: 'devicon:php',
    years: { pro: 1, perso: 0 },
    description: `1 an d’expérience pro chez BBN sur le backend d’APPUI. Familiarité renforcée par une piscine intensive à l’école.`,
  },
  {
    id: 'tailwind',
    label: 'TailwindCSS',
    icon: 'devicon:tailwindcss',
    years: { pro: 1, perso: 3 },
    description: `Adopté après une solide base en CSS natif. Forte productivité et grande souplesse dans la création d’interfaces modernes. Expérience significative en pro et perso.`,
  },
  {
    id: 'ts',
    label: 'TypeScript',
    icon: 'devicon:typescript',
    years: { pro: 1, perso: 3 },
    description: `Utilisé principalement avec Nuxt et Vue. Apporte robustesse et améliore l’autocomplétion. Bonne maîtrise en contexte pro et perso.`,
  },
  {
    id: 'node',
    label: 'Node.js',
    icon: 'devicon:nodejs',
    years: { pro: 2, perso: 5 },
    description: `Expérience de 5 ans incluant APIs REST, bots Discord et projets expérimentaux. 2 ans en contexte professionnel (Nuxt backend, intégration CodeMirror chez BBN).`,
    projects: [
      { name: 'PokeTech', url: 'https://github.com/Masutayunikon/PokeTech' },
      { name: 'JukeBox', url: 'https://github.com/Masutayunikon/JukeBox', note: 'Bot Discord musical (Spotify)' },
    ],
  },
  {
    id: 'python',
    label: 'Python',
    icon: 'devicon:python',
    years: { pro: 0, perso: 5 },
    description: `5 ans d’usage en scripts personnels et mini-projets (automatisation, prototypes, Clash of Code).`,
    projects: [
      { name: 'ABI – Automate by Image', url: 'https://github.com/Masutayunikon/ABI' },
    ],
  },
  {
    id: 'docker',
    label: 'Docker & Self-Hosting',
    icon: 'devicon:docker',
    years: { pro: 0, perso: 2 },
    description: `Gestion d’un serveur personnel basé sur Runtipi pour déployer et maintenir des applications Dockerisées.
Écosystème complet autour des applications *Arr* (Sonarr, Radarr, Bazarr, Prowlarr…) et de Jellyfin/Jellyseerr pour la gestion et la diffusion de contenus multimédia.
Création et publication d’apps personnalisées pour un app-store Runtipi (ex: qBittorrent + NordVPN combinés, déploiement automatisé de projets Nuxt.js).
Administration d’un serveur Linux multi-utilisateurs (≈30 comptes) avec automatisations (Wizard pour l’inscription, Jellyseerr pour demandes auto FR/1080p≥10Go, plugins Jellyfin pour la maintenance).`,
    projects: [
      { name: 'Runtipi App-Store perso', url: 'https://github.com/Masutayunikon/runtipi-appstore', note: 'Apps customisées et packaging Docker' },
    ],
  },
])


const activeSkills = ref<Skill['id']>('nuxt')

function setTab(id: Skill['id']) {
  activeSkills.value = id
  requestAnimationFrame(() => {
    const btn = document.querySelector<HTMLButtonElement>(`[role="tab"][aria-controls="${id}"]`)
    btn?.focus()
  })
}
function nextTab() {
  const ids = skills.value.map(s => s.id)
  const i = ids.indexOf(activeSkills.value)
  setTab(ids[(i + 1) % ids.length])
}
function prevTab() {
  const ids = skills.value.map(s => s.id)
  const i = ids.indexOf(activeSkills.value)
  setTab(ids[(i - 1 + ids.length) % ids.length])
}

</script>




<style scoped>

</style>
