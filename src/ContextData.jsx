import { createContext, useState, useEffect } from "react";
export const AuthData = createContext();
import axios from "axios";
import Swal from 'sweetalert2'
import { nanoid } from 'nanoid'

function Context({ children }) {
    const [cart, setCart] = useState([])
    const [toTal, setTotal] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const [name, setName] = useState("");
    const [messangerId, setMessangerId] = useState("");
    const [orderType, setOrderType] = useState("สั่งกลับบ้าน");
    const [role, setRole] = useState("");
    const [queue, setQueu] = useState([]);
    const [queueNumber, setQueueNumber] = useState(0);
    const authCheck = sessionStorage.getItem("auth");
    const [auth, setAuth] = useState(authCheck || 'not_authenticated');
    const [staffName, setStaffName] = useState("");
    let Bid = "sa" + nanoid(10);

    const getQueueNumber = async () => {
        await axios.get(`${import.meta.env.VITE_API_URL}/queue/index.php`)
            .then(res => {
                setQueueNumber(res.data.queue);
            })
    }

    const addTocart = (data) => {
        let itemCart = {
            id: data.id,
            name: data.foodname,
            price: data.Price,
            quntity: 1,
            photo: data.img,
            note: ""
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
                return { ...item, quntity: qt }
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

        if (sumPrice > 0) {




            const body = {
                bill_ID: Bid,
                amount: sumPrice,
                ordertype: orderType,
                statusOrder: "รับออเดอร์แล้ว",
                customerName: name,
                queueNumber: queueNumber,
                messengerId: messangerId
            }

            fetch(`${import.meta.env.VITE_API_URL}/orderFood.php`, { method: 'POST', body: JSON.stringify(body) })
                .then(res => {
                    if (res.status === 200) {

                        Swal.fire({
                            title: 'สั่งอาหารสำเร็จ',
                            text: 'คำสั่งซื้อของคุณส่งไปยังร้านค้าแล้ว',
                            icon: 'success',
                            confirmButtonText: 'ยืนยัน'
                        })
                    }
                })

            cart.map(({ name, price, quntity, note }) => {
                let bodyDetails = {
                    bill_ID: Bid,
                    foodname: name,
                    price: price,
                    quantity: quntity,
                    note: note
                }
                fetch(`${import.meta.env.VITE_API_URL}/record_sale.php`, { method: 'POST', body: JSON.stringify(bodyDetails) })
            })
            setCart([])
            setName("")
            getQueueNumber()
        } else {
            Swal.fire({
                title: 'ไม่มีรายการอาหาร',
                text: 'กรุณาเลือกรายการอาหาร',
                icon: 'error',
                confirmButtonText: 'ยืนยัน'
            })
        }
    }


    const getQueu = async () => {
        await axios.get(`${import.meta.env.VITE_API_URL}/getQueue.php`)
            .then(res => {
                if (res.status === 200) {
                    setQueu(res.data[0].count_order)
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
                total += (item?.quntity * item?.price);

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
        setStaffName(sessionStorage.getItem('name'));
        setAuth(authCheck);
        setMessangerId(sessionStorage.getItem("messangerId"));
        setRole(sessionStorage.getItem("role"));
        getQueu() // for delivert queue 
        getQueueNumber()// for bill q1 q2 q3 
    }, [])

    // useEffect(() => {

    //     const interval = setInterval(() => {
    //         getQueu();
    //     }, 5000); // ดึงข้อมูลจาก API ทุกๆ 5 วินาที

    //     return () => clearInterval(interval);
    // }, [])

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
                updatePrice,
                updateQuantity,
                setMenuPichet,
                setMenuNormal,
                updateFoodName,
                role,
                queueNumber,
                getQueueNumber,
                auth, setAuth,
                staffName,
                setStaffName
            }}>
            {children}
        </AuthData.Provider>
    </>
    );


}

export default Context;