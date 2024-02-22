import { ref } from 'vue'

const useModal = () => {
  const showModal = ref<boolean>(false)

  const toggleModalState = () => {
    showModal.value = !showModal.value
  }

  return {
    showModal,
    toggleModalState
  }
}

export default useModal