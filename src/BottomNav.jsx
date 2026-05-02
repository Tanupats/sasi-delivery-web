import { useState } from "react";
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
        sx={{
          '& .MuiBottomNavigationAction-root': {
            color: '#999',
            transition: 'color 0.3s ease',
            '&.Mui-selected': {
              color: '#ff6b35',
              fontWeight: 'bold',
            },
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />}   />
        <BottomNavigationAction label="Orders" icon={<Receipt    />}  />
        <BottomNavigationAction label="Cart" icon={<ShoppingCart   />}  />
        <BottomNavigationAction label="Profile" icon={<AccountCircle />  } />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
