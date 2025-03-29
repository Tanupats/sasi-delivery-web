import { createContext, useState, useEffect } from "react";
export const AuthData = createContext();
import axios from "axios";
import Swal from 'sweetalert2'

function Context({ children }) {
    const [cart, setCart] = useState([])
    const [toTal, setTotal] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const [name, setName] = useState("");
    const [orderType, setOrderType] = useState("สั่งกลับบ้าน");
    const [queue, setQueue] = useState(0);
    const [queueNumber, setQueueNumber] = useState(0);
    const authCheck = localStorage.getItem("auth");
    const [auth, setAuth] = useState(authCheck || 'not_authenticated');
    const [Address, setAddress] = useState("");

    const getQueueNumber = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/queueNumber`)
            .then(res => {
                setQueueNumber(res.data.queueNumber);
            })
    }

    const checkQueueNumber = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills/queuenumber/${queueNumber}`)
            .then(res => {
                if (res.data.length > 0) {
                    setQueueNumber(queueNumber + 1);
                }
            })
    }

    const addTocart = (data) => {
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

    const resetCart = () => setCart([]);
    const messangerId = localStorage.getItem('messangerId');
    const username = localStorage.getItem('name');
    const dev = import.meta.env.VITE_BAKUP_URL;
    
    const saveOrder = async () => {
        checkQueueNumber();
        if (username !== null && messangerId !== null) {
            const body = {
                amount: sumPrice,
                ordertype: orderType,
                statusOrder: "รับออเดอร์แล้ว",
                customerName: username,
                queueNumber: String(queueNumber),
                messengerId: messangerId,
                address: Address
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
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/queues`)
            .then(res => {
                if (res.status === 200) {
                    setQueue(res.data.queues)
                }
            })
    }

    const [oldData, setOldData] = useState([]);

    const setMenuPichet = (id, data) => {
        setOldData(prevData => {
            return [...prevData, data]; // ✅ ต้อง return ค่าใหม่
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
            const oldMenu = oldData.find(menu => menu.id === id); // ค้นหาเมนูเก่าจาก oldData

            if (oldMenu) { // ถ้าพบเมนูเดิม
                if (item.id === id) {
                    return { ...item, price: oldMenu.price, name: oldMenu.name };
                }
                // อัปเดตข้อมูล
            }
            return item;
            // ถ้าไม่เจอ ให้คืนค่าเดิม
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
        if (queueNumber > 0) {
            getQueueNumber();
        }
    }, [cart])

    useEffect(() => {
        if (queueNumber > 0) {
            checkQueueNumber();
        }
    }, [queueNumber])

    useEffect(() => {
        getQueue() // for delivery queue 
        getQueueNumber()// for bill q1 q2 q3 
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getQueue();
        }, 7000);

        return () => clearInterval(interval);
    }, [])


    return (<>

        <AuthData.Provider
            value={{
                toTal,
                addTocart,
                cart,
                sumPrice,
                removeCart,
                sumAmount,
                saveOrder,
                updateNote,
                name,
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

                queueNumber,
                getQueueNumber,
                auth,
                setAuth,
                Address,
                setAddress
            }}>
            {children}
        </AuthData.Provider>
    </>
    );


}

export default Context;