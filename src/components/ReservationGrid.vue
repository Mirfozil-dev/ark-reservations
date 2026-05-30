<script setup lang="ts">
import { computed } from 'vue'
import ReservationRow from '@/components/ReservationRow.vue'
import { useTimeline }  from '@/composables/useTimeline'

const props = defineProps<{
  tables:          any[]
  events:          any[]
  openingMs:       number
  currentTimeTop?: number | null
}>()

const TIME_COL_W = 72

const { slots, slotHeight } = useTimeline()
const slotH = slotHeight

// Показываем метку каждые 30 мин
function showLabel(slot: string) {
  return slot.endsWith(':00') || slot.endsWith(':30')
}

// Полная ширина колонок (для линии текущего времени)
const columnsWidth = computed(() => props.tables.length * 128)
</script>

<template>
  <!-- position:relative нужен для абсолютной линии текущего времени -->
  <div class="relative flex">

    <!-- Sticky left — время -->
    <div
        class="sticky left-0 z-[40] shrink-0 border-r border-border bg-sidebar"
        :style="{ width: TIME_COL_W + 'px' }"
    >
      <div
          v-for="(slot, i) in slots"
          :key="i"
          class="relative border-b border-grid"
          :style="{ height: slotH + 'px' }"
      >
        <span
            v-if="showLabel(slot)"
            class="absolute right-2 select-none text-[11px] font-medium text-muted"
            style="top: -8px; line-height: 1"
        >
          {{ slot }}
        </span>
      </div>
    </div>

    <!-- Колонки столов -->
    <ReservationRow
        v-for="table in tables"
        :key="table.id"
        :table="table"
        :events="events.filter((e: any) => e.tableId === table.id)"
        :opening-ms="openingMs"
    />

    <!-- Линия текущего времени -->
    <div
        v-if="currentTimeTop != null && currentTimeTop >= 0"
        class="pointer-events-none absolute z-[35]"
        :style="{
        top:    currentTimeTop + 'px',
        left:   TIME_COL_W + 'px',
        width:  columnsWidth + 'px',
        height: '2px',
        background: '#ef4444',
      }"
    >
      <!-- Кружок слева -->
      <div
          class="absolute -left-[5px] -top-[4px] h-[10px] w-[10px] rounded-full bg-red-500"
      />
    </div>

  </div>
</template>