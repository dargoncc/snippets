import { onMounted, reactive, ref } from 'vue'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  key?: string
}

interface FetchSelectProps {
  apiFun: () => Promise<any[]>
}

export function useFetchSelect(props: FetchSelectProps) {
  const { apiFun } = props
  const options = ref<SelectOption[]>([])
  const loading = ref(false)

  // 调用接口请求数据
  const loadData = () => {
    loading.value = true;
    options.value = []
    return apiFun().then(
      (data) => {
        loading.value = false
        options.value = data
        return data
      },
      (err) => {
        // 未知错误
        loading.value = false
        options.value = [
          {
            value: '-1',
            label: err.message,
            disabled: true,
          },
        ]
        return Promise.reject(err)
      }
    )
  }

  onMounted(() => {
    loadData()
  })

  return reactive({
    options,
    loading
  })
}
