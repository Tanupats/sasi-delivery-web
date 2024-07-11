import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
const Detail = (props) => {
    const { id } = props;
    const [data, setData] = useState([])

    const {onDelete} = props;
    const getData = async () => {
        axios.get('https://api.sasirestuarant.com/record_sale.php?billId=' + id)
            .then(res => {
                setData(res.data)
            })
    }

    useEffect(() => {
        getData()
    }, [])
    return (<>
        {data?.map(item => {
            return (<> <p> {item.foodname} X {item.quantity} </p> </>)
        })}
    </>)
}

export default Detail;