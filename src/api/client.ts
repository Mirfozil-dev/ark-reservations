import axios from 'axios'

export const apiClient = axios.create({
    baseURL: 'https://hh.frontend.ark.software',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})