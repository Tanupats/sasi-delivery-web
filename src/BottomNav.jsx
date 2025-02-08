import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Home, ShoppingCart, Receipt, AccountCircle } from "@mui/icons-material";

const BottomNav = () => {
  const [value, setValue] = useState(0);

  return (
    <Paper  sx={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      zIndex: 1000, // ทำให้แน่ใจว่ามันอยู่บนสุด
    }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          switch (newValue) {
            case 0:
               window.location.href=  '/foodmenu'
              break;
            case 1:
               window.location.href=  '/Myorder'
              break;
            case 2:
             window.location.href=  '/cart'
              break;
            case 3:
             
              break;
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction label="เมนู" icon={<Home />} />
        <BottomNavigationAction label="คำสั่งซื้อ" icon={<Receipt />} />
        <BottomNavigationAction label="ตะกร้า" icon={<ShoppingCart />} />
        <BottomNavigationAction label="โปรไฟล์" icon={<AccountCircle />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
