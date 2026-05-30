/**
 * src/stores/reservations.ts
 */
import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import utc      from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import { bookingApi }     from '@/api/booking.api'
import { mapBookingEvents } from '@/api/booking.mapper'
import type { BookingResponse } from '@/api/booking.types'

export const useReservationsStore = defineStore('reservations', () => {
    const loading = ref(false)
    const error   = ref<string | null>(null)
    const data    = ref<BookingResponse | null>(null)

    const selectedDay  = ref<string>('')
    const searchQuery  = ref<string>('')

    // ── Текущее время ресторана ──────────────────────────────
    const restaurantNow = ref<dayjs.Dayjs | null>(null)
    let _clockInterval: ReturnType<typeof setInterval> | null = null

    watch(data, (val) => {
        if (!val?.restaurant?.timezone) return
        const tz = val.restaurant.timezone

        restaurantNow.value = dayjs().tz(tz)

        if (_clockInterval) clearInterval(_clockInterval)
        _clockInterval = setInterval(() => {
            restaurantNow.value = dayjs().tz(tz)
        }, 1000)
    }, { immediate: true })

    // ── Все события (маппер) ─────────────────────────────────
    const events = computed(() =>
        data.value ? mapBookingEvents(data.value) : []
    )

    // ── Timestamp открытия в TZ ресторана ────────────────────
    const openingMs = computed(() => {
        const day  = selectedDay.value || data.value?.current_day
        const time = data.value?.restaurant?.opening_time ?? '11:00'
        const tz   = data.value?.restaurant?.timezone ?? 'UTC'
        if (!day) return 0
        return dayjs.tz(`${day}T${time}:00`, tz).valueOf()
    })

    // ── События только выбранного дня ────────────────────────
    const dayEvents = computed(() => {
        if (!data.value || !selectedDay.value) return events.value

        const tz       = data.value.restaurant?.timezone ?? 'UTC'
        const dayStart = dayjs.tz(`${selectedDay.value}T00:00:00`, tz).valueOf()
        const dayEnd   = dayjs.tz(`${selectedDay.value}T23:59:59`, tz).valueOf()

        return events.value.filter(e => e.start >= dayStart && e.start <= dayEnd)
    })

    // ── Фильтрация по поисковому запросу ────────────────────
    const filteredEvents = computed(() => {
        const q = searchQuery.value.trim().toLowerCase()
        if (!q) return dayEvents.value

        return dayEvents.value.filter(e =>
            e.name?.toLowerCase().includes(q) ||
            e.phone?.toLowerCase().includes(q)
        )
    })

    // ── Top offset линии текущего времени ───────────────────
    const currentTimeLine = computed(() => {
        if (!restaurantNow.value || !openingMs.value) return null
        const diffMin = (restaurantNow.value.valueOf() - openingMs.value) / 60_000
        if (diffMin < 0) return null
        // 40px / 15min
        return (diffMin / 15) * 40
    })

    // ── Загрузка данных ─────────────────────────────────────
    async function fetchBookings() {
        try {
            loading.value = true
            error.value   = null

            const response = await bookingApi.getBookings()

            data.value        = response
            selectedDay.value = response.current_day
        } catch (err: any) {
            error.value = err.message ?? 'Unknown error'
        } finally {
            loading.value = false
        }
    }

    function selectDay(day: string) {
        selectedDay.value = day
    }

    return {
        loading,
        error,
        data,
        events,
        dayEvents,
        filteredEvents,
        selectedDay,
        searchQuery,
        openingMs,
        restaurantNow,
        currentTimeLine,
        fetchBookings,
        selectDay,
    }
})