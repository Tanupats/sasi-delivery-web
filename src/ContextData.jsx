import { createContext, useState, useEffect } from "react";
export const AuthData = createContext();
function Context({ children }) {
    const [cart, setCart] = useState([])
    const [toTal, setTotal] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);

    const addTocart = (data) => {
        console.log(data)
        let itemCart = {
            id: cart.length + 1,
            name: data.name,
            price: data.price,
            quntity: 1,
            photo: data.photo
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

    useEffect(() => {
        if (cart.length > 0) {

           
            let total = 0;
            cart.map(item => {
                total += (item?.quntity * item?.price);

            }) 
            setTotal(cart?.length);
            setSumPrice(total)
            console.log(cart)

        }else{
            setTotal(0);
            setSumPrice(0)
        }

    }, [cart])

    return (
        <AuthData.Provider
            value={{
                toTal,
                addTocart,
                cart,
                sumPrice,
                removeCart
            }}>
            {children}
        </AuthData.Provider>
    );


}

export default Context;