import { useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Building2, CalendarDays, CarFront, IdCard, UserRound } from "lucide-react";
import { AuthData } from "../ContextData";

const Profile = () => {
  const { staffName, user } = useContext(AuthData);
  const name = user?.name || staffName || localStorage.getItem("name") || "ผู้ขับ Rider";
  const role = user?.department || localStorage.getItem("role") || "Rider";
  const userId = user?.id || localStorage.getItem("userId");
  const shopId = user?.shop_id || localStorage.getItem("shopId");
  const registeredAt = user?.createdAt || user?.created_at || user?.registeredAt || user?.registered_at;
  const registrationDate = registeredAt && !Number.isNaN(new Date(registeredAt).getTime())
    ? new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "long", year: "numeric" }).format(new Date(registeredAt))
    : "ไม่พบข้อมูล";
  const initials = name.trim().charAt(0).toUpperCase();

  return (
    <main className="rider-profile-page">
      <header className="rider-profile-heading">
        <p>บัญชีผู้ใช้งาน</p>
        <h1>โปรไฟล์คนขับ</h1>
        <span>จัดการและตรวจสอบข้อมูลบัญชี Rider ของคุณ</span>
      </header>

      <section className="rider-profile-card" aria-label="ข้อมูลโปรไฟล์คนขับ">
        <div className="rider-profile-cover" />
        <div className="rider-profile-summary">
          <div className="rider-profile-avatar" aria-hidden="true">{initials}</div>
          <div className="rider-profile-identity">
           
            <div className="rider-profile-title">
              <h2>{name}</h2>
              <span className="rider-profile-role"><BadgeCheck size={16} /> {role}</span>
            </div>
          </div>
        </div>

        <div className="rider-profile-details">
          <h3>ข้อมูลบัญชี</h3>
          <div className="rider-profile-detail-grid">
            <div className="rider-profile-detail">
              <span className="rider-profile-detail-icon"><UserRound size={19} /></span>
              <div><small>ชื่อผู้ใช้งาน</small><strong>{name}</strong></div>
            </div>
            <div className="rider-profile-detail">
              <span className="rider-profile-detail-icon"><IdCard size={19} /></span>
              <div><small>รหัสผู้ใช้งาน</small><strong>{userId || "ไม่พบข้อมูล"}</strong></div>
            </div>
            <div className="rider-profile-detail">
              <span className="rider-profile-detail-icon"><BadgeCheck size={19} /></span>
              <div><small>ประเภทบัญชี</small><strong>{role}</strong></div>
            </div>
           
            <div className="rider-profile-detail">
              <span className="rider-profile-detail-icon"><CalendarDays size={19} /></span>
              <div><small>วันที่ลงทะเบียน</small><strong>{registrationDate}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="rider-vehicle-card" aria-label="ข้อมูลรถ">
        <div className="rider-vehicle-heading">
          <span className="rider-vehicle-icon"><CarFront size={21} /></span>
          <div>
            <h2>ข้อมูลรถ</h2>
            <p>รายละเอียดรถที่ใช้สำหรับจัดส่ง</p>
          </div>
          <span className="rider-vehicle-status">รออัปเดต</span>
        </div>
        <div className="rider-vehicle-details">
          <div><small>ประเภทรถ</small><strong>ยังไม่ได้ระบุ</strong></div>
          <div><small>ยี่ห้อ / รุ่น</small><strong>ยังไม่ได้ระบุ</strong></div>
          <div><small>ทะเบียนรถ</small><strong>ยังไม่ได้ระบุ</strong></div>
          <div><small>สีรถ</small><strong>ยังไม่ได้ระบุ</strong></div>
        </div>
        <p className="rider-vehicle-note">สามารถเพิ่มหรือแก้ไขข้อมูลรถได้ภายหลัง</p>
      </section>

      <Link to="/orders" className="rider-profile-orders-link">
        <span>
          <strong>ไปที่ออเดอร์จัดส่ง</strong>
          <small>ตรวจสอบและจัดการรายการจัดส่งของคุณ</small>
        </span>
        <ArrowRight size={20} />
      </Link>
    </main>
  );
};

export default Profile;
