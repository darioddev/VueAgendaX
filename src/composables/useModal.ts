import { ref, type Ref } from 'vue'

interface useModalProps {
  showModal: Ref<boolean>
  toggleModalState: () => void
}

const useModal = (): useModalProps => {
  const showModal = ref<boolean>(false)

  const toggleModalState = (): void => {
    showModal.value = !showModal.value
  }

  return {
    showModal,
    toggleModalState
  }
}

export default useModal
