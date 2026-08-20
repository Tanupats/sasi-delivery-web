import { Card, Table, Badge } from "react-bootstrap";

const SalesChart = () => {
  const dayRows = [
    { date: "11/08/2026", income: 145000, expense: 38000 },
    { date: "10/08/2026", income: 132000, expense: 29000 },
    { date: "09/08/2026", income: 118000, expense: 24000 },
    { date: "08/08/2026", income: 156000, expense: 41000 },
    { date: "07/08/2026", income: 128000, expense: 22000 },
    { date: "06/08/2026", income: 139000, expense: 36000 },
  ];

  const formatMoney = (value) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const totals = dayRows.reduce(
    (acc, row) => ({
      income: acc.income + row.income,
      expense: acc.expense + row.expense,
    }),
    { income: 0, expense: 0 },
  );

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
                <th className="text-end">เงินสดคงเหลือ</th>
                <th className="text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {dayRows.map((row, index) => {
                const balance = row.income - row.expense;
                return (
                  <tr key={`${row.date}-${index}`}>
                    <td>
                      <div className="fw-semibold">{row.date}</div>
                      <small className="text-muted">สรุปรายวัน</small>
                    </td>
                    <td className="text-end text-success fw-semibold">
                      {formatMoney(row.income)}
                    </td>
                    <td className="text-end text-danger fw-semibold">
                      {formatMoney(row.expense)}
                    </td>
                    <td className={`text-end fw-bold ${balance >= 0 ? "text-primary" : "text-danger"}`}>
                      {formatMoney(balance)}
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
                <td className="text-end text-success">{formatMoney(totals.income)}</td>
                <td className="text-end text-danger">{formatMoney(totals.expense)}</td>
                <td className="text-end text-primary">
                  {formatMoney(totals.income - totals.expense)}
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
