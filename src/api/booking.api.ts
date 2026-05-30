import { apiClient } from './client'
import type { BookingResponse } from './booking.types'

export const bookingApi = {
    async getBookings(): Promise<BookingResponse> {
        const response = await apiClient.get<BookingResponse>('/api/booking')
        return response.data
    },
}