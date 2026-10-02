import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { httpGet } from "../http";
const Details = ({ bill_ID }) => {
    const [detail, setDetail] = useState([]);

    useEffect(() => {
        const getDetail = async () => {
            await httpGet(`/billsdetails/${bill_ID}`).then((res) => {
                setDetail(res.data);
            });
        };
        getDetail();
    }, []);

    return (
        <details className="orders-items-disclosure">
            <summary>
                <span className="orders-items-summary">
                    <strong>รายการอาหาร</strong>
                    <small>{detail.length} รายการ</small>
                </span>
                <ChevronDown className="orders-items-chevron" size={18} />
            </summary>
            <div className="orders-items-list">
                {detail.map((item) => (
                    <div className="orders-item-row" key={item.id}>
                        <span className="orders-item-quantity">{item.quantity}x</span>
                        <div className="orders-item-name">
                            <strong>{item.foodname}</strong>
                            {item.note && <small>{item.note}</small>}
                        </div>
                        <span className="orders-item-price">{item.price} บาท</span>
                    </div>
                ))}
            </div>
        </details>
    );
};

export default Details;


