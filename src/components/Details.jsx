import { useState, useEffect } from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import { httpGet } from "../http";
const Details = (props) => {
    let { bill_ID } = props;
    const [detail, setDetail] = useState([]);

    useEffect(() => {

        const getDetail = async () => {
            await httpGet(`/billsdetails/${bill_ID}`)
                .then(res => {
                    setDetail(res.data);
                })
        }
        getDetail();
    }, [])

    return (<>
        <ListGroup className="mt-2">
            {
                detail.map(item => {
                    return (<div key={item.id}>
                        <Row>
                            <Col md={8}>
                                <ListGroup.Item style={{ border: 'none', margin: '0px', padding: '0px', fontSize: '18px' }}> X   {item.quantity}  {item.foodname}  {item.note}  {item.price}</ListGroup.Item>
                            </Col>
                        </Row>
                    </div>)
                })
            }
        </ListGroup>
    </>
    )
}

export default Details;


