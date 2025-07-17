import FtpDeploy from "ftp-deploy";

const ftpDeploy = new FtpDeploy();


const config = {
  user: "sasirest",
  password: "T7y80MRsQu+2x!",
  host: "sasirestuarant.com",
  port: 21,
  localRoot:"dist",  // โฟลเดอร์ที่คุณจะอัปโหลด (เช่น build หรือ dist)
  remoteRoot: "domains/pos.sasirestuarant.com/public_html/",     // โฟลเดอร์ปลายทางบนเซิร์ฟเวอร์
  include: ["*", "**/*"],          // รวมทุกไฟล์
  deleteRemote: true,              // ลบของเก่าก่อนอัปโหลด
  forcePasv: true
};

ftpDeploy
  .deploy(config)
  .then(res => console.log("🚀 Finished:", res))
  .catch(err => console.error("❌ Error:", err));
