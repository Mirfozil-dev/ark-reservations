<script setup lang="ts">
defineProps<{ tables: any[] }>()

const TIME_COL_W  = 72
const TABLE_COL_W = 128
const HEADER_H    = 56
</script>

<template>
  <div
    class="sticky top-0 z-[50] flex border-b border-border bg-surface"
    :style="{ height: HEADER_H + 'px' }"
  >
    <div
      class="sticky left-0 z-[60] shrink-0 border-r border-border bg-sidebar"
      :style="{ width: TIME_COL_W + 'px' }"
    />
    
    <div
      v-for="table in tables"
      :key="table.id"
      class="flex shrink-0 flex-col justify-center border-r border-border px-3"
      :style="{ width: TABLE_COL_W + 'px' }"
    >
      <div class="flex items-baseline gap-1 leading-none">
        <span class="text-[13px] font-semibold text-primary">#{{ table.number }}</span>
        <span class="text-[11px] text-secondary">{{ table.capacity }}&nbsp;чел</span>
      </div>
      <div class="mt-[3px] text-[11px] text-muted leading-none">{{ table.zone }}</div>
    </div>
  </div>
</template>
