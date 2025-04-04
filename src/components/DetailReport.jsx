import React, { useEffect, useState } from "react";
import { httpGet } from "../http";
const Detail = (props) => {
    const { id } = props;
    const [data, setData] = useState([])

    const getData = async () => {
        await httpGet(`/billsdetails/${id}`)
            .then(res => {
                setData(res.data)
            })
    }

    useEffect(() => {
        getData()
    }, [])

    return (<>
        {data?.map((item, index) => {
            return (<React.Fragment key={index}>
                <p>
                    {item.foodname}   {item.price} จำนวน {item.quantity}
                </p> </React.Fragment>)
        })}
    </>)
}

export default Detail;