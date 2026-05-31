
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import NavbarMenu from './components/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <NavbarMenu />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
