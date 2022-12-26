import {onMounted, Ref, ref, watch} from 'vue'
import { PageInfo, MessageType } from './types'

/**
 * @description:
 * @param {*} listRequestFn 分页请求fn
 * @param {*} filterOption 分页请求option 分页请使用 ref
 * @param {*} messageOption 分页请求option 分页请使用 ref
 * @return {*}
 */
export default function usePageList
(
  listRequestFn: Function,
  filterOption: Ref<Object>,
  messageOption: MessageType
) {
   // 加载状态
   const loading = ref<Boolean>(false)
   // 分页数据
   const  pageInfo = ref<PageInfo>({
     num: 1,
     size: 10,
     total: 0
   })
   // 网络请求回来的分页数据
  const list = ref([])
  // 获取列表数据
  const loadData = async () => {
    loading.value = true
    try {
      const { data, total } = await listRequestFn(pageInfo.value.num, pageInfo.value.size, filterOption.value)
      list.value = data
      pageInfo.value.total = total
      // todo 成功的提示
    } catch (error) {
      // todo 失败的提示
      console.log('请求出错了')
    } finally {
      // 关闭loading
      loading.value = false
    }
  }

  // 清空筛选字段
  const reset = (params: Object) : void => {
    if (!filterOption.value) return
    // 清空已输入内容
    const keys = Reflect.ownKeys(filterOption.value)
    filterOption.value = {}
    keys.forEach((key) => {
      if (params.hasOwnProperty(key)) {
        Reflect.set(filterOption.value, key, params[key])
      } else  Reflect.set(filterOption.value, key, undefined)
    })
    loadData()
  }


  watch(() => [pageInfo.value.num, pageInfo.value.size], () => {
    loadData()
  })

  onMounted(() => {
    loadData()
  })

  return {
    loading,
    pageInfo,
    list,
    loadData,
    reset
  } as const
}
