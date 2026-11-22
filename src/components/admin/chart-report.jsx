import { Card, Table, Badge, Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { http } from "../../http";
import Swal from "sweetalert2";

const getToday = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const SalesChart = () => {
  const [dayRows, setDayRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);
  const [summaryForm, setSummaryForm] = useState({
    summary_date: getToday(),
    sales_amount: "",
    expense_amount: "",
  });

  const formatMoney = (value) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatBalancePercentage = (balance, sales) =>
    sales > 0 ? `${((balance / sales) * 100).toFixed(2)}%` : "-";

  const getBalanceRating = (balance, sales) => {
    if (sales <= 0) return { label: "-", variant: "secondary" };

    const percentage = (balance / sales) * 100;
    if (percentage > 40) return { label: "ดีมาก", variant: "success" };
    if (percentage >= 40) return { label: "ดี", variant: "primary" };
    return { label: "แย่", variant: "danger" };
  };

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
  const totalRating = getBalanceRating(totalBalance, totalSales);

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

  const handleSaveSummary = async (event) => {
    event.preventDefault();
    const salesAmount = Number(summaryForm.sales_amount);
    const expenseAmount = Number(summaryForm.expense_amount);

    if (
      !summaryForm.summary_date ||
      summaryForm.sales_amount === "" ||
      summaryForm.expense_amount === "" ||
      !Number.isFinite(salesAmount) ||
      !Number.isFinite(expenseAmount) ||
      salesAmount < 0 ||
      expenseAmount < 0
    ) {
      await Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกวันที่ ยอดขาย และค่าใช้จ่ายให้ถูกต้อง",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setSavingSummary(true);
    try {
      const token = localStorage.getItem("token");
      const res = await http.post(
        "/report-balance",
        {
          summary_date: new Date(
            `${summaryForm.summary_date}T00:00:00.000Z`,
          ).toISOString(),
          sales_amount: salesAmount,
          expense_amount: expenseAmount,
        },
        { headers: { apikey: token } },
      );

      if (!res?.status || res.status >= 400 || res.data?.status === false) {
        throw new Error(
          res?.data?.msg || res?.response?.data?.msg || "ไม่สามารถบันทึกสรุปยอดได้",
        );
      }

      setShowSummaryModal(false);
      setSummaryForm({
        summary_date: getToday(),
        sales_amount: "",
        expense_amount: "",
      });
      await getReport();
      await Swal.fire({
        icon: "success",
        title: "บันทึกสรุปยอดสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (saveError) {
      await Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: saveError.message || "ไม่สามารถบันทึกสรุปยอดได้",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setSavingSummary(false);
    }
  };

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
            <Button
              className="mt-2"
              variant="primary"
              onClick={() => setShowSummaryModal(true)}
            >
              บันทึกสรุปยอด
            </Button>
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
                <th className="text-end">เงินสดคงเหลือ</th>
                <th className="text-end">คิดเป็น (% ของยอดขาย)</th>
                <th className="text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={6} className="text-center text-danger py-4">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && dayRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    ไม่พบข้อมูลรายงาน
                  </td>
                </tr>
              )}
              {!loading && dayRows.map((row, index) => {
                let sales = toNumber(row.sales_amount);
                let expense = toNumber(row.expense_amount);
                let balance = sales - expense;
                const rating = getBalanceRating(balance, sales);
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
                    </td>
                    <td className="text-end">
                      {formatBalancePercentage(balance, sales)}
                    </td>
                    <td className="text-center">
                      <Badge bg={rating.variant} pill>
                        {rating.label}
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
                </td>
                <td className="text-end">
                  {formatBalancePercentage(totalBalance, totalSales)}
                </td>
                <td className="text-center">
                  <Badge bg={totalRating.variant} pill>
                    {totalRating.label}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
      <Modal
        show={showSummaryModal}
        onHide={() => {
          if (!savingSummary) setShowSummaryModal(false);
        }}
        centered
      >
        <Form onSubmit={handleSaveSummary}>
          <Modal.Header closeButton>
            <Modal.Title>บันทึกสรุปยอด</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>วันที่</Form.Label>
              <Form.Control
                type="date"
                required
                value={summaryForm.summary_date}
                onChange={(event) =>
                  setSummaryForm((form) => ({ ...form, summary_date: event.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ยอดขาย (บาท)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                required
                value={summaryForm.sales_amount}
                onChange={(event) =>
                  setSummaryForm((form) => ({ ...form, sales_amount: event.target.value }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>ค่าใช้จ่าย (บาท)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                required
                value={summaryForm.expense_amount}
                onChange={(event) =>
                  setSummaryForm((form) => ({ ...form, expense_amount: event.target.value }))
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="justify-content-start">
            <Button
              variant="secondary"
              onClick={() => setShowSummaryModal(false)}
              disabled={savingSummary}
            >
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary" disabled={savingSummary}>
              {savingSummary ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
};

export default SalesChart;
