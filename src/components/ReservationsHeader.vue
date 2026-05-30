<script setup lang="ts">
defineProps<{ restaurantName?: string }>()

</script>

<template>
  <nav class="flex h-11 shrink-0 items-center justify-between bg-navbar px-5">
    <div class="flex items-center gap-2 text-[13px] font-semibold tracking-wide">
      <span class="text-secondary">AIRESTO</span>
      <span class="text-secondary opacity-30">|</span>
      <span class="text-primary">{{ restaurantName || 'Ресторан' }}</span>
    </div>

    <div class="flex items-center gap-2">
      <div
          class="flex items-center gap-2 rounded-[8px] border border-border-search bg-app px-3 py-[5px]"
          style="width:260px"
      >
        <img src="@/assets/images/search.svg" alt="" />
        <input class="text-[12px] text-muted bg-transparent outline-none w-full" placeholder="⌘+Л поиск по имени" />
      </div>
      <button
          class="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] bg-navbar transition-opacity hover:opacity-70"
      >
        <img src="@/assets/images/sun.svg" alt="" />
      </button>

      <button class="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-navbar px-3 text-[12px] font-medium transition-opacity hover:opacity-70">
        <img src="@/assets/images/logout.svg" alt="" />
        Выйти
      </button>
    </div>

  </nav>
</template>