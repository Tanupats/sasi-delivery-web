import { Card, Table, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { http } from "../../http";
const SalesChart = () => {
  const [dayRows, setDayRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatMoney = (value) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatBalancePercentage = (balance, sales) =>
    sales > 0 ? `${((balance / sales) * 100).toFixed(2)}%` : "-";

  const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const { sales: totalSales, expense: totalExpense } = dayRows.reduce(
    (acc, row) => ({
      sales: acc.sales + toNumber(row.sales_amount),
      expense: acc.expense + toNumber(row.expense_amount),
    }),
    { sales: 0, expense: 0 },
  );
  const totalBalance = totalSales - totalExpense;

  const formatDate = (value) => {
    if (!value) return "-";
    const datePart = String(value).slice(0, 10);
    const [year, month, day] = datePart.split("-");
    return year && month && day ? `${day}/${month}/${year}` : datePart;
  };

  const getReport = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");

    try {
      const res = await http.get("/report-balance", { headers: { apikey: token } });
      const payload = res?.data?.data ?? res?.data;
      if (payload?.status === false) {
        throw new Error(payload.msg || "ไม่สามารถโหลดข้อมูลรายงานได้");
      }
      const rows = Array.isArray(payload) ? payload : payload?.rows ?? [];

      setDayRows(rows);
    } catch {
      setError("ไม่สามารถโหลดข้อมูลรายงานได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getReport();
  }, []);

  return (
    <Card className="mt-3 shadow-sm border-0" style={{ overflow: "hidden" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h5 className="mb-1">สรุปรายวัน</h5>
            <p className="text-muted mb-0">แสดงรายได้ รายจ่าย และเงินสดคงเหลือในแต่ละวัน</p>
          </div>
          <Badge bg="success" pill>
            อัปเดตล่าสุดวันนี้
          </Badge>
        </div>

        <div className="table-responsive">
          <Table bordered hover className="align-middle mb-0">
            <thead style={{ backgroundColor: "#0d6efd", color: "#fff" }}>
              <tr>
                <th>วันที่</th>
                <th className="text-end">รายได้</th>
                <th className="text-end">รายจ่าย</th>
                <th className="text-end">เงินสดคงเหลือ (% ของยอดขาย)</th>
                <th className="text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={5} className="text-center text-danger py-4">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && dayRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    ไม่พบข้อมูลรายงาน
                  </td>
                </tr>
              )}
              {!loading && dayRows.map((row, index) => {
                let sales = toNumber(row.sales_amount);
                let expense = toNumber(row.expense_amount);
                let balance = sales - expense;
                return (
                  <tr key={`${row.id ?? row.summary_date}-${index}`}>
                    <td>
                      <div className="fw-semibold">{formatDate(row.summary_date)}</div>
                      <small className="text-muted">สรุปรายวัน</small>
                    </td>
                    <td className="text-end text-success fw-semibold">
                      {formatMoney(sales)}
                    </td>
                    <td className="text-end text-danger fw-semibold">
                      {formatMoney(expense)}
                    </td>
                    <td className={`text-end fw-bold ${balance >= 0 ? "text-primary" : "text-danger"}`}>
                      {formatMoney(balance)}
                      <div className="small fw-normal">
                        {formatBalancePercentage(balance, sales)}
                      </div>
                    </td>
                    <td className="text-center">
                      <Badge bg={balance >= 0 ? "success" : "danger"} pill>
                        {balance >= 0 ? "ดี" : "ติดลบ"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
              <tr className="table-light fw-bold">
                <td>รวม</td>
                <td className="text-end text-success">{formatMoney(totalSales)}</td>
                <td className="text-end text-danger">{formatMoney(totalExpense)}</td>
                <td className="text-end text-primary">
                  {formatMoney(totalBalance)}
                  <div className="small fw-normal">
                    {formatBalancePercentage(totalBalance, totalSales)}
                  </div>
                </td>
                <td className="text-center">-</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SalesChart;
