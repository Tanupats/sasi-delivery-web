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
        {data?.map((item,index) => {

            return (<React.Fragment key={index}> <p> {item.quantity}   {item.price} {item.foodname}   </p> </React.Fragment>)
        })}
    </>)
}

export default Detail;