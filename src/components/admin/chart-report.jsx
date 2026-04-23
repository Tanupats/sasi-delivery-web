import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { httpGet, httpPost } from "../../http";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Row, Col, Button, Card } from "react-bootstrap";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
const SalesChart = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([
    12000, 9000, 15000, 60000, 5000, 8000, 7000, 6000, 4000, 3000, 2000, 1000,
  ]);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem("token");
  const shopId = localStorage.getItem("shopId");
  const fetchData = async () => {
    const body = { shop_id: shopId, year: year };
    const res = await httpPost("/bills/sales-by-year", body, {
      header: { apikey: token },
    });
    setData(res.data.data);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  const chartData = {
    labels: [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ],
    datasets: [
      {
        label: "ยอดขาย (บาท)",
        data: data,
        backgroundColor: "rgba(255, 159, 64, 0.6)", // สีแท่ง
        borderColor: "rgba(255, 159, 64, 1)", // สีขอบ
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card className="mt-2">
      <Row className="mt-4 text-center">
        <Col md={4}>
          <Button variant="secondary" onClick={() => setYear(year - 1)}>
            ย้อนกลับ
          </Button>
        </Col>

        <Col md={4}>
          {" "}
          <h5>
          ยอดขาย {total.toLocaleString('th-TH')} บาท ปี {year}
          </h5>
        </Col>

        <Col md={4}>
          {" "}
          <Button variant="secondary" onClick={() => setYear(year + 1)}>
            ถัดไป
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          <Bar data={chartData} />
        </Col>
        <Col md={3}></Col>
      </Row>
    </Card>
  );
};

export default SalesChart;
