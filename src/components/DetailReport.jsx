import React, { useEffect, useState } from "react";
import axios from "axios";
const Detail = (props) => {
    const { id } = props;
    const [data, setData] = useState([])

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
            return (<> <p> {item.foodname} </p> </>)
        })}
    </>)
}

export default Detail;