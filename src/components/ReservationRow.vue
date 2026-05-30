<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline }           from '@/composables/useTimeline'
import { getEventVerticalStyle } from '@/utils/position-event'
import { useSelectionStore }     from '@/stores/selection'

const props = defineProps<{
  table:     any
  events:    any[]
  openingMs: number
}>()

const TABLE_COL_W = 128

const { slots, slotHeight, minutesPerSlot } = useTimeline()
const slotH = slotHeight

const totalHeight = computed(() => slots.value.length * slotH)

const selectionStore = useSelectionStore()

const selectionStyle = computed(() => {
  if (!selectionStore.hasSelection) return null
  if (!selectionStore.tableIds.includes(props.table.id)) return null
  const top    = (selectionStore.selectionStart - props.openingMs) / (minutesPerSlot * 60_000) * slotH
  const height = (selectionStore.selectionEnd - selectionStore.selectionStart) / (minutesPerSlot * 60_000) * slotH
  if (height <= 0) return null
  return { top: `${Math.max(top, 0)}px`, height: `${height}px` }
})

function yToMs(y: number): number {
  return props.openingMs + Math.floor(Math.max(y, 0) / slotH) * minutesPerSlot * 60_000
}
function getRelativeY(e: MouseEvent): number {
  return e.clientY - (e.currentTarget as HTMLElement).getBoundingClientRect().top
}
function onMouseDown(e: MouseEvent) {
  if ((e.target as Element).closest('[data-event]')) return
  e.preventDefault()
  selectionStore.begin(props.table.id, yToMs(getRelativeY(e)))
}
function onMouseMove(e: MouseEvent) {
  if (!selectionStore.isSelecting) return
  selectionStore.extend(props.table.id, yToMs(getRelativeY(e)))
}

function borderColor(ev: any): string {
  if (ev.type === 'banquet') return 'var(--event-border-banquet)'
  if (ev.type === 'order') {
    return ({ New: 'var(--event-border-order-new)', Bill: 'var(--event-border-order-bill)', Closed: 'var(--event-border-order-closed)' } as any)[ev.status] ?? 'var(--event-border-order-new)'
  }
  return ({
    'Новая': 'var(--event-border-res-new)', 'Заявка': 'var(--event-border-res-request)',
    'Открыт': 'var(--event-border-res-open)', 'Закрыт': 'var(--event-border-res-closed)',
    'Живая очередь': 'var(--event-border-queue)',
  } as any)[ev.status] ?? 'var(--border)'
}

function bgColor(ev: any): string {
  if (ev.type === 'banquet') return 'var(--event-bg-banquet)'
  if (ev.type === 'order') {
    return ({ New: 'var(--event-bg-order-new)', Bill: 'var(--event-bg-order-bill)', Closed: 'var(--event-bg-order-closed)' } as any)[ev.status] ?? 'var(--event-bg-order-new)'
  }
  return ({
    'Новая': 'var(--event-bg-res-new)', 'Заявка': 'var(--event-bg-res-request)',
    'Открыт': 'var(--event-bg-res-open)', 'Закрыт': 'var(--event-bg-res-closed)',
    'Живая очередь': 'var(--event-bg-queue)',
  } as any)[ev.status] ?? 'var(--bg-surface)'
}

function statusLabel(ev: any): string {
  if (ev.type === 'banquet') return 'Банкет'
  if (ev.type === 'order') return ({ New: 'Новый', Bill: 'Пречек', Closed: 'Закрытый' } as any)[ev.status] ?? ev.status
  return ({
    'Новая': 'Ожидает подтверждения', 'Заявка': 'Ожидаем', 'Открыт': 'В зале',
    'Закрыт': 'Отменен', 'Живая очередь': 'Живая очередь',
  } as any)[ev.status] ?? ev.status
}

function statusColor(ev: any): string {
  if (ev.type === 'banquet') return 'var(--status-banquet)'
  if (ev.type === 'order')   return 'var(--status-order)'
  return ({
    'Новая': 'var(--status-new)', 'Заявка': 'var(--status-request)',
    'Открыт': 'var(--status-open)', 'Закрыт': 'var(--status-closed)',
    'Живая очередь': 'var(--status-queue)',
  } as any)[ev.status] ?? 'var(--status-order)'
}

function fmtTime(ms: number) {
  return new Date(ms).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div
      class="relative shrink-0 border-r border-border"
      :style="{ width: TABLE_COL_W + 'px', height: totalHeight + 'px' }"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
  >
    <div
        v-for="(_, i) in slots"
        :key="i"
        class="absolute left-0 right-0 border-b border-grid"
        :style="{ top: i * slotH + 'px', height: slotH + 'px' }"
    />

    <div
        v-if="selectionStyle"
        class="pointer-events-none absolute left-0 right-0 z-[20] rounded-[4px]"
        :style="{ ...selectionStyle, background: 'var(--color-accent)', opacity: 0.25, outline: '2px solid var(--color-accent)' }"
    />

    <div
        v-for="ev in events"
        :key="ev.id"
        data-event
        class="event-card group absolute"
        :style="{
        ...getEventVerticalStyle(ev, { openingMs, slotHeight: slotH, minutesPerSlot }),
        left: '3px',
        right: '3px',
        zIndex: 10,
        cursor: 'pointer',
        borderRadius: '4px',
        overflow: 'hidden',
        borderLeft: `3px solid ${borderColor(ev)}`,
        background: bgColor(ev),
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow .15s',
      }"
    >
      <div class="event-card__blur pointer-events-none absolute inset-0" style="z-index:0" />

      <div
          class="event-card__shine pointer-events-none absolute inset-0"
          style="background:rgba(255,255,255,0.07); opacity:0; transition:opacity .15s; z-index:1"
      />

      <div class="relative flex h-full flex-col px-2 py-[5px]" style="gap:1px; overflow:hidden; z-index:2">

        <div
            v-if="ev.type === 'reservation'"
            class="text-[10px] font-medium leading-none"
            style="color:var(--text-muted)"
        >
          №{{ ev.id }}
        </div>

        <div class="flex items-baseline gap-1 leading-tight">
          <span class="truncate text-[12px] font-bold" style="color:var(--text-primary)">
            {{ ev.type === 'reservation' ? ev.name : 'Заказ' }}
          </span>
          <span v-if="ev.people" class="shrink-0 text-[11px] font-semibold" style="color:var(--text-primary)">
            ; {{ ev.people }}&nbsp;чел
          </span>
        </div>

        <div class="truncate text-[10px] font-medium leading-tight" :style="{ color: statusColor(ev) }">
          {{ statusLabel(ev) }}
        </div>

        <div
            v-if="ev.phone"
            class="event-card__phone text-[10px] leading-tight"
            style="color:var(--text-secondary)"
        >
          ☎&thinsp;{{ ev.phone }}
        </div>

        <div class="mt-auto truncate text-[10px] font-medium leading-tight" style="color:var(--text-muted)">
          {{ fmtTime(ev.start) }}–{{ fmtTime(ev.end) }}
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.event-card__blur {
  backdrop-filter: blur(0px);
  transition: backdrop-filter 0.15s;
}
.event-card:hover .event-card__blur {
  backdrop-filter: blur(4px);
}

.event-card:hover .event-card__shine {
  opacity: 1 !important;
}

.event-card:hover {
  box-shadow: var(--shadow-card-hover) !important;
  z-index: 30 !important;
}

.event-card__phone {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.15s ease, opacity 0.15s ease;
}
.event-card:hover .event-card__phone {
  max-height: 20px;
  opacity: 1;
}
</style>