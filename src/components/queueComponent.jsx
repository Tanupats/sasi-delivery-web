import { useState, useEffect } from "react";
import axios from "axios";

const QueueComponent = ({ rider_id }) => {
  const [data, setData] = useState(null);

  useEffect(() => {

    if (!rider_id) return;
    axios
      .get(`${import.meta.env.VITE_BAKUP_URL}/user/${rider_id}`)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {

          setData(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching queue:", err);
      });
  }, [rider_id]);

  return (
    <h5>
      <h5 bg="primary">ไรเดอร์ : {data?.name}</h5>
    </h5>
  );
};

export default QueueComponent;
