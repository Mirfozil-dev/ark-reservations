<script setup lang="ts">
import { onMounted } from 'vue'
import { useReservationsStore } from '@/stores/reservations'
import ReservationTable from '@/components/ReservationTable.vue'

const store = useReservationsStore()

onMounted(() => store.fetchBookings())
</script>

<template>
  <ReservationTable />
</template>