import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import NavbarMenu from "./components/Navbar";
import { socket } from "./socket";
import { useEffect,useContext } from "react";
import Swal from "sweetalert2";
import { AuthData } from "./ContextData.jsx";

function App() {
  const audio = new Audio("alert.wav");
  const { setOrderState } = useContext(AuthData);
  function playNotificationSound() {
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.log("Browser blocked audio:", err);
    });
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("new_order", (order) => {
      //console.log("มีออเดอร์ใหม่", order);
      playNotificationSound();

      Swal.fire({
        icon: "info",
        title: "🔔 มีออเดอร์ใหม่!",
        text: order.message,
        confirmButtonColor: "#3085d6",
        timerProgressBar: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setOrderState((prev) => prev + 1);
        }
      });
    });
    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <>
      <NavbarMenu />
    </>
  );
}

export default App;
