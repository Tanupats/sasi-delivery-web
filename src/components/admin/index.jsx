import { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Tabs,
  Tab,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import "./index.scss";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Products from "./products";
import MenuType from "./MenuType";
import User from "./user";
import MessageIcon from "@mui/icons-material/Message";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import PollIcon from "@mui/icons-material/Poll";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { http } from "../../http";
import { AuthData } from "../../ContextData";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SendIcon from "@mui/icons-material/Send";
import SalesChart from "./chart-report";
import Accounting from "./accounting";
import Stock from "./stock";
const Admin = () => {
  const [openMenu, setOpenMenu] = useState("เมนูอาหาร");
  const [inComeNow, setIncomeNow] = useState(0);
  const [outComeNow, setOutCome] = useState(0);
  const [totalOrder, setTotalOrder] = useState(85);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordReply, setKeywordReply] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "สวัสดีค่ะ ยินดีต้อนรับสู่ร้าน Sasi Delivery 😊 ต้องการสั่งอาหารหรือสอบถามเมนูไหมครับ",
      time: "09:00",
    },
    {
      sender: "user",
      text: "สวัสดี",
      time: "09:01",
    },
    {
      sender: "bot",
      text: "สวัสดีค่ะ ยินดีต้อนรับ 😊 เรามีเมนูยอดนิยมและโปรโมชั่นดี ๆ รออยู่ครับ",
      time: "09:01",
    },
  ]);

  const token = localStorage.getItem("token");
  const { shop } = useContext(AuthData);
  const defaultReplies = {
    สวัสดี: "สวัสดีค่ะ ยินดีต้อนรับสู่ร้าน Sasi Delivery 😊 วันนี้ต้องการสั่งอาหารหรือสอบถามเมนูไหมครับ",
    เมนู: "ร้านเราแนะนำเมนูยอดนิยมได้แก่ ข้าวมันไก่, ก๋วยเตี๋ยว, กะเพราไก่, ข้าวเหนียวหมู, และเครื่องดื่มร้อน/เย็นค่ะ",
    ราคา: "ราคาอาหารเริ่มต้นที่ 39 บาท และเมนูพรีเมียมเริ่มที่ 149 บาท ขึ้นอยู่กับประเภทเมนูที่เลือกค่ะ",
    โปรโมชั่น: "ตอนนี้มีโปรโมชั่นลด 10% สำหรับเมนูยอดนิยมและจัดส่งฟรีเมื่อสั่งครบ 299 บาทขึ้นไปครับ",
    ขอบคุณ: "ขอบคุณมากครับ ยินดีให้บริการเสมอ 😊",
  };

  const [botReplies, setBotReplies] = useState(defaultReplies);
  const randomKeywords = Object.keys(botReplies);
  const geIncomeNow = async () => {
    if (shop) {
      const res = await http.get(`/bills/reportByMounth/${shop?.shop_id}`, {
        headers: { apikey: token },
      });
      setIncomeNow(res.data.totalAmount);
      setTotalOrder(res.data.total_bill);
    }
  };

  const geOutComeNow = async () => {
    if (shop) {
      const res = await http.get(`/account/outcome-mounth?shop_id=${shop?.shop_id}`, {
        headers: { apikey: token },
      });
      setOutCome(res.data._sum.total);
  
    }
  };

  const getWebHook = async () => {
    const url = `${import.meta.env.VITE_API_URL}/webhook?shop=${shop?.shop_id}`;

    try {
      await navigator.clipboard.writeText(url);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "คัดลอกลิงก์แล้ว",
        text: "Webhook พร้อมนำไปใช้งาน",
        showConfirmButton: false,
        timer: 2400,
        timerProgressBar: true,
        customClass: { popup: "copy-toast" },
      });
    } catch (err) {
      console.error("Copy failed", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "คัดลอกไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: false,
        timer: 2400,
        timerProgressBar: true,
        customClass: { popup: "copy-toast" },
      });
    }
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat().format(val || 0);
  };

  const getBotReply = (message) => {
    const text = message.trim().toLowerCase();

    const matchedKeyword = Object.keys(botReplies).find((keyword) =>
      text.includes(keyword.toLowerCase())
    );

    if (matchedKeyword) {
      return botReplies[matchedKeyword];
    }

    return "ขอบคุณสำหรับข้อความค่ะ หากต้องการสอบถามเมนู/ราคา/โปรโมชั่น สามารถพิมพ์คำว่า เมนู, ราคา, โปรโมชั่น หรือ สวัสดี ได้เลยครับ";
  };

  const handleAddKeyword = () => {
    const trimmedKeyword = keywordInput.trim();
    const trimmedReply = keywordReply.trim();

    if (!trimmedKeyword || !trimmedReply) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกคีย์เวิร์ดและข้อความตอบกลับ",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setBotReplies((prev) => ({
      ...prev,
      [trimmedKeyword]: trimmedReply,
    }));

    setKeywordInput("");
    setKeywordReply("");
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    Swal.fire({
      title: `ลบคีย์เวิร์ด "${keywordToDelete}" หรือไม่?`,
      text: "การลบนี้จะเอาข้อความตอบกลับที่เกี่ยวข้องออกด้วย",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (!result.isConfirmed) return;

      setBotReplies((prev) => {
        const updated = { ...prev };
        delete updated[keywordToDelete];
        return updated;
      });

      if (keywordInput === keywordToDelete) {
        setKeywordInput("");
        setKeywordReply("");
      }

      if (chatInput === keywordToDelete) {
        setChatInput("");
      }
    });
  };

  const handleSendChat = () => {
    const message = chatInput.trim();

    if (!message) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = {
      sender: "user",
      text: message,
      time,
    };

    const botMessage = {
      sender: "bot",
      text: getBotReply(message),
      time,
    };

    setChatMessages((prev) => [...prev, userMessage, botMessage]);
    setChatInput("");
  };

  const handleKeywordClick = (keyword) => {
    setKeywordInput(keyword);
    setKeywordReply(botReplies[keyword] || "");
    setChatInput(keyword);
  };

  const handleTestInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendChat();
    }
  };

  useEffect(() => {
    if (openMenu === "สรุปยอดขาย") {
      geIncomeNow();
      geOutComeNow();
    }
  }, [openMenu]);

  return (
    <>
      <Tabs
        activeKey={openMenu}
        onSelect={(k) => setOpenMenu(k)}
        className="mb-3 mt-3 admin-tabs"
        fill
      >
        <Tab
          eventKey="เมนูอาหาร"
          title={
            <span className="tab-title">
              <MenuBookIcon /> สินค้า
            </span>
          }
        >
          <Products />
        </Tab>

        <Tab
          eventKey="ประเภทสินค้า"
          title={
            <span className="tab-title">
              <PollIcon /> ประเภทสินค้า
            </span>
          }
        >
          <MenuType />
        </Tab>

        <Tab
          eventKey="บัญชี"
          title={
            <span className="tab-title">
              <AccountCircleIcon /> พนักงาน
            </span>
          }
        >
          <User />
        </Tab>

        <Tab
          eventKey="สรุปรายการสั่งซื้อ"
          title={
            <span className="tab-title">
              <CreditCardIcon /> สต็อกสินค้า
            </span>
          }
        >
          <Stock />
        </Tab>

        <Tab
          eventKey="สรุปยอดขาย"
          title={
            <span className="tab-title">
              <DataThresholdingIcon /> รายงานยอดขาย
            </span>
          }
        >
          <Row className="mt-3">
            {" "}
            <Col md={4}>
              {" "}
              <Card className="text-center">
                {" "}
                <Card.Body>
                  {" "}
                  <Card.Title style={{ color: "green" }}>
                    {" "}
                    ยอดขายเดือนนี้ + {formatMoney(inComeNow)} บาท{" "}
                  </Card.Title>{" "}
                </Card.Body>{" "}
              </Card>{" "}
            </Col>{" "}
            <Col md={4}>
              {" "}
              <Card className="text-center">
                {" "}
                <Card.Body>
                  {" "}
                  <Card.Title style={{ color: "#ff6b6b" }}>
                    {" "}
                    ค่าใช้จ่ายเดือนนี้ - {formatMoney(outComeNow)} บาท{" "}
                  </Card.Title>{" "}
                </Card.Body>{" "}
              </Card>{" "}
            </Col>{" "}
            <Col md={4}>
              {" "}
              <Card className="text-center">
                {" "}
                <Card.Body>
                  {" "}
                  <Card.Title style={{ color: inComeNow - outComeNow >= 0 ? "#00b300" : "#ff0000" }}>
                    {" "}
                    กำไรสุทธิ = {formatMoney(inComeNow - outComeNow)} บาท{" "} 
                    {inComeNow > 0 ? `(${((inComeNow - outComeNow) / inComeNow * 100).toFixed(2)}%)` : ""}
                  </Card.Title>{" "}
                </Card.Body>{" "}
              </Card>{" "}
            </Col>{" "}
            <Col md={12} className="mt-2">
              {" "}
              <Card className="text-center">
                {" "}
                <Card.Body>
                  {" "}
                  <Card.Title style={{ color: "#007bff" }}>
                    {" "}
                    คำสั่งซื้อ {totalOrder} ออเดอร์{" "}
                  </Card.Title>{" "}
                </Card.Body>{" "}
              </Card>{" "}
            </Col>{" "}
            <Col md={12}>
              <SalesChart />
            </Col>
          </Row>
        </Tab>
        <Tab
          eventKey="ตั้งค่าแชทบอท"
          title={
            <span className="tab-title">
              <MessageIcon /> SASI BOT
            </span>
          }
        >
          <Card>
            <Card.Body>
            
              <Row>
               
                <Col md={2}>
                  <Button
                    className="w-100"
                    variant="outline-secondary"
                    onClick={() => getWebHook()}
                    aria-label="คัดลอก webhook link"
                    title="คัดลอก webhook link"
                  >
                    <ContentCopyIcon /> คัดลอก webhook
                  </Button>
                </Col>
              </Row>

              <Row
                className="mt-3 border-top g-3"
                style={{
                  backgroundColor: "#ececec",
                  height: "auto",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
            

                <Col md={4}>
                  <div className="block bot-config-card">
                    <h5>คีย์เวิร์ด</h5>
                    <hr />
                    <Row className="g-2 align-items-center">
                      <Col md={6}>
                        <Form.Control
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          placeholder="คีย์เวิร์ด"
                        />
                      </Col>
                      <Col md={6}>
                        <Button variant="outline-primary" onClick={handleAddKeyword} className="w-100">
                          <AddIcon /> เพิ่มคีย์เวิร์ด
                        </Button>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={keywordReply}
                        onChange={(e) => setKeywordReply(e.target.value)}
                        placeholder="ข้อความตอบกลับที่บอทจะแสดงเมื่อเจอคีย์เวิร์ดนี้"
                      />
                    </div>
                    <div className="mt-2 text-end">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          const trimmedKeyword = keywordInput.trim();
                          const trimmedReply = keywordReply.trim();

                          if (!trimmedKeyword || !trimmedReply) {
                            Swal.fire({
                              icon: "warning",
                              title: "กรุณากรอกคีย์เวิร์ดและข้อความตอบกลับ",
                              confirmButtonText: "ตกลง",
                            });
                            return;
                          }

                          setBotReplies((prev) => ({
                            ...prev,
                            [trimmedKeyword]: trimmedReply,
                          }));

                          setKeywordInput(trimmedKeyword);
                          setKeywordReply(trimmedReply);
                        }}
                      >
                        บันทึกข้อความ
                      </Button>
                    </div>
                    <br />
                    <Row className="g-2 bg-light p-2 rounded-3">
                      {randomKeywords.length === 0 ? (
                        <Col xs={12}>
                          <div className="empty-state-box">ยังไม่มีการเพิ่มแชท</div>
                        </Col>
                      ) : (
                        randomKeywords.map((item, index) => (
                          <Col key={index} xs="auto">
                            <button
                              type="button"
                              className="keyword-tag"
                              onClick={() => handleKeywordClick(item)}
                            >
                              {item}
                            </button>
                          </Col>
                        ))
                      )}
                    </Row>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="block bot-config-card">
                    <h5>ข้อความตอบกลับอัตโนมัติ</h5>
                    <hr />
                    <div className="auto-reply-list">
                      {Object.keys(botReplies).length === 0 ? (
                        <div className="empty-state-box">ยังไม่มีการเพิ่มแชท</div>
                      ) : (
                        Object.entries(botReplies).map(([key, value]) => (
                          <div key={key} className="reply-item">
                            <div className="reply-header">
                              <span className="reply-key">{key}</span>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteKeyword(key)}
                              >
                                ลบ
                              </Button>
                            </div>
                            <span className="reply-value">{value}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <h5>ตัวอย่างแชทบอท</h5>
                  <hr />
                  <div className="chat-card">
                    <div className="chat-header">
                      <div className="avatar">
                        <SmartToyIcon fontSize="small" />
                      </div>
                      <div>
                        <div className="chat-title">Sasi Bot</div>
                        <div className="chat-status">ออนไลน์</div>
                      </div>
                    </div>

                    <div className="chat-body">
                      {chatMessages.map((message, index) => (
                        <div
                          key={`${message.sender}-${index}`}
                          className={`chat-row ${message.sender === "user" ? "right" : "left"}`}
                        >
                          <div className={`bubble ${message.sender === "user" ? "right" : "left"}`}>
                            {message.text}
                            <span className="bubble-time">{message.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="chat-compose">
                      <Form.Control
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="พิมพ์ข้อความเพื่อทดสอบบอท"
                        onKeyDown={handleTestInputKeyDown}
                      />
                      <Button variant="primary" onClick={handleSendChat}>
                        <SendIcon fontSize="small" />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* <Button variant="success" className="mt-4 mb-2">
                บันทึกการตั้งค่า
              </Button> */}
            </Card.Body>
          </Card>
        </Tab>
        <Tab
          eventKey="บัญชีรายจ่าย"
          title={
            <span style={{ color: "#6c757d" }}>
              <DataThresholdingIcon /> บัญชีรายจ่าย
            </span>
          }
        >
          <Accounting />
        </Tab>
      </Tabs>
    </>
  );
};

export default Admin;
