import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
const GetQueu = () => {
    const [queue, setQueu] = useState([]);

    const getQueu = async () => {

        await axios.get(`${import.meta.env.VITE_API_URL}/app/getQueues`)
            .then(res => {

                if (res.status === 200) {
                    setQueu(res.data[0].count_order)
                }
            })
    }

    useEffect(() => {
        getQueu()

    }, [])
    return (
        <>
            <Card>
                <Card.Body>

                    <Card.Title>  จำนวนคิวทั้งหมดตอนนี้ {queue} คิว</Card.Title>
                </Card.Body>


            </Card>

        </>
    )
}

export default GetQueu;