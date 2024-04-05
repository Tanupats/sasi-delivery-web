import { createContext, useState, useEffect } from "react";
export const AuthData = createContext();
import axios from "axios";
import { nanoid } from 'nanoid'
function Context({ children }) {
    const [cart, setCart] = useState([])
    const [toTal, setTotal] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const name = localStorage.getItem("name")
    const messangerId = localStorage.getItem("messangerId")
    let Bid = "sa" + nanoid(10);

    const addTocart = (data) => {
        console.log(data)
        let itemCart = {
            id: cart.length + 1,
            name: data.name,
            price: data.price,
            quntity: 1,
            photo: data.photo,
            note: "ไม่ผักครับ"
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
    const updateNote = (id,note) => {

        let newCart = cart.map(item => {

            if(item.id===id){

                return {...item,note:note}
            }
            return item;
        });


        setCart(newCart);

    }


    const saveOrder = async () => {

        

        const body = {
            bill_ID: Bid,
            amount: sumPrice,
            ordertype: "สั่งกลับบ้าน",
            Date_times: new Date(),
            statusOrder: "รับออเดอร์แล้ว",
            customerName: name,
            queueNumber: "3",
            messengerId: messangerId
        }

        await axios.post(`${import.meta.env.VITE_API_URL}/app/saveOrder`, body)
            .then(res => {
                if (res.status === 200) {
                    alert("บันทึกคำสั่งซื้อสำเร็จ")
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
            axios.post(`${import.meta.env.VITE_API_URL}/app/saveOrderDetail`, bodyDetails)
        })
        setCart([])

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

    return (
        <AuthData.Provider
            value={{
                toTal,
                addTocart,
                cart,
                sumPrice,
                removeCart,
                saveOrder,
                updateNote
            }}>
            {children}
        </AuthData.Provider>
    );


}

export default Context;