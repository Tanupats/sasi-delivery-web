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
    const [role, setRole] = useState("");
    const [queue, setQueue] = useState(0);
    const [queueNumber, setQueueNumber] = useState(0);
    const [staffName, setStaffName] = useState("");
    const [user, setUser] = useState({ name: '' })


    const getUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            await axios.get(import.meta.env.VITE_BAKUP_URL + '/user/me', { headers: { 'apikey': token } })
                .then(res => {
                    if (res) {
                        if (res.status === 200) {
                            setUser(res.data)
                        }
                    }
                })
        }
    }



    const getQueueNumber = async () => {
        await axios.get(`${import.meta.env.VITE_BAKUP_URL}/queueNumber`)
            .then(res => {
                setQueueNumber(res.data.queueNumber);
            })
    }

    const addTocart = (data) => {
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

    const saveOrder = async () => {
        const { shop_id } = user?.shop;
        let id = '';
        if (sumPrice > 0) {
            const body = {
                amount: sumPrice,
                ordertype: orderType,
                statusOrder: "รับออเดอร์แล้ว",
                customerName: name,
                queueNumber: String(queueNumber),
                messengerId: 'pos1234',
                shop_id: shop_id
            }
            await axios.post(`${import.meta.env.VITE_BAKUP_URL}/bills`, body)
                .then(res => {
                    if (res.status === 200) {

                        id = res.data.bill_ID
                        Swal.fire({
                            title: 'ทำรายการสำเร็จ',
                            text: 'บันทึกข้อมูลสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ยืนยัน',
                            timer: 1300
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
            setCart([]);
            setName("");
            getQueueNumber();
        } else {
            Swal.fire({
                title: 'ไม่มีรายการอาหาร',
                text: 'กรุณาเลือกรายการอาหาร',
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

    const setMenuPichet = (id) => {
        let newCart = cart.map(item => {
            console.log(typeof (item.price))
            let newPrice = parseInt(item.price) + 10;
            if (item.id === id) {
                return { ...item, price: newPrice, name: item.name + "พิเศษ" }
            }
            return item;
        });
        setCart(newCart);
    }

    const setMenuNormal = (id, defaultData) => {
        let newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, price: defaultData.Price, name: defaultData.foodname }
            }
            return item;
        });
        setCart(newCart);
    }


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
        setStaffName(localStorage.getItem('name'));
        setRole(localStorage.getItem("role"));
    }, [])

    useEffect(()=>{
        getQueue();
    },[])

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
                queue,
                resetCart,
                setOrderType,
                orderType,
                setName,
                updatePrice,
                updateQuantity,
                setMenuPichet,
                setMenuNormal,
                updateFoodName,
                role,
                queueNumber,
                getQueueNumber,
               
                staffName,
                setStaffName,
                user,
                setUser
            }}>
            {children}
        </AuthData.Provider>
    </>
    );


}

export default Context;