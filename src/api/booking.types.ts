export interface Restaurant {
    id: number
    timezone: string
    restaurant_name: string
    opening_time: string
    closing_time: string
}

export interface Order {
    id: string
    status: 'New' | 'Bill' | 'Closed' | 'Banquet'
    start_time: string
    end_time: string
}

export interface Reservation {
    id: number
    name_for_reservation: string
    num_people: number
    phone_number: string
    status:
        | 'Живая очередь'
        | 'Новая'
        | 'Заявка'
        | 'Открыт'
        | 'Закрыт'
    seating_time: string
    end_time: string
}

export interface RestaurantTable {
    id: string
    capacity: number
    number: string
    zone: string

    orders: Order[]
    reservations: Reservation[]
}

export interface BookingResponse {
    available_days: string[]
    current_day: string

    restaurant: Restaurant

    tables: RestaurantTable[]
}