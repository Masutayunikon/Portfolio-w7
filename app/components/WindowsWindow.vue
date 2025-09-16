<template>
  <div
      v-if="isOpen"
      class="window active absolute pointer-events-auto flex flex-col"
      @pointerdown="focusFront"
      :style="{
        width: `clamp(200px, ${widthRef}, 100vw)`,
        height: `clamp(150px, ${heightRef}, 100vh)`,
        top: top + 'px',
        left: left + 'px'
      }"
  >
      <div
          class="title-bar cursor-move select-none touch-none shrink-0"
          @pointerdown="(e) => { focusFront(); onPointerDown(e) }"
          @dblclick="toggleMaximize"
      >
        <div class="title-bar-text overflow-hidden whitespace-nowrap text-ellipsis">
          {{ title }}
        </div>
          <div class="title-bar-controls">
            <!-- ⬇️ stoppe seulement ici pour ne pas lancer le drag -->
            <button v-if="isMinimizable" aria-label="Minimize" @pointerdown.stop></button>
            <button v-if="isMaximizable" aria-label="Maximize" @pointerdown.stop @click="toggleMaximize()" />
            <button aria-label="Close" @pointerdown.stop @click="close"></button>
          </div>
        </div>

        <div class="window-body !p-0 has-space flex-1 min-h-0 has-scrollbar overflow-auto">
          <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: { type: String, default: 'My Application' },
  width: { type: String, default: '400px' },
  height: { type: String, default: '0' },
  isOpen: { type: Boolean, default: true },
  isMaximizable: { type: Boolean, default: true },
  isMinimizable: { type: Boolean, default: true },
  isMaximized: { type: Boolean, default: false },
  initialTop: { type: Number, default: 0 },
  initialLeft: { type: Number, default: 0 },
})

const emit = defineEmits({
  'update:is-open': (v: boolean) => true,
  'focus': null, // pas de payload
})

const widthRef  = ref<string>(props.width)
const heightRef = ref<string>(props.height)
const top       = ref<number>(props.initialTop)
const left      = ref<number>(props.initialLeft)
const maximized = ref<boolean>(props.isMaximized)


function focusFront() {
  emit('focus')
}
const prev = {
  width: ref<string>(props.width),
  height: ref<string>(props.height),
  top: ref<number>(props.initialTop),
  left: ref<number>(props.initialLeft),
}

const isDragging = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

function close() {
  emit('update:is-open', false)
}

function savePrevGeometry() {
  prev.width.value = widthRef.value
  prev.height.value = heightRef.value
  prev.top.value = top.value
  prev.left.value = left.value
}

function maximize() {
  if (!props.isMaximizable) return
  if (!maximized.value) {
    savePrevGeometry()
    maximized.value = true
    top.value = 0
    left.value = 0
    widthRef.value = '100%'
    heightRef.value = '100%'
  } else {
    maximized.value = false
    top.value = prev.top.value
    left.value = prev.left.value
    widthRef.value = prev.width.value
    heightRef.value = prev.height.value
  }
}

function toggleMaximize() {
  if (!props.isMaximizable) return
  maximize()
}

// -------- Pointer events ----------
function onPointerDown(e: PointerEvent) {
  // si clic dans les contrôles, ne pas drag (sécurité double avec @pointerdown.stop)
  const target = e.target as HTMLElement
  if (target.closest('.title-bar-controls')) return
  if (maximized.value) return

  isDragging.value = true
  dragOffsetX.value = e.clientX - left.value
  dragOffsetY.value = e.clientY - top.value

  document.body.style.userSelect = 'none'

  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp, { passive: true })
  window.addEventListener('pointercancel', onPointerUp, { passive: true })
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  // empêcher scroll/pull-to-refresh UNIQUEMENT pendant le drag
  e.preventDefault()

  const vpW = window.innerWidth
  const vpH = window.innerHeight

  const w = toPixels(widthRef.value, vpW)
  const h = toPixels(heightRef.value, vpH)

  let newLeft = e.clientX - dragOffsetX.value
  let newTop  = e.clientY - dragOffsetY.value

  left.value = Math.max(0, Math.min(newLeft, vpW - w))
  top.value  = Math.max(0, Math.min(newTop,  vpH - h))
}

function onPointerUp() {
  isDragging.value = false
  document.body.style.userSelect = ''
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
}

// "400px" / "100%" -> px
function toPixels(val: string, base: number): number {
  if (val.endsWith('%')) return (parseFloat(val) / 100) * base
  return parseFloat(val || '0')
}

const MIN_W = 200; // mêmes bornes que ton clamp CSS
const MIN_H = 150;
const EDGE   = 0;  // petite marge optionnelle

function vp() {
  const vv = window.visualViewport;
  return {
    w: Math.floor(vv?.width  ?? window.innerWidth),
    h: Math.floor(vv?.height ?? window.innerHeight),
  };
}

// convertit "400px"/"80%" → px par rapport au viewport courant
function toPx(val: string, base: number): number {
  if (!val) return 0;
  if (val.endsWith('%')) return (parseFloat(val) / 100) * base;
  return parseFloat(val);
}

function effectiveSize(reqPx: number, vpPx: number, minPx: number) {
  // reflète clamp(min, req, vp)
  return Math.max(minPx, Math.min(reqPx, vpPx));
}

function centerWindow() {
  const { w: vpW, h: vpH } = vp();

  // taille demandée
  const reqW = toPx(widthRef.value,  vpW);
  const reqH = toPx(heightRef.value, vpH);

  // taille réellement affichée (comme clamp(min, req, viewport))
  const effW = effectiveSize(reqW, vpW - EDGE*2, MIN_W);
  const effH = effectiveSize(reqH, vpH - EDGE*2, MIN_H);

  // positions centrées + clamp >= EDGE
  left.value = Math.max(EDGE, Math.round((vpW - effW) / 2));
  top.value  = Math.max(EDGE, Math.round((vpH - effH) / 2));
}

watch(() => props.width,  (v) => { if (!maximized.value) widthRef.value = v })
watch(() => props.height, (v) => { if (!maximized.value) heightRef.value = v })
watch(() => props.isMaximized, (v) => { if (v !== maximized.value) maximize() })

const onVVResize = () => { if (!maximized.value && needsRecenter()) centerWindow(); };

onMounted(() => {
  if (maximized.value) {
    savePrevGeometry()
    top.value = 0
    left.value = 0
    widthRef.value = '100%'
    heightRef.value = '100%'
  }

  if (top.value === 0 && left.value === 0 && !maximized.value) {
    centerWindow();
  }

  window.visualViewport?.addEventListener('resize', onVVResize);
  window.addEventListener('orientationchange', onVVResize);
  window.addEventListener('resize', onVVResize);
})

function needsRecenter() {
  const { w: vpW, h: vpH } = vp();
  const reqW = toPx(widthRef.value,  vpW);
  const reqH = toPx(heightRef.value, vpH);
  const effW = effectiveSize(reqW, vpW - EDGE*2, MIN_W);
  const effH = effectiveSize(reqH, vpH - EDGE*2, MIN_H);
  return left.value + effW > vpW || top.value + effH > vpH || left.value < 0 || top.value < 0;
}


onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  window.visualViewport?.removeEventListener('resize', onVVResize);
  window.removeEventListener('orientationchange', onVVResize);
  window.removeEventListener('resize', onVVResize);
})
</script>
