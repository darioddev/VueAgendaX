import type { TaskModelProps } from '@/interfaces/taskModelProps'

import { ref } from 'vue'

const useTask = () => {
  const task = ref<TaskModelProps>()

  const setTask = (newTask: TaskModelProps) => {
    task.value = newTask
  }
  return {
    task,
    setTask
  }
}

export default useTask