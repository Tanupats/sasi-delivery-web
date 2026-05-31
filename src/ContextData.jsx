import { createContext, useState, useEffect } from "react";
export const AuthData = createContext();
import axios from "axios";
import { showNotification } from "./utils/notification";

function Context({ children }) {
  const messengerId = localStorage.getItem("messangerId");
  const username = localStorage.getItem("name");

  const [cart, setCart] = useState([]);
  const [toTal, setTotal] = useState(0);
  const [counterOrder, setCounterOrder] = useState(0);
  const [sumPrice, setSumPrice] = useState(0);
  const [name, setName] = useState("");
  const [orderType, setOrderType] = useState("สั่งกลับบ้าน");
  const [queue, setQueue] = useState(0);
  const [Address, setAddress] = useState("");
  const [paymentType, setPaymentType] = useState("bank_transfer");
  const [shopId, setShopId] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0 || localStorage.getItem("delivery_fee"));
  const [account_payment, setAccount_payment] = useState(0);
  const [promptPay, setPromptPay] = useState("");
  const [oldData, setOldData] = useState([]);
  const api_url = import.meta.env.VITE_API_URL;

  const getCounterOrder = async () => {
    await axios
      .get(`${api_url}/bills/counter-myorder?messengerId=${messengerId}`)
      .then((res) => {
        setCounterOrder(res.data.count);
      });
  };

  const PageAccessToken = localStorage.getItem("shop_token");
  const sendMessageToPage = async () => {
    const reportMenu = cart
      .map(
        (item) =>
          `${item.name}    ${item.note !== null ? item.note : " "} X ${item.quantity} ราคา ${item.price * item.quantity} บาท`,
      )
      .join("\n");

    const message =
      paymentType === "cash"
        ? `${reportMenu}
${orderType === "สั่งกลับบ้าน" ? `ค่าจัดส่ง : ${deliveryFee} บาท\n` : ""}รวมทั้งหมด ${sumPrice + deliveryFee} บาท`
        : `${reportMenu}
${orderType === "สั่งกลับบ้าน" ? `ค่าจัดส่ง : ${deliveryFee} บาท\n` : ""}รวมทั้งหมด ${sumPrice + deliveryFee} บาท

${account_payment}`;
    await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${PageAccessToken}
`,
      {
        method: "POST",
        body: JSON.stringify({
          recipient: { id: messengerId },
          message: { text: message },
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
  };

  const addToCart = (data) => {
    const itemCart = {
      id: data.id,
      name: data.foodname,
      price: data.Price,
      quantity: data.quantity,
      photo: data.img,
      note: data.note,
      shop_id: data.shop_id,
    };
    setCart((prevCart) => [...prevCart, itemCart]);
    showNotification.success("เพิ่มรายการลงตะกร้าแล้ว", "เพิ่มรายการสำเร็จ");
  };

  const removeCart = (id) => {
    let newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
  };

  const updateNote = (id, note) => {
    let newCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, note: note };
      }
      return item;
    });
    setCart(newCart);
  };

  const updatePrice = (id, price) => {
    let newCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, price: price };
      }
      return item;
    });
    setCart(newCart);
  };

  const updateQuantity = (id, qt) => {
    let newCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: qt };
      }
      return item;
    });
    setCart(newCart);
    sumAmount();
  };

  const updateFoodName = (id, newname) => {
    let newCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, name: newname };
      }
      return item;
    });
    setCart(newCart);
  };

  const resetCart = () => setCart([]);

  const saveOrder = async () => {
    if (username !== null && messengerId !== null) {
      const body = {
        amount: sumPrice + deliveryFee,
        ordertype: orderType,
        payment_type: paymentType,
        statusOrder: "รับออเดอร์แล้ว",
        customerName: username,
        shop_id: shopId,
        messengerId: messengerId,
        address: Address,
        step: 1,
        delivery_fee: deliveryFee,
      };
      sendMessageToPage(messengerId);
      const res = await axios.post(`${api_url}/bills/order`, body);
      if (res.status === 200) {
        const id = res.data.bill_ID;
        const bodyDetails = cart.map(({ name, price, quantity, note }) => {
          return {
            bills_id: id,
            foodname: name,
            price: parseFloat(price),
            quantity: quantity,
            note: note,
            shop_id: shopId,
          };
        });

        await axios.post(`${api_url}/billsdetails`, bodyDetails);

        showNotification.success(
          "คำสั่งซื้อของคุณส่งไปยังร้านค้าแล้ว แจ้งชำระเงินและรอรับอาหารได้เลย",
          "สั่งออเดอร์สำเร็จ"
        );
      } else {
        showNotification.error(
          "ไม่สามารถสั่งอาหารได้ กรุณาลองใหม่ หรือสอบถามร้านค้า",
          "เกิดข้อผิดพลาด"
        );
      }
    } else {
      showNotification.error(
        "กรุณาใช้งานแอพที่กล่องข้อความเพจเพื่อสั่งอาหารเท่านั้น",
        "ไม่สามารถสั่งอาหารได้"
      );
    }
  };

  const getQueue = async () => {
    if (shopId) {
      await axios.get(`${api_url}/queues?shop_id=${shopId}`).then((res) => {
        if (res.status === 200) {
          setQueue(res.data.queues);
        }
      });
    }
  };

  const setMenuPichet = (id, data) => {
    setOldData((prevData) => [...prevData, data]);

    let newCart = cart.map((item) => {
      if (item.id === id) {
        let newPrice = parseInt(item.price) + 10;

        return {
          ...item,
          price: newPrice,
          name: item.name.includes("พิเศษ") ? item.name : item.name + "พิเศษ",
        };
      }
      return item;
    });

    setCart(newCart);
  };

  const setMenuNormal = (id) => {
    let newCart = cart.map((item) => {
      const oldMenu = oldData.find((menu) => menu.id === id);
      if (oldMenu) {
        if (item.id === id) {
          return { ...item, price: oldMenu.price, name: oldMenu.name };
        }
      }
      return item;
    });
    setCart(newCart);
  };

  const sumAmount = () => {
    if (cart.length > 0) {
      let totalMenu = 0;
      let total = 0;
      cart.map((item) => {
        total += item?.quantity * item?.price;
        totalMenu += item?.quantity;
      });
      setTotal(totalMenu);
      setSumPrice(total);
    } else {
      setTotal(0);
      setSumPrice(0);
    }
  };

  useEffect(() => {
    sumAmount();
  }, [cart]);

  useEffect(() => {
    getCounterOrder();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getCounterOrder();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCart([]);
  }, [shopId]);

  return (
    <>
      <AuthData.Provider
        value={{
          toTal,
          addToCart,
          cart,
          sumPrice,
          removeCart,
          sumAmount,
          saveOrder,
          updateNote,
          messengerId,
          queue,
          resetCart,
          setCart,
          setOrderType,
          orderType,
          setName,
          name,
          updatePrice,
          updateQuantity,
          setMenuPichet,
          setMenuNormal,
          updateFoodName,
          Address,
          setAddress,
          counterOrder,
          paymentType,
          setPaymentType,
          getQueue,
          api_url,
          setShopId,
          PageAccessToken,
          deliveryFee,
          setDeliveryFee,
          account_payment,
          setAccount_payment,
          setPromptPay,
          promptPay,
        }}
      >
        {children}
      </AuthData.Provider>
    </>
  );
}

export default Context;
