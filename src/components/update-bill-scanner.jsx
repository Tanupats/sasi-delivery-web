import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useEffect, useState } from "react";
import { httpGet, httpPut } from "../http";
import Swal from "sweetalert2";
import { sendMessageToPage } from "../http";
export default function ScanOrderBarcode() {

    const [result, setResult] = useState("");
    const [scanning, setScanning] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!scanning) return; // ถ้าไม่สแกน หยุดทำงาน

        const scanner = new Html5QrcodeScanner(
            "scanner",
            {
                fps: 10,
                qrbox: 250,
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
            },
            false
        );

        if (scanning) {
            scanner.render(
                (decodedText, decodedResult) => {
                    //console.log("สแกนสำเร็จ:", decodedText);
                    setResult(decodedText)
                    setScanning(false); // หยุด scanner หลังได้ผล
                    // 
                },
                // (errorMessage) => {
                //     console.warn("สแกนไม่สำเร็จ:", errorMessage);
                // }
            );
        }
        return () => {
            scanner.clear().catch(() => { });
        };
    }, [scanning]);


    useEffect(() => {
        if (result !== "") {

            //get bill 
            const getBill = async () => {
                const bill = await httpGet(`/bills/${result}`).then((res) => res.data);
                setData(bill);
                let status = bill.ordertype !== "สั่งกลับบ้าน" ? "ส่งสำเร็จ" : "ทำเสร็จแล้ว";
                httpPut(`/bills/${result}`, { statusOrder: status }).then((res) => {
                    if (res.status === 200) {
                        setResult("");
                        setData(null);
                        Swal.fire({
                            title: 'อัพเดตคำสั่งซื้อสำเร็จ',
                            text: 'อัพเดตสถานะเป็นทำเสร็จแล้ว',
                            icon: 'success',
                            timer: 1300
                        })
                    }
                })

                if (bill.messengerId !== "pos") {
                    if (bill.ordertype === "สั่งกลับบ้าน") {
                        sendMessageToPage(bill.messengerId, "ออเดอร์ทำเสร็จแล้วครับ รอจัดส่งนะครับ");
                    }
                    if (bill.ordertype === "เสิร์ฟในร้าน") {
                        sendMessageToPage(bill.messengerId, "ออเดอร์ทำเสร็จแล้วครับ");
                    }
                    if (bill.ordertype === "รับเอง") {
                        sendMessageToPage(bill.messengerId, "ออเดอร์ทำเสร็จแล้วครับ");
                    }
                }
            }
            getBill();
        }
    }, [result])

    return (
        <div className="mt-4 text-center">

            <center> <div id="scanner" style={{ width: "300px" }}></div></center>
            <button
                className="btn btn-primary mb-4 mt-4"
                onClick={() => {
                    setResult("");
                    setScanning(true);
                }}
            >
                สแกนบาร์โค้ดคำสั่งซื้อ
            </button>
            {
                result && <p> รหัสบาร์โค้ด: {result} </p>
            }
            {
                data && (
                    <div className="card">
                        <div className="card-body">
                            <p>ลูกค้า - {data.customerName}</p>
                            <p>วิธีการรับอาหาร - {data.ordertype}</p>
                        </div>

                    </div>)
            }
        </div>
    );
}
