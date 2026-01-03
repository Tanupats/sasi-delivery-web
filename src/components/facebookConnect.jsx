import { useEffect, useState,useContext } from "react";
import { httpPut } from "../http";
import { AuthData } from "../ContextData";
export default function FacebookLogin() {
  const [fbReady, setFbReady] = useState(false);
  const {shop} = useContext(AuthData);
  const appId = import.meta.env.VITE_PUBLIC_FB_APP_ID;
 useEffect(() => {
  window.fbAsyncInit = function () {
    window.FB.init({
      appId: appId,
      cookie: true,
      xfbml: false,
      version: 'v19.0',
    });
  };

  if (!document.getElementById("facebook-jssdk")) {
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    document.body.appendChild(script);
    setFbReady(true);
  }
}, []);

  console.log("shop id:", shop); 
const updateUserToken = async (token) => {
      const id = shop.id;
      const body = {
        facebook_token: token,
      }
      await httpPut(`/shop/${id}`,body).then((res)=>{

        if(res.status === 200){
          alert("บันทึกการเชื่อมเพจ Facebook สำเร็จ");
        }
      })
      console.log("User Token:", token); 
      console.log("shop id:", id); 
}

  function loginWithFacebook() {
    if (!fbReady) {
      alert("Facebook SDK not ready");
      return;
    }

    FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("User Token:", response.authResponse.accessToken);
          updateUserToken( response.authResponse.accessToken);
        } else {
          alert("Login cancelled");
        }
      },
      {
        scope: "pages_show_list,pages_messaging,pages_read_engagement",
      }
    );
  }

  return (
    <button 
    variant="contained"
    
    onClick={loginWithFacebook} disabled={!fbReady}>
      Login with Facebook
    </button>
  );
}
