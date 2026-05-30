import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSelectionStore = defineStore('selection', () => {
    const isSelecting = ref(false)

    // Столы, которые вошли в выделение
    const tableIds = ref<string[]>([])

    // Начало и конец выделения в Unix ms
    const startMs = ref<number | null>(null)
    const endMs   = ref<number | null>(null)

    const hasSelection = computed(
        () => startMs.value !== null && tableIds.value.length > 0
    )

    // Нормализованные границы (start < end всегда)
    const selectionStart = computed(() =>
        Math.min(startMs.value ?? 0, endMs.value ?? 0)
    )
    const selectionEnd = computed(() =>
        Math.max(startMs.value ?? 0, endMs.value ?? 0)
    )

    function begin(tableId: string, ms: number) {
        isSelecting.value = true
        startMs.value     = ms
        endMs.value       = ms + minutesSlot * 60_000
        tableIds.value    = [tableId]
    }

    function extend(tableId: string, ms: number) {
        if (!isSelecting.value) return
        endMs.value = ms + minutesSlot * 60_000
        addTable(tableId)
    }

    function addTable(tableId: string) {
        if (!tableIds.value.includes(tableId)) {
            tableIds.value = [...tableIds.value, tableId]
        }
    }

    function finish() {
        isSelecting.value = false
    }

    function clear() {
        isSelecting.value = false
        startMs.value     = null
        endMs.value       = null
        tableIds.value    = []
    }

    function create() {
        if (!hasSelection.value) return
        console.log({
            tableIds:  tableIds.value,
            startTime: new Date(selectionStart.value).toISOString(),
            endTime:   new Date(selectionEnd.value).toISOString(),
        })
        clear()
    }

    // 15 мин — минимальная единица выделения
    const minutesSlot = 15

    return {
        isSelecting,
        tableIds,
        startMs,
        endMs,
        hasSelection,
        selectionStart,
        selectionEnd,
        begin,
        extend,
        finish,
        clear,
        create,
    }
})