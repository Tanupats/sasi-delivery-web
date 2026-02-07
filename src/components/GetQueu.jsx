import  {useContext } from 'react';

import { AuthData } from "../ContextData";
import { Card } from 'react-bootstrap';
const GetQueue = () => {
   
    const {queue} = useContext(AuthData)
  
    return (
        <>
            <Card>
                <Card.Body>

                    <Card.Title as="h5" className='text-center'>  คิวทั้งหมด {queue} </Card.Title>
                </Card.Body>


            </Card>

        </>
    )
}

export default GetQueue;