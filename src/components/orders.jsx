import React, { useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  ModalHeader,
  Badge,
} from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Details from "./Details";
import moment from "moment/moment";
import { httpGet, httpPut, httpPost, sendImageToPage } from "../http";
import Swal from "sweetalert2";
import { AuthData } from "../ContextData";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import {
  MapPinned,
  Camera,
  Clock3,
  UserRound,
  ReceiptText,
  PackageOpen,
} from "lucide-react";
const Orders = () => {
  const { shop, user } = useContext(AuthData);
  const token = localStorage.getItem("token");
  const facebook_token = localStorage.getItem("facebook_token");
  const [report, setReport] = useState([]);
  const [file, setFile] = useState("");
  const [orderCounts, setOrderCounts] = useState({
    รับออเดอร์แล้ว: 0,
    ทำเสร็จแล้ว: 0,
    กำลังส่ง: 0,
    ส่งสำเร็จ: 0,
  });
  const [statusOrder, setStatusOrder] = useState("รับออเดอร์แล้ว");
  const shopId = localStorage.getItem("shopId");
  const [shopName, setShopName] = useState(localStorage.getItem("shopName") || "");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [id, setId] = useState("");
  const [userid, setUserId] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [riderLocation, setRiderLocation] = useState(null);
  const [routeDistances, setRouteDistances] = useState({});
  const getOrderCoordinates = (order) => ({
    lat: order.lat ?? order.latitude,
    lng: order.lng ?? order.longitude,
  });

  const getGoogleMapsUrl = (order) => {
    const { lat, lng } = getOrderCoordinates(order);
    if (
      lat === undefined ||
      lat === null ||
      lng === undefined ||
      lng === null
    ) {
      return "";
    }
    const origin = riderLocation
      ? `&origin=${encodeURIComponent(`${riderLocation.lat},${riderLocation.lng}`)}`
      : "";
    return `https://www.google.com/maps/dir/?api=1${origin}&destination=${encodeURIComponent(`${lat},${lng}`)}&travelmode=driving`;
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setRiderLocation({ lat: coords.latitude, lng: coords.longitude }),
      () => setRiderLocation(null),
      { enableHighAccuracy: true, maximumAge: 120000, timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    if (!riderLocation) return;
    let active = true;
    const destinations = report.filter((order) => {
      const { lat, lng } = getOrderCoordinates(order);
      return (
        lat !== undefined && lat !== null && lng !== undefined && lng !== null
      );
    });

    Promise.all(
      destinations.map(async (order) => {
        const { lat, lng } = getOrderCoordinates(order);
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${riderLocation.lng},${riderLocation.lat};${lng},${lat}?overview=false`,
          );
          const result = await response.json();
          return [order.id, result.routes?.[0]?.distance ?? null];
        } catch {
          return [order.id, null];
        }
      }),
    ).then((distances) => {
      if (active) {
        setRouteDistances((current) => ({
          ...current,
          ...Object.fromEntries(distances),
        }));
      }
    });

    return () => {
      active = false;
    };
  }, [report, riderLocation]);

  const getMenuReport = async (status) => {
    setReport([]);
    if (shopId) {
      setLoading(true);
      await httpGet(`/bills?status=${status}&shop_id=${shopId}`, {
        headers: { apikey: token },
      }).then((res) => {
        setReport(res.data);
      });
    }
    setLoading(false);
  };

  const getOrderCounts = async () => {
    if (!shopId) return;

    const res = await httpGet(`/bills/counter-order-status/${shopId}`, {
      headers: { apikey: token },
    });
    const counts = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

    setOrderCounts((current) => ({
      ...current,
      ...Object.fromEntries(
        counts.map(({ statusname, total }) => [statusname, Number(total) || 0]),
      ),
    }));
  };

  const dev = import.meta.env.VITE_API_URL;

  const uploadFile = async (messageid) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await httpPost(`/upload`, formData);
    if (res.status === 200) {
      const filename = dev + "/images/" + res.data.filename;
      if (filename) {
        await sendImageToPage(messageid, filename, facebook_token);
      }
      setFile("");
    }
  };

  function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image(); // ✅ ใช้ window.Image แทน
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let scaleFactor = maxWidth / img.width;
          if (scaleFactor > 1) scaleFactor = 1;
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            quality,
          );
        };

        img.onerror = reject;
        img.src = event.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const sendMessageToPage = async (userid, messageText) => {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/me/messages?access_token=${facebook_token}`,
        {
          recipient: {
            id: userid,
          },
          message: {
            text: messageText,
          },
        },
      );
      if (response) {
        Swal.fire({
          title: "ดำเนินการสำเร็จ",
          icon: "success",
          timer: 500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "ส่งข้อความไปยังลูกไม่สำเร็จ",
        icon: "error",
      });
    }
  };

  const handleFileChange = async (e, bill, userid, paymentType) => {
    setOpen(true);
    setUserId(userid);
    setId(bill);
    setPaymentType(paymentType);
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const compressedBlob = await compressImage(selectedFile, 800, 0.6); // ย่อกว้างสุด 800px, คุณภาพ 60%
      const extension = selectedFile.name.split(".").pop() || "jpg";
      const fileName =
        selectedFile.name.split(".").slice(0, -1).join(".") || "image";
      const compressedFile = new File(
        [compressedBlob],
        `${fileName}.${extension}`,
        {
          type: "image/jpeg",
        },
      );
      setFile(compressedFile);
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreview(previewUrl);
    }
  };

  const UpdateStatus = async (id, status, messageid, step, paymentType) => {
    const body = {
      statusOrder: status,
      step: step,
      rider_id: user.id,
    };
    httpPut(`/bills/${id}`, body).then(async (res) => {
      if (res) {
        if (status === "ทำเสร็จแล้ว") {
          if (messageid !== "pos") {
            sendMessageToPage(messageid, "ออเดอร์ทำเสร็จแล้ว รอส่งนะครับ");
          }
          getMenuReport("รับออเดอร์แล้ว");
          setStatusOrder("รับออเดอร์แล้ว");
        }
        if (status === "กำลังส่ง") {
          if (messageid !== "pos") {
            sendMessageToPage(messageid, "ไรเดอร์กำลังไปส่งออเดอร์ให้นะครับ");
          }
          getMenuReport("ทำเสร็จแล้ว");
          setStatusOrder("ทำเสร็จแล้ว");
        }
        if (status === "ส่งสำเร็จ") {
          if (messageid !== "pos") {
            uploadFile(messageid);

            sendMessageToPage(messageid, "จัดส่งแล้วนะครับ");
            if (paymentType !== "bank_transfer") {
              sendMessageToPage(messageid, "ได้รับเงินสดแล้วนะครับ");
            }
          }
          getMenuReport("กำลังส่ง");
          setStatusOrder("กำลังส่ง");
          setFile("");
          setOpen(false);
          setPaymentType("");
        }
        getOrderCounts();
      }
    });
  };

  useEffect(() => {
    getMenuReport("รับออเดอร์แล้ว");
    getOrderCounts();
  }, [shopId]);

  useEffect(() => {
    if (!shopId || shopName) return;

    httpGet(`/shop/${shopId}`)
      .then((res) => {
        const shop = Array.isArray(res.data) ? res.data[0] : res.data;
        const name = shop?.shop_name ?? shop?.shopname ?? shop?.shopName ?? shop?.name;
        if (name) {
          setShopName(name);
          localStorage.setItem("shopName", name);
        }
      })
      .catch(() => {});
  }, [shopId, shopName]);

  return (
    <>
      <Modal show={open}>
        <ModalHeader>
          <Modal.Title>ยืนยันส่งออเดอร์</Modal.Title>
        </ModalHeader>

        <Modal.Body>
          <img
            style={{ width: "100%", height: 300, objectFit: "cover" }}
            src={preview}
          />
          <Row className="mt-3">
            <Col md={6} xs={6}>
              <Button
                style={{ fontSize: 18 }}
                className="mb-2"
                onClick={() => {
                  setOpen(false);
                  UpdateStatus(id, "ส่งสำเร็จ", userid, 4, paymentType);
                }}
                variant="success w-100"
              >
                ส่งสำเร็จ
              </Button>
            </Col>
            <Col md={6} xs={6}>
              <Button
                variant="danger w-100"
                style={{ fontSize: 18 }}
                onClick={() => setOpen(false)}
              >
                {" "}
                ยกเลิก
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <Row className="mt-3">
        <Col md={12}>
          <Card style={{ border: "none", marginTop: "12px" }}>
            <Form>
              <Row className="when-print orders-toolbar sticky-top">
                <div className="orders-shop-context">
              
                  <strong>{shopName || "กำลังโหลดชื่อร้าน..."}</strong>
                </div>
                <ButtonGroup
                  aria-label="สถานะออเดอร์"
                  className="orders-status-tabs"
                >
                  <Button
                    style={{ color: 'white' }}
                    variant="light"
                    className={
                      statusOrder === "รับออเดอร์แล้ว"
                        ? "orders-status-tab active"
                        : "orders-status-tab"
                    }
                    onClick={() => {
                      (getMenuReport("รับออเดอร์แล้ว"),
                        setStatusOrder("รับออเดอร์แล้ว"));
                    }}
                  >
                    <span>ใหม่</span>
                    <b>{orderCounts["รับออเดอร์แล้ว"]}</b>
                  </Button>
                  <Button
                    variant="light"
                    className={
                      statusOrder === "ทำเสร็จแล้ว"
                        ? "orders-status-tab active"
                        : "orders-status-tab"
                    }
                    onClick={() => {
                      (getMenuReport("ทำเสร็จแล้ว"),
                        setStatusOrder("ทำเสร็จแล้ว"));
                    }}
                  >
                    <span>พร้อมส่ง</span>
                    <b>{orderCounts["ทำเสร็จแล้ว"]}</b>
                  </Button>
                  <Button
                    variant="light"
                    className={
                      statusOrder === "กำลังส่ง"
                        ? "orders-status-tab active"
                        : "orders-status-tab"
                    }
                    onClick={() => {
                      (getMenuReport("กำลังส่ง"), setStatusOrder("กำลังส่ง"));
                    }}
                  >
                    <span>กำลังส่ง</span>
                    <b>{orderCounts["กำลังส่ง"]}</b>
                  </Button>
                  <Button
                    variant="light"
                    className={
                      statusOrder === "ส่งสำเร็จ"
                        ? "orders-status-tab active"
                        : "orders-status-tab"
                    }
                    onClick={() => {
                      (getMenuReport("ส่งสำเร็จ"), setStatusOrder("ส่งสำเร็จ"));
                    }}
                  >
                    <span>ส่งสำเร็จ</span>
                    <b>{orderCounts["ส่งสำเร็จ"]}</b>
                  </Button>
                </ButtonGroup>
              </Row>

              <Row>
                <div className="mt-3 text-center">
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                      >
                        {" "}
                      </Spinner>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                {!loading &&
                  !report.some((item) => item.ordertype === "สั่งกลับบ้าน") && (
                    <Col xs={12}>
                      <div className="orders-empty-state" role="status">
                        <span className="orders-empty-icon">
                          <PackageOpen size={30} strokeWidth={1.7} />
                        </span>
                        <h3>ไม่มีข้อมูล</h3>
                        <p>ยังไม่มีออเดอร์ในสถานะ {statusOrder}</p>
                      </div>
                    </Col>
                  )}

                {report.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.ordertype === "สั่งกลับบ้าน" && (
                      <Col md={6} xl={4} className="orders-card-col">
                        <Card className="orders-card mb-4 mt-4" id={item.id}>
                          <Card.Body>
                            <div className="text-center show-header">
                              <h5>{shop?.name}</h5>
                              <h5>ใบเสร็จรับเงิน</h5>
                            </div>
                            <div className="orders-card-header">
                              <div>
                                <span className="orders-order-number">
                                  <ReceiptText size={15} /> #
                                  {item.bill_ID.slice(-5).toUpperCase()}
                                </span>
                                <span className="orders-order-time">
                                  <Clock3 size={14} />{" "}
                                  {moment(item.timeOrder).format(
                                    "DD MMM YYYY, HH:mm",
                                  )}{" "}
                                  น.
                                </span>
                              </div>
                              <Badge className="orders-status-badge">
                                {item.statusOrder}
                              </Badge>
                            </div>
                            <div className="orders-customer">
                              <span className="orders-customer-icon">
                                <UserRound size={18} />
                              </span>
                              <strong>{item.customerName || "ลูกค้า"}</strong>
                            </div>
                            <Details
                              id={item.id}
                              bill_ID={item.bill_ID}
                              status={item.statusOrder}
                            />
                            {(() => {
                              const { lat, lng } = getOrderCoordinates(item);
                              const hasDestination =
                                lat !== undefined &&
                                lat !== null &&
                                lng !== undefined &&
                                lng !== null;
                              const mapUrl =
                                riderLocation && hasDestination
                                  ? `https://maps.google.com/maps?saddr=${riderLocation.lat},${riderLocation.lng}&daddr=${lat},${lng}&output=embed`
                                  : hasDestination
                                    ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
                                    : "";
                              const distance = routeDistances[item.id];

                              return (
                                <section className="orders-delivery-info">
                                  <div className="orders-delivery-heading">
                                    <span className="orders-pin-icon">
                                      <MapPinned size={18} />
                                    </span>
                                    <div>
                                      <strong>รายละเอียดการจัดส่ง</strong>
                                    </div>
                                  </div>
                                  <p className="orders-address">
                                    {item.address || "ไม่มีรายละเอียดที่อยู่"}
                                  </p>
                                  {hasDestination && (
                                    <>
                                      {riderLocation && (
                                        <div className="orders-route-summary">
                                          <span>
                                            <b>A</b> จุดรับ
                                          </span>
                                          <span
                                            className="orders-route-line"
                                            aria-hidden="true"
                                          />
                                          <span>
                                            <b>B</b> จุดส่ง
                                          </span>
                                          <strong>
                                            {distance
                                              ? `${(distance / 1000).toFixed(1)} กม.`
                                              : "กำลังคำนวณ"}
                                          </strong>
                                        </div>
                                      )}
                                      <iframe
                                        className="orders-map-preview"
                                        title={`แผนที่ไปยังออเดอร์ ${item.bill_ID.slice(-5)}`}
                                        src={mapUrl}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                      />
                                      <div className="orders-location-row">
                                        <Button
                                          as="a"
                                          href={getGoogleMapsUrl(item)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="orders-map-button"
                                        >
                                          <MapPinned size={17} /> นำทาง
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </section>
                              );
                            })()}
                            <div className="orders-total-row">
                              <Badge
                                className={`orders-payment-badge ${
                                  item.payment_type === "bank_transfer"
                                    ? "orders-payment-badge-transfer"
                                    : "orders-payment-badge-cash"
                                }`}
                              >
                                {item.payment_type === "bank_transfer"
                                  ? "เงินโอน"
                                  : "จ่ายเงินสด"}
                              </Badge>
                              <strong>
                                {item.amount} <small>บาท</small>
                              </strong>
                            </div>

                            <Row className="mt-2">
                              {item.statusOrder === "รับออเดอร์แล้ว" && (
                                <Col md={12} xs={12} className="mb-2">
                                  <Button
                                    style={{ fontSize: 20 }}
                                    className="mb-2"
                                    onClick={() => {
                                      UpdateStatus(
                                        item.id,
                                        "ทำเสร็จแล้ว",
                                        item.messengerId,
                                        2,
                                      );
                                    }}
                                    variant="success w-100"
                                  >
                                    ดำเนินการต่อ
                                  </Button>
                                </Col>
                              )}

                              {item.statusOrder === "ทำเสร็จแล้ว" &&
                                item.ordertype === "สั่งกลับบ้าน" && (
                                  <>
                                    <Col md={12} xs={12}>
                                      <Button
                                        style={{ fontSize: 20 }}
                                        className="mb-2"
                                        onClick={() => {
                                          UpdateStatus(
                                            item.id,
                                            "กำลังส่ง",
                                            item.messengerId,
                                            3,
                                          );
                                        }}
                                        variant="success w-100"
                                      >
                                        เปลี่ยนเป็นกำลังส่ง
                                      </Button>
                                    </Col>
                                  </>
                                )}
                              {item.statusOrder === "กำลังส่ง" && (
                                <>
                                  <Col md={6} xs={12}>
                                    <div className="delivery-proof-upload-wrap mb-4">
                                      <label
                                        htmlFor={`proof-upload-${item.id}`}
                                        className="delivery-proof-upload"
                                      >
                                        <input
                                          id={`proof-upload-${item.id}`}
                                          type="file"
                                          accept="image/*"
                                          capture="environment"
                                          onChange={(e) =>
                                            handleFileChange(
                                              e,
                                              item.id,
                                              item.messengerId,
                                              item.payment_type,
                                            )
                                          }
                                        />
                                        <span className="delivery-proof-icon">
                                          <Camera size={20} strokeWidth={2.2} />
                                        </span>
                                        <span className="delivery-proof-text">
                                          <strong>ถ่ายรูปหลักฐาน การจัดส่ง</strong>
                                          <small></small>
                                        </span>
                                      </label>
                                    </div>
                                  </Col>
                                  <Col md={6} xs={12}>
                                    <Button
                                      style={{ fontSize: 18 }}
                                      className="mb-2"
                                      onClick={() => {
                                        Swal.fire({
                                          title: "ยืนยันการจัดส่ง?",
                                          text: "คุณต้องการเปลี่ยนสถานะเป็น 'จัดส่งสำเร็จ' หรือไม่",
                                          icon: "question",
                                          showCancelButton: true,
                                          confirmButtonText: "ยืนยัน",
                                          cancelButtonText: "ยกเลิก",
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            UpdateStatus(
                                              item.id,
                                              "ส่งสำเร็จ",
                                              item.messengerId,
                                              4,
                                              item.payment_type,
                                            );
                                          }
                                        });
                                      }}
                                      variant="success w-100"
                                    >
                                      ยืนยันการจัดส่ง
                                    </Button>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                  </React.Fragment>
                ))}
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Orders;
