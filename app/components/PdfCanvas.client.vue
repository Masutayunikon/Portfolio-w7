<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'

const route = useRoute()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const props = defineProps({
  filename: { type: String, default: 'cv.pdf' },
})

onMounted(async () => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

  // ⚠️ sécurise : ne pas laisser l’utilisateur taper n’importe quel chemin
  // Ici, on suppose que les PDFs sont tous dans /public/docs/
  const src = `/docs/${props.filename}`

  console.log(src)

  try {
    const pdf = await pdfjsLib.getDocument(src).promise
    const page = await pdf.getPage(1)

    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = canvasRef.value!
    const ctx = canvas.getContext('2d')!

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({ canvasContext: ctx, viewport }).promise
  } catch (err) {
    console.error('Erreur chargement PDF:', err)
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="overflow-hidden w-full h-full"></canvas>
</template>
