import { createContext, useState, useEffect } from "react";
export const AuthData = createContext();
import axios from "axios";
import Swal from 'sweetalert2'
import { nanoid } from 'nanoid'

function Context({ children }) {
    const [cart, setCart] = useState([])
    const [toTal, setTotal] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);

    const [name, setName] = useState("")
    const [messangerId, setMessangerId] = useState("")

    
    let Bid = "sa" + nanoid(10);

    const addTocart = (data) => {
        console.log(data)
        let itemCart = {
            id: cart.length + 1,
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
        console.log(id)
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

    const resetCart = () => setCart([]);

    const saveOrder = async () => {
        const body = {
            bill_ID: Bid,
            amount: sumPrice,
            ordertype: "สั่งกลับบ้าน",
            statusOrder: "รับออเดอร์แล้ว",
            customerName: name,
            queueNumber: "5",
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

    }
    const [queue, setQueu] = useState([]);

    const getQueu = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/getQueue.php`)
            .then(res => {
                if (res.status === 200) {
                    setQueu(res.data[0].count_order)
                }
            })
    }

    useEffect(() => {
        if (cart.length > 0) {
            let total = 0;
            cart.map(item => {
                total += (item?.quntity * item?.price);

            })
            setTotal(cart?.length);
            setSumPrice(total)
            console.log(cart)

        } else {
            setTotal(0);
            setSumPrice(0)
        }
        console.log(Bid)
    }, [cart])

    useEffect(() => {

        setName(sessionStorage.getItem("name"))
        setMessangerId(sessionStorage.getItem("messangerId"))
        getQueu()
    }, [])

    return (<>

        <AuthData.Provider
            value={{
                toTal,
                addTocart,
                cart,
                sumPrice,
                removeCart,
                saveOrder,
                updateNote,
                name,
                messangerId,
                queue,
                resetCart

            }}>
            {children}
        </AuthData.Provider>
    </>
    );


}

export default Context;