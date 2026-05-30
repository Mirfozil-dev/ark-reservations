<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import AppNavbar           from '@/components/AppNavbar.vue'
import AppPageHeader       from '@/components/AppPageHeader.vue'
import ReservationTimeline from '@/components/ReservationTimeline.vue'
import ReservationGrid     from '@/components/ReservationGrid.vue'

import { useReservationsStore } from '@/stores/reservations'
import { useSelectionStore }    from '@/stores/selection'

const store = useReservationsStore()
const selectionStore = useSelectionStore()

const { data, filteredEvents, selectedDay, currentTimeLine } = storeToRefs(store)

const restaurant    = computed(() => data.value?.restaurant)
const availableDays = computed<string[]>(() => data.value?.available_days ?? [])

const allZones = computed<string[]>(() => {
  const s = new Set<string>()
  data.value?.tables?.forEach(t => s.add(t.zone))
  return [...s]
})

const activeZones = ref<string[]>([])

const filteredTables = computed(() => {
  const tables = data.value?.tables ?? []
  if (!activeZones.value.length) return tables
  return tables.filter(t => activeZones.value.includes(t.zone))
})

function toggleZone(zone: string) {
  activeZones.value = activeZones.value.includes(zone)
      ? activeZones.value.filter(z => z !== zone)
      : [...activeZones.value, zone]
}

// Форматирование мс → "HH:mm"
function fmtMs(ms: number) {
  return new Date(ms).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

// Снять выделение кликом на пустую область
function onGridClick(e: MouseEvent) {
  if ((e.target as Element).closest('[data-event]')) return
  if ((e.target as Element).closest('[data-selection-btn]')) return
  // не снимаем — пусть пользователь явно нажмёт ✕
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-app" @mouseup="selectionStore.finish()">

    <AppNavbar :restaurant-name="restaurant?.restaurant_name" />

    <AppPageHeader
        :available-days="availableDays"
        :selected-day="selectedDay"
        :all-zones="allZones"
        :active-zones="activeZones"
        @select-day="store.selectDay"
        @toggle-zone="toggleZone"
    />

    <!-- Таблица -->
    <div class="flex-1 overflow-auto" @click="onGridClick">
      <div class="w-max">
        <ReservationTimeline :tables="filteredTables" />
        <ReservationGrid
            :tables="filteredTables"
            :events="filteredEvents"
            :opening-ms="store.openingMs"
            :current-time-top="currentTimeLine"
        />
      </div>
    </div>

    <!-- ═══ Плавающая панель выделения ═══ -->
    <Transition name="slide-up">
      <div
          v-if="selectionStore.hasSelection"
          data-selection-btn
          class="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-xl bg-accent px-5 py-3 shadow-2xl"
      >
        <div class="text-[13px] text-white/90">
          <span class="font-semibold">{{ selectionStore.tableIds.length }}</span>
          {{ selectionStore.tableIds.length === 1 ? 'стол' : 'стола/столов' }}
          &nbsp;·&nbsp;
          {{ fmtMs(selectionStore.selectionStart) }}–{{ fmtMs(selectionStore.selectionEnd) }}
        </div>

        <button
            class="rounded-lg bg-white/20 px-4 py-[6px] text-[13px] font-semibold text-white transition hover:bg-white/30"
            @click="selectionStore.create()"
        >
          Создать
        </button>

        <button
            class="text-white/50 transition hover:text-white"
            @click="selectionStore.clear()"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}
</style>