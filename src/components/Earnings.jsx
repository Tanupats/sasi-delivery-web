import { useState } from "react";
import { ArrowRight, CalendarDays, CircleDollarSign, PackageCheck, ReceiptText, Wallet } from "lucide-react";

const dailyRecords = [
  { dayOffset: 0, deliveries: 3, specialPay: 140 },
  { dayOffset: 1, deliveries: 2, specialPay: 100 },
  { dayOffset: 2, deliveries: 1, specialPay: 60 },
  { dayOffset: 3, deliveries: 4, specialPay: 160 },
  { dayOffset: 4, deliveries: 0, specialPay: 0 },
  { dayOffset: 5, deliveries: 3, specialPay: 120 },
  { dayOffset: 6, deliveries: 2, specialPay: 80 },
];

const dailyRate = 300;
const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const shortDateFormatter = new Intl.DateTimeFormat("th-TH", {
  weekday: "short",
  day: "numeric",
});

const getRecordDate = (dayOffset) => {
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  return date;
};

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatBaht = (amount) =>
  new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(amount);

const records = dailyRecords.map((record) => ({
  ...record,
  date: getRecordDate(record.dayOffset),
  total: dailyRate + record.specialPay,
}));

const totalBasePay = dailyRate * records.length;
const totalSpecialPay = records.reduce((sum, record) => sum + record.specialPay, 0);
const totalDeliveries = records.reduce((sum, record) => sum + record.deliveries, 0);
const totalEarnings = totalBasePay + totalSpecialPay;

const Earnings = () => {
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()));
  const selectedRecord = records.find(
    (record) => toDateInputValue(record.date) === selectedDate,
  );

  return (
    <main className="rider-earnings-page">
      <header className="rider-earnings-heading">
        <div>
          <p>รายได้ของฉัน</p>
          <h1>สรุปรายได้</h1>
          <span>ภาพรวมรายได้จากค่าแรงประจำวันและค่ารอบพิเศษ</span>
        </div>
        <label className="rider-earnings-period" htmlFor="earnings-date">
          <CalendarDays size={17} />
          <span>เลือกวันที่</span>
          <input
            id="earnings-date"
            type="date"
            min={toDateInputValue(records[records.length - 1].date)}
            max={toDateInputValue(records[0].date)}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            aria-label="เลือกวันที่เพื่อดูรายได้รายวัน"
          />
        </label>
      </header>

      <section className="rider-earnings-hero" aria-label="รายได้รวม">
        <div className="rider-earnings-hero-copy">
          <span className="rider-earnings-hero-icon"><Wallet size={23} /></span>
          <div>
            <p>รายได้รวม 7 วันล่าสุด</p>
            <h2>{formatBaht(totalEarnings)} <small>บาท</small></h2>
          </div>
        </div>
        <span className="rider-earnings-demo-tag">ข้อมูลตัวอย่าง</span>
        <div className="rider-earnings-hero-decoration" aria-hidden="true" />
      </section>

      <section className="rider-earnings-stats" aria-label="รายละเอียดรายได้">
        <article className="rider-earnings-stat">
          <span className="rider-earnings-stat-icon base"><CalendarDays size={20} /></span>
          <div><small>ค่าจ้าง</small><strong>{formatBaht(totalBasePay)} <span>บาท</span></strong><p>300 บาท × {records.length} วัน</p></div>
        </article>
        <article className="rider-earnings-stat">
          <span className="rider-earnings-stat-icon special"><CircleDollarSign size={20} /></span>
          <div><small>ค่ารอบพิเศษ</small><strong>{formatBaht(totalSpecialPay)} <span>บาท</span></strong><p>ค่าส่งรวมจากออเดอร์</p></div>
        </article>
        <article className="rider-earnings-stat">
          <span className="rider-earnings-stat-icon deliveries"><PackageCheck size={20} /></span>
          <div><small>ออเดอร์ที่จัดส่ง</small><strong>{formatBaht(totalDeliveries)} <span>รายการ</span></strong><p>ในช่วง 7 วันล่าสุด</p></div>
        </article>
      </section>

      <section className="rider-earnings-table-card">
        <div className="rider-earnings-table-heading">
          <div>
            <span className="rider-earnings-table-icon"><ReceiptText size={19} /></span>
            <div><h2>รายได้รายวัน</h2><p>กดวันที่เพื่อดูรายละเอียดของวันนั้น</p></div>
          </div>
          <strong>{records.length} วัน</strong>
        </div>

        <div className="rider-earnings-table-wrap">
          <table className="rider-earnings-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th className="numeric">ออเดอร์</th>
                <th className="numeric">ค่าแรงพื้นฐาน</th>
                <th className="numeric">ค่ารอบพิเศษ</th>
                <th className="numeric">รวมรายได้</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const dateValue = toDateInputValue(record.date);
                const isSelected = selectedDate === dateValue;
                return (
                  <tr key={record.dayOffset} className={isSelected ? "selected" : ""}>
                    <td>
                      <button
                        type="button"
                        className="rider-earnings-date-button"
                        onClick={() => setSelectedDate(dateValue)}
                        aria-pressed={isSelected}
                      >
                        <strong>{dateFormatter.format(record.date)}</strong>
                        <small>{shortDateFormatter.format(record.date)}</small>
                        <span>ดูรายละเอียด <ArrowRight size={13} /></span>
                      </button>
                    </td>
                    <td className="numeric">{record.deliveries} รายการ</td>
                    <td className="numeric">{formatBaht(dailyRate)} บาท</td>
                    <td className="numeric">{formatBaht(record.specialPay)} บาท</td>
                    <td className="numeric total">{formatBaht(record.total)} <span>บาท</span></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">รวม 7 วัน</td>
                <td className="numeric">{formatBaht(totalBasePay)} บาท</td>
                <td className="numeric">{formatBaht(totalSpecialPay)} บาท</td>
                <td className="numeric total">{formatBaht(totalEarnings)} <span>บาท</span></td>
              </tr>
            </tfoot>
          </table>
        </div>

      
        <p className="rider-earnings-note">* ข้อมูลทั้งหมดเป็นตัวอย่างสำหรับแสดงหน้าจอ ยังไม่ได้เชื่อมต่อข้อมูลจริง</p>
      </section>
    </main>
  );
};

export default Earnings;
