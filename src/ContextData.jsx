import { createContext, useState, useEffect } from "react";
export const AuthData = createContext();
import axios from "axios";
import Swal from 'sweetalert2';

function Context({ children }) {
    const [cart, setCart] = useState([])
    const [toTal, setTotal] = useState(0);
    const [counterOrder, setCounterOrder] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const [name, setName] = useState("");
    const [orderType, setOrderType] = useState("สั่งกลับบ้าน");
    const [queue, setQueue] = useState(0);
    const authCheck = localStorage.getItem("auth");
    const [auth, setAuth] = useState(authCheck || 'not_authenticated');
    const [Address, setAddress] = useState("");
    const [paymentType, setPaymentType] = useState("bank_transfer");
    const shop_id = localStorage.getItem('shop_id');

    const dev = import.meta.env.VITE_BAKUP_URL;

    const getCounterOrder = async () => {
        await axios.get(`${dev}/bills/counter-myorder?messengerId=${messangerId}`)
            .then(res => {
                setCounterOrder(res.data.count);
            })
    }

    const VITE_PAGE_ACCESS_TOKEN = 'EAAkMtjSMoDoBOZCGYSt499z6jgiiAjAicsajaOWhjqIxmHsl0asrAm61k6LgD1ifGXHzbDsHrJFCZASriCSyoPDpeqFh3ZBTrWC4ymdZCZBwcioKueKj31QK6w6GFHILPiJaZA8hgNHXtW5OqkRTZBzI0VFvIOoVhGdGq28DvOHGVSNEmPMJjkAOikE1thOaF3mzDg6dnjSyZBGpIY6mMZA1rWaIx';
    const sendMessageToPage = async () => {
        await fetch(`https://api.chatfuel.com/bots/5e102b272685af000183388a/users/${messangerId}/send?chatfuel_token=qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74&chatfuel_block_name=order&message=${sumPrice}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
    }

    const sendMessageToUser = async (userid, text) => {
        axios.post(
            `https://graph.facebook.com/v18.0/me/messages?access_token=${VITE_PAGE_ACCESS_TOKEN}`,
            {
                recipient: {
                    id: userid
                },
                message: {
                    text: text
                }
            }
        ).then(response => {
            console.log('Message sent:', response.data);
        }).catch(error => {
            console.error('Error sending message:', error.response?.data || error.message);
        });
    }


    const addToCart = (data) => {
        Swal.fire({
            title: 'เพิ่มรายการสำเร็จ',
            text: 'เพิ่มรายการลงตะกร้า',
            icon: 'success',
            timer: 1300
        })
        let itemCart = {
            id: data.id,
            name: data.foodname,
            price: data.Price,
            quantity: data.quantity,
            photo: data.img,
            note: data.note
        }
        if (cart.length === 0) {
            setCart([itemCart]);
        } else {
            setCart([...cart, itemCart]);
        }
    }

    const removeCart = (id) => {
        let newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
    }

    const updateNote = (id, note) => {
        let newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, note: note }
            }
            return item;
        });
        setCart(newCart);
    }

    const updatePrice = (id, price) => {
        let newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, price: price }
            }
            return item;
        });
        setCart(newCart);
    }

    const updateQuantity = (id, qt) => {
        let newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, quantity: qt }
            }
            return item;
        });
        setCart(newCart);
        sumAmount();
    }

    const updateFoodName = (id, newname) => {
        let newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, name: newname }
            }
            return item;
        });
        setCart(newCart);
    }

    const trySendMessage = async (messengerId, username, sumPrice) => {
        resetCart();
        try {
            // พยายามส่ง message แบบแรกก่อน
            await sendMessageToPage(messengerId);
            console.log("ส่งข้อความแบบ Page สำเร็จ");
        } catch (error) {
            console.warn("ส่งข้อความแบบ Page ไม่สำเร็จ:", error.response?.data || error.message);
            // ถ้าไม่สำเร็จ ให้ส่งข้อความแบบผู้ใช้แทน
            const text = `รับออเดอร์ของคุณ ${username} แล้วนะครับ  ยอดรวม ${sumPrice} บาท`;
            await sendMessageToUser(messengerId, text);
        }
    };

    const resetCart = () => setCart([]);
    const messangerId = localStorage.getItem('messangerId');
    const username = localStorage.getItem('name');

    const saveOrder = async () => {
        if (username !== null && messangerId !== null) {
            const body = {
                amount: sumPrice,
                ordertype: orderType,
                payment_type: paymentType,
                statusOrder: "รับออเดอร์แล้ว",
                customerName: username,
                shop_id: shop_id,
                messengerId: messangerId,
                address: Address,
                step: 1
            }
            try {
                const res = await axios.post(`${dev}/bills/order`, body);

                if (res.status === 200) {
                    const id = res.data.bill_ID;
                    Swal.fire({
                        title: 'สั่งออเดอร์สำเร็จ',
                        text: 'คำสั่งซื้อของคุณส่งไปยังร้านค้าแล้ว',
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน',
                        timer: 1200
                    });

                    await Promise.all(cart.map(({ name, price, quantity, note }) => {
                        const bodyDetails = {
                            bills_id: id,
                            foodname: name,
                            price: parseFloat(price),
                            quantity: quantity,
                            note: note
                        };

                        return axios.post(`${dev}/billsdetails`, bodyDetails);
                    }));
                }
                trySendMessage(messangerId, username, sumPrice);
                
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการสั่งอาหาร: ", error);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถสั่งอาหารได้ กรุณาลองใหม่',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                });
            }

        } else {
            Swal.fire({
                title: 'ไม่สามารถสั่งอาหารได้',
                text: 'กรุณาใช้งานแอพที่กล่องข้อความเพจเพื่อสั่งอาหารเท่านั้น',
                icon: 'error',
                confirmButtonText: 'ยืนยัน'
            })
        }
    }


    const getQueue = async () => {
        await axios.get(`${dev}/queues?shop_id=${shop_id}`)
            .then(res => {
                if (res.status === 200) {
                    setQueue(res.data.queues)
                }
            })
    }

    const [oldData, setOldData] = useState([]);

    const setMenuPichet = (id, data) => {
        setOldData(prevData => {
            return [...prevData, data];
        });

        let newCart = cart.map(item => {

            let newPrice = parseInt(item.price) + 10;
            if (item.id === id) {
                return { ...item, price: newPrice, name: item.name + "พิเศษ" }
            }
            return item;
        });
        setCart(newCart);
    }

    const setMenuNormal = (id) => {
        let newCart = cart.map(item => {
            const oldMenu = oldData.find(menu => menu.id === id);
            if (oldMenu) {
                if (item.id === id) {
                    return { ...item, price: oldMenu.price, name: oldMenu.name };
                }
            }
            return item;
        });
        setCart(newCart);
    }


    const sumAmount = () => {
        if (cart.length > 0) {
            let totalMenu = 0;
            let total = 0;
            cart.map(item => {
                total += (item?.quantity * item?.price);
                totalMenu += item?.quantity;
            })
            setTotal(totalMenu);
            setSumPrice(total)
        } else {
            setTotal(0);
            setSumPrice(0)
        }
    }

    useEffect(() => {
        sumAmount();
    }, [cart])


    useEffect(() => {
        getQueue();
        getCounterOrder();
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getQueue();
            getCounterOrder();
        }, 7000);

        return () => clearInterval(interval);
    }, [])


    return (<>

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
                messangerId,
                queue,
                resetCart,
                setOrderType,
                orderType,
                setName,
                name,
                updatePrice,
                updateQuantity,
                setMenuPichet,
                setMenuNormal,
                updateFoodName,
                auth,
                setAuth,
                Address,
                setAddress,
                counterOrder,
                paymentType,
                setPaymentType,
            }}>
            {children}
        </AuthData.Provider>
    </>
    );


}

export default Context;