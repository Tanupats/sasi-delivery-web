import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Row, Col, Card, Image } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
const ShopData = () => {
  const { userid, name } = useParams();
  const router = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const sendTestMessage = async (recipientId, token) => {
    try {
      const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${token}`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: {
            text: "สวัสดีครับ ลูกค้ากดสั่งอาหาร และแจ้งชำระเงินได้เลยครับ",
          },
        }),
        headers: { "Content-Type": "application/json" },
      });
      return res;
    } catch (err) {
      return null;
    }
  };

  const handleShopClick = async (shop) => {
    localStorage.setItem("shop_token", shop.facebook_token);
    const token = shop.facebook_token;
    setLoading(true);
    const res = await sendTestMessage(userid, token);
    if (res.status === 200) {
      setLoading(false);
      router("/foodmenu/" + shop.shop_id);
    } else {
      setLoading(false);
      Swal.fire(
        "ลิงค์หมดอายุเนื่องจากใช้งานมาแล้วครบ 24 ชม. กรุณาส่งข้อความขอลิงค์ใหม่กับทางร้านค้า",
        { showConfirmButton: false },
      );
    }
  };

  useEffect(() => {
    const getShopData = async () => {
      await axios.get(`${import.meta.env.VITE_API_URL}/shop`).then((res) => {
        setData(res.data);
      });
    };

    if (userid && name) {
      localStorage.setItem("messangerId", userid);
      localStorage.setItem("name", name);
      getShopData();
    }
  }, []);

  return (
    <>
      <Card style={{ marginBottom: "120px", border: "none" }}>
        <Card.Body style={{ padding: "0" }}>
          <Row>
            {data.map((item, index) => {
              if (item.id === 1)
                return (
                  <React.Fragment key={index}>
                    <Col md={4} xs={12} className="mt-2">
                      {loading ? (
                        <h3>กำลังโหลด....</h3>
                      ) : (
                        <>
                      <Card
  onClick={() => handleShopClick(item)}
  style={{
    cursor: item.is_open ? "pointer" : "not-allowed",
  }}
>
  <Card.Body style={{ padding: 10 }}>
    <Card.Title>{item.name}</Card.Title>

    <div style={{ position: "relative" }}>
      {/* ป้ายเปิดปิด */}
      <Badge
        bg={item.is_open ? "success" : "danger"}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 2,
          fontSize: "14px",
          padding: "8px 12px",
          borderRadius: "20px",
        }}
      >
        {item.is_open ? (
          <>
            เปิด <AccessTimeIcon style={{ fontSize: 16 }} /> {item.open_time}
          </>
        ) : (
          <>ปิด {item.open_time}</>
        )}
      </Badge>

      {/* รูป */}
      <Image
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "10px",
          cursor: item.is_open ? "pointer" : "not-allowed",
          opacity: item.is_open ? 1 : 0.5,
        }}
        src={`${import.meta.env.VITE_API_URL}/images/${item.photo}`}
      />
    </div>
  </Card.Body>
</Card>
                        </>
                      )}
                    </Col>
                  </React.Fragment>
                );
            })}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default ShopData;
