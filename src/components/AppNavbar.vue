<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/composables/useTheme'
import { useReservationsStore } from '@/stores/reservations'

defineProps<{ restaurantName?: string }>()

const { theme, toggleTheme } = useTheme()

const store = useReservationsStore()
const { searchQuery, restaurantNow, data } = storeToRefs(store)

// Форматирование текущего времени ресторана
const restaurantTimeStr = computed(() => {
  if (!restaurantNow.value) return ''
  return restaurantNow.value.format('HH:mm')
})

const timezone = computed(() => data.value?.restaurant?.timezone ?? '')
</script>

<template>
  <nav class="flex h-11 shrink-0 items-center justify-between border-b border-border bg-navbar px-5">

    <!-- Brand и время ресторана -->
    <div class="flex items-center gap-3 text-[13px] font-semibold tracking-wide">
      <span class="text-secondary">AIRESTO</span>
      <span class="text-secondary opacity-30">|</span>
      <span class="text-primary">{{ restaurantName || 'Ресторан' }}</span>

      <!-- Текущее время ресторана -->
      <div
          v-if="restaurantTimeStr"
          class="flex items-center gap-1.5 rounded-[6px] border border-border bg-app px-2 py-[2px]"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span class="text-[12px] font-medium tabular-nums text-secondary">{{ restaurantTimeStr }}</span>
        <span class="text-[10px] text-muted">{{ timezone }}</span>
      </div>
    </div>

    <!-- Поиск -->
    <div
        class="flex items-center gap-2 rounded-[8px] border border-border bg-app px-3 py-[5px] focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 transition-all"
        style="width:280px"
    >
      <svg class="shrink-0 text-muted" width="13" height="13" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.8"/>
        <path d="M14 14l3.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <input
          v-model="searchQuery"
          type="text"
          placeholder="⌘+Л поиск по имени"
          class="w-full bg-transparent text-[12px] text-primary outline-none placeholder:text-muted"
      />
      <button
          v-if="searchQuery"
          class="shrink-0 text-muted hover:text-primary transition-colors"
          @click="searchQuery = ''"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Действия -->
    <div class="flex items-center gap-2">
      <button
          class="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-border bg-app text-secondary transition-opacity hover:opacity-70"
          :title="theme === 'light' ? 'Тёмная тема' : 'Светлая тема'"
          @click="toggleTheme"
      >
        <svg v-if="theme === 'light'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>

      <button class="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-border bg-app px-3 text-[12px] font-medium text-secondary transition-opacity hover:opacity-70">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        Выйти
      </button>
    </div>

  </nav>
</template>