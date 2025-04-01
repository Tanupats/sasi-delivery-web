import { createContext, useState, useEffect } from "react";
export const AuthData = createContext();
import axios from "axios";
import Swal from 'sweetalert2'
import { httpGet } from "./http";

function Context({ children }) {
    const [cart, setCart] = useState([])
    const [toTal, setTotal] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const [name, setName] = useState("");
    const [orderType, setOrderType] = useState("สั่งกลับบ้าน");
    const [role, setRole] = useState("");
    const [queue, setQueu] = useState(0);
    const [queueNumber, setQueueNumber] = useState(0);
    const [staffName, setStaffName] = useState("");
    const [user, setUser] = useState({ name: '' })
    const [shop, setShop] = useState({})
    const [statusPrint, setStatusPrint] = useState("");
    const token = localStorage.getItem("token");
    const getUser = async () => {

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
            note: data.note,
            stockId: data.stockId
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
        await getQueueNumber();
        const { shop_id } = shop;
        let id = '';
        if (sumPrice > 0) {
            const body = {
                amount: parseInt(sumPrice),
                ordertype: orderType,
                statusOrder: "รับออเดอร์แล้ว",
                customerName: name,
                queueNumber: String(queueNumber),
                messengerId: 'pos',
                shop_id: shop_id,
                printStatus: statusPrint
            }
            await axios.post(`${import.meta.env.VITE_BAKUP_URL}/bills`, body, { headers: { 'apikey': token } })
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
                    price: parseInt(price),
                    quantity: quantity,
                    note: note,
                }
                axios.post(`${import.meta.env.VITE_BAKUP_URL}/billsdetails`, bodyDetails, { headers: { 'apikey': token } })


            })
            setCart([]);
            setName("");

        } else {
            Swal.fire({
                title: 'ไม่มีรายการอาหาร',
                text: 'กรุณาเลือกรายการอาหาร',
                icon: 'error',
                confirmButtonText: 'ยืนยัน'
            })
        }
    }

    // const updateStockId = (id, numberStock) => {

    //     httpGet(`/stock/${id}`).then((res) => {
    //         console.log(res.data)
    //     }

    //     )

    //     const body = {
    //         stock_quantity: numberStock
    //     }
    //     //httpPut(`/stock/${id}`, body)
    // }

    // const getQueu = async () => {
    //     await axios.get(`${import.meta.env.VITE_BAKUP_URL}/queues`)
    //         .then(res => {
    //             if (res.status === 200) {
    //                 setQueu(res.data.queues)
    //             }
    //         })
    // }

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

    const getShop = (id) => {
        httpGet('/shop/shop-user/' + id).then((res) => {
            setShop({ ...res.data[0] })
        })
    }


    const sumAmount = () => {
        if (cart.length > 0) {
            let total = 0;
            cart.map(item => {
                total += (item?.quantity * item?.price);
            })

            let totalQuantity = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);

            setTotal(totalQuantity);
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

    useEffect(() => {
        getUser();
        const userid = localStorage.getItem("userId");
        getShop(userid);
    }, [])

    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         try {
    //             const response = await httpGet(`/bills?status=รับออเดอร์แล้ว`, { headers: { 'apikey': token } }).then((res) => res.data); // เปลี่ยนเป็น API ของคุณ
    //             response
    //             const newOrderCount = response.length;

    //             if (newOrderCount > orderCount) {

    //                 Swal.fire({
    //                     title: 'มีออเดอร์สั่งซื้อใหม่!',
    //                     text: 'คำสั่งซื้อใหม่จากลูกค้า',
    //                     icon: 'success',
    //                     confirmButtonText: 'ยืนยัน',

    //                 })

    //                 setOrderCount(newOrderCount);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching orders:", error);
    //         }

    //     };

    //     const interval = setInterval(fetchOrders, 5000);
    //     return () => clearInterval(interval); // ล้าง interval เมื่อ component unmount
    // }, [orderCount]);



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
                setUser,
                shop,
                getShop,
                setShop
                , setStatusPrint,
                statusPrint
            }}>
            {children}
        </AuthData.Provider>
    </>
    );


}

export default Context;