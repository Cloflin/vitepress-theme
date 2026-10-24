import { onMounted, onUnmounted, ref } from 'vue'

/** One dialog per page; every trigger flips the same flag. */
export const searchOpen = ref(false)

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
}

/** ⌘K / Ctrl+K anywhere, `/` outside a text field. */
export function useSearchHotkey() {
  const handler = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      searchOpen.value = !searchOpen.value
    } else if (e.key === '/' && !searchOpen.value && !isEditable(e.target)) {
      e.preventDefault()
      searchOpen.value = true
    }
  }
  onMounted(() => window.addEventListener('keydown', handler))
  onUnmounted(() => window.removeEventListener('keydown', handler))
}

/** `D` flips the appearance, as on unlumen UI Docs; ignored while typing or with a modifier. */
export function useThemeHotkey(toggle: () => void) {
  const handler = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
    if (isEditable(e.target) || searchOpen.value) return
    if (e.key.toLowerCase() !== 'd') return
    e.preventDefault()
    toggle()
  }
  onMounted(() => document.addEventListener('keydown', handler))
  onUnmounted(() => document.removeEventListener('keydown', handler))
}
