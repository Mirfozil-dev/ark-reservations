<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  availableDays: string[]
  selectedDay:   string
  allZones:      string[]
  activeZones:   string[]
}>()

const emit = defineEmits<{
  (e: 'select-day',  day:  string): void
  (e: 'toggle-zone', zone: string): void
}>()

const today = dayjs().format('YYYY-MM-DD')

const DAY_SHORT = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}
function dayHint(iso: string) {
  if (iso === today) return 'сегодня'
  if (dayjs(iso).diff(dayjs(today), 'day') === 1) return 'завтра'
  return DAY_SHORT[new Date(iso).getDay()]
}
function isZoneActive(zone: string) {
  return !props.activeZones.length || props.activeZones.includes(zone)
}
</script>

<template>
  <header class="shrink-0 border-b border-border bg-app px-6 pb-4 pt-5">

    <h1 class="mb-5 text-[22px] font-bold text-primary">Бронирования</h1>

    <!-- Дата -->
    <div class="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">Дата</div>
    <div class="mb-4 flex flex-wrap items-start gap-2">
      <button
        v-for="day in availableDays"
        :key="day"
        class="flex flex-col items-start rounded-[10px] px-4 py-2 text-left transition-all duration-150"
        :class="day === selectedDay
          ? 'bg-accent text-white'
          : 'border border-border bg-surface text-secondary hover:opacity-80'"
        @click="emit('select-day', day)"
      >
        <span class="text-[13px] font-semibold leading-tight">{{ formatDate(day) }}</span>
        <span class="text-[11px] opacity-60 leading-tight">{{ dayHint(day) }}</span>
      </button>
    </div>

    <!-- Зоны -->
    <div class="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">Отображаемые зоны</div>
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="zone in allZones"
        :key="zone"
        class="rounded-[8px] px-4 py-[6px] text-[13px] font-medium transition-all duration-150"
        :class="isZoneActive(zone)
          ? 'bg-accent text-white'
          : 'border border-border bg-surface text-secondary hover:opacity-80'"
        @click="emit('toggle-zone', zone)"
      >
        {{ zone }}
      </button>
    </div>

  </header>
</template>
