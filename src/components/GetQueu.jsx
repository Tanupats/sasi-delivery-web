import React, { useState, useEffect,useContext } from 'react';
import { AuthData } from "../ContextData";
import { Card } from 'react-bootstrap';
const GetQueu = () => {
   
    const {queue} = useContext(AuthData)
    useEffect(() => {
     

    }, [])
    return (
        <>
            <Card>
                <Card.Body>

                    <Card.Title as="h5" className='text-center'>  จำนวนคิวทั้งหมดตอนนี้ {queue} คิว</Card.Title>
                </Card.Body>


            </Card>

        </>
    )
}

export default GetQueu;