import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>(
    (localStorage.getItem('theme') as Theme) || 'light'
)

export function useTheme() {
    const applyTheme = (value: Theme) => {
        document.documentElement.classList.toggle(
            'dark',
            value === 'dark'
        )
    }

    watch(
        theme,
        (value) => {
            localStorage.setItem('theme', value)
            applyTheme(value)
        },
        { immediate: true }
    )

    const toggleTheme = () => {
        theme.value =
            theme.value === 'light'
                ? 'dark'
                : 'light'
    }

    return {
        theme,
        toggleTheme
    }
}