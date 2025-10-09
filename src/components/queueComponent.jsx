import { useState, useEffect } from "react";
import axios from "axios";
import Badge from "react-bootstrap/Badge";

const QueueComponent = ({ shop_id }) => {
  const [queue, setQueue] = useState(null);

  useEffect(() => {
    if (!shop_id) return;
    axios
      .get(`${import.meta.env.VITE_BAKUP_URL}/queues?shop_id=${shop_id}`)
      .then((res) => {
        if (res.status === 200) {
          setQueue(res.data.queues);
        }
      })
      .catch((err) => {
        console.error("Error fetching queue:", err);
      });
  }, [shop_id]);

  if (queue === null) {
    return <Badge bg="secondary">กำลังโหลดคิว...</Badge>;
  }

  return (
    <h5>
      <h5 bg="primary">คิวทั้งหมด : {queue}</h5>
    </h5>
  );
};

export default QueueComponent;
