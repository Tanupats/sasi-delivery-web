import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showNotification = {
  success: (message, title = '') => {
    const content = title ? `${title}\n${message}` : message;
    toast.success(content, {
      position: 'top-center',
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  error: (message, title = '') => {
    const content = title ? `${title}\n${message}` : message;
    toast.error(content, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  info: (message, title = '') => {
    const content = title ? `${title}\n${message}` : message;
    toast.info(content, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  warning: (message, title = '') => {
    const content = title ? `${title}\n${message}` : message;
    toast.warning(content, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
};

export const showConfirmation = (message, onConfirm, onCancel) => {
  if (window.confirm(message)) {
    onConfirm();
  } else {
    if (onCancel) onCancel();
  }
};
