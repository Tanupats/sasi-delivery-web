import React, { useEffect, useState } from "react";
import axios from "axios";
const Detail = (props) => {
    const { id } = props;
    const [data, setData] = useState([])
   
    const getData = async () => {
        axios.get(`${import.meta.env.VITE_BAKUP_URL}/billsdetails/${id}`)
            .then(res => {
                setData(res.data)     
            })
    }

    useEffect(() => {
        getData()
    }, [])

    return (<>
        {data?.map(item => {

            return (<> <p> {item.quantity}   {item.price} {item.foodname}   </p> </>)
        })}
    </>)
}

export default Detail;