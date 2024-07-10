import { toast as reactToast } from 'react-toastify'

export const toast = {
  success: (message: string): void => {
    reactToast.success(message, { className: 'Toastify__toast' })
  },
  error: (message: string): void => {
    reactToast.error(message, { className: 'Toastify__toast' })
  }
}