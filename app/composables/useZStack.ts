import { ref } from 'vue'
export function useZStack(start = 100) {
    const top = ref(start)
    function next() { return ++top.value }
    return { top, next }
}