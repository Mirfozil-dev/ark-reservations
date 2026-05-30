import dayjs from 'dayjs'
import type { BookingResponse, RestaurantTable } from './booking.types'

export interface CalendarEvent {
    id:          string | number
    tableId:     string
    tableNumber: string
    zone:        string
    type:   'order' | 'reservation' | 'banquet'
    status: string
    start: number
    end:   number
    name?:   string
    people?: number
    phone?:  string
}

export function mapBookingEvents(data: BookingResponse): CalendarEvent[] {
    const events: CalendarEvent[] = []

    data.tables.forEach((table: RestaurantTable) => {

        table.orders.forEach((order) => {
            events.push({
                id:          order.id,
                tableId:     table.id,
                tableNumber: table.number,
                zone:        table.zone,
                type:        order.status === 'Banquet' ? 'banquet' : 'order',
                status:      order.status,
                start:       dayjs(order.start_time).valueOf(),
                end:         dayjs(order.end_time).valueOf(),
            })
        })

        table.reservations.forEach((reservation) => {
            events.push({
                id:          reservation.id,
                tableId:     table.id,
                tableNumber: table.number,
                zone:        table.zone,
                type:        'reservation',
                status:      reservation.status,
                start:       dayjs(reservation.seating_time).valueOf(),
                end:         dayjs(reservation.end_time).valueOf(),
                name:        reservation.name_for_reservation,
                people:      reservation.num_people,
                phone:       reservation.phone_number,
            })
        })
    })

    return events
}