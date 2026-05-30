import dayjs from 'dayjs'

export type TimelineConfig = {
    openingTime: string // ISO string или "2025-04-04T11:00:00"
    slotWidth: number
    minutesPerSlot: number
}

export type TimelineEvent = {
    start: string | number | Date
    end: string | number | Date
}

export type EventStyle = {
    left: string
    width: string
}

export function getEventStyle(
    event: TimelineEvent,
    config: TimelineConfig
): EventStyle {
    const start = dayjs(event.start)
    const end = dayjs(event.end)
    const base = dayjs(config.openingTime)

    const startMin = start.diff(base, 'minute')
    const duration = end.diff(start, 'minute')

    return {
        left: `${(startMin / config.minutesPerSlot) * config.slotWidth}px`,
        width: `${(duration / config.minutesPerSlot) * config.slotWidth}px`
    }
}

// ─── Новый вертикальный стиль (для нового макета) ─────────────────────────

export type VerticalTimelineConfig = {
    openingMs: number   // timestamp начала рабочего дня
    slotHeight: number  // px на 1 слот
    minutesPerSlot: number
}

export type VerticalEventStyle = {
    top: string
    height: string
}

export function getEventVerticalStyle(
    event: { start: number; end: number },
    config: VerticalTimelineConfig
): VerticalEventStyle {
    const startMin = (event.start - config.openingMs) / 60_000
    const durationMin = (event.end - event.start) / 60_000

    const top    = (startMin / config.minutesPerSlot) * config.slotHeight
    const height = Math.max((durationMin / config.minutesPerSlot) * config.slotHeight, 20)

    return {
        top:    `${top}px`,
        height: `${height}px`
    }
}