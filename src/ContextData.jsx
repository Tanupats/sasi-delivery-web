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
    const [queue, setQueu] = useState(0);
    const [queueNumber, setQueueNumber] = useState(0);
    const authCheck = localStorage.getItem("auth");
    const [auth, setAuth] = useState(authCheck || 'not_authenticated');

    const getQueueNumber = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/queueNumber`)
            .then(res => {
                setQueueNumber(res.data.queueNumber);
            })
    }

    const addTocart = (data) => {
        Swal.fire({
            title: 'เพิ่มรายการสำเร็จ',
            text: 'เพิ่มรายการลงตะกร้า',
            icon: 'success',

            timer: 1300
        })
        console.log('in card', data)
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
    const saveOrder = async () => {

        let id = '';
        if (username !== null) {
            const body = {

                amount: sumPrice,
                ordertype: orderType,
                statusOrder: "รับออเดอร์แล้ว",
                customerName: username,
                queueNumber: String(queueNumber),
                messengerId: messangerId
            }

            await axios.post(`${import.meta.env.VITE_BAKUP_URL}/bills/order`, body)
                .then(res => {
                    if (res.status === 200) {
                        console.log(res)
                        id = res.data.bill_ID
                        Swal.fire({
                            title: 'สั่งอาหารสำเร็จ',
                            text: 'คำสั่งซื้อของคุณส่งไปยังร้านค้าแล้ว',
                            icon: 'success',
                            confirmButtonText: 'ยืนยัน'
                        })
                    }
                })

            cart.map(({ name, price, quantity, note }) => {
                const bodyDetails = {
                    bills_id: id,
                    foodname: name,
                    price: parseFloat(price),
                    quantity: quantity,
                    note: note
                }
                axios.post(`${import.meta.env.VITE_BAKUP_URL}/billsdetails`, bodyDetails)
            })
            setCart([])
            getQueueNumber()
        } else {
            Swal.fire({
                title: 'ยังไม่ได้เข้าสู่ระบบ',
                text: 'กรุณาเข้าสู่ระบบก่อนสั่งอาหาร',
                icon: 'error',
                confirmButtonText: 'ยืนยัน'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect ไปยังหน้า login
                    window.location.href = '/'; // ใส่ URL ของหน้าล็อกอินของคุณ
                }
            });

        }
    }


    const getQueu = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/queues`)
            .then(res => {
                if (res.status === 200) {
                    setQueu(res.data.queues)
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

    // useEffect(() => {
    //     console.log('รายการเก่า', oldData)

    // }, [oldData])

    const sumAmount = () => {
        if (cart.length > 0) {
            let total = 0;
            cart.map(item => {
                total += (item?.quantity * item?.price);
            })
            let item = cart?.length;
            setTotal(item);
            setSumPrice(total)

        } else {
            setTotal(0);
            setSumPrice(0)
        }
    }

    useEffect(() => {
        sumAmount()
    }, [cart])

    useEffect(() => {
        getQueu() // for delivert queue 
        getQueueNumber()// for bill q1 q2 q3 
        setName(localStorage.getItem('name'))
    }, [])

    useEffect(() => {

        const interval = setInterval(() => {
            getQueu();
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

            }}>
            {children}
        </AuthData.Provider>
    </>
    );


}

export default Context;