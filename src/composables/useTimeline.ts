import { computed } from 'vue'
import { useReservationsStore } from '@/stores/reservations'

export function useTimeline() {
    const store = useReservationsStore()

    const minutesPerSlot = 15
    const slotHeight     = 40            // px на 1 слот (15 мин)

    const slots = computed<string[]>(() => {
        const openTime  = store.data?.restaurant?.opening_time  ?? '11:00'
        const closeTime = store.data?.restaurant?.closing_time  ?? '23:40'


        const result: string[] = []

        const [oh = 0, om = 0] = openTime.split(':').map(Number)
        const [ch = 0, cm = 0] = closeTime.split(':').map(Number)


        let h = oh
        let m = Math.floor(om / minutesPerSlot) * minutesPerSlot

        while (h < ch || (h === ch && m <= cm)) {
            result.push(
                `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            )

            m += minutesPerSlot

            if (m >= 60) {
                m = 0
                h++
            }
        }

        return result
    })

    return { slots, slotHeight, minutesPerSlot }
}