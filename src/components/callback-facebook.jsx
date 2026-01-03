import axios from "axios";
import { useEffect } from "react";

const authUi = () => {
    async function handler() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
            return res.status(400).send("Missing code");
        }

        try {
            // 1️⃣ แลก code → access token
            const tokenRes = await axios.get(
                "https://graph.facebook.com/v19.0/oauth/access_token",
                {
                    params: {
                        client_id: process.env.VITE_PUBLIC_FB_APP_ID,
                        client_secret: process.env.VITE_FB_APP_SECRET,
                        redirect_uri: "app-pos.sasirestuarant.com/facebook/callback",
                        code,
                    },
                }
            );

            const userAccessToken = tokenRes.data.access_token;

            // 2️⃣ ดึงข้อมูล user
            const me = await axios.get("https://graph.facebook.com/me", {
                params: {
                    fields: "id,name",
                    access_token: userAccessToken,
                },
            });

            // 3️⃣ (ถ้าจะใช้เพจ) ดึง page token
            const pages = await axios.get("https://graph.facebook.com/me/accounts", {
                params: {
                    access_token: userAccessToken,
                },
            });

            console.log("Facebook User:", me);
            console.log("Facebook Pages:", pages);
            /**
             * TODO:
             * - บันทึก user
             * - บันทึก page_id + page_access_token
             */

            // 4️⃣ redirect กลับหน้าเว็บ
            //res.redirect("https://yourdomain.com/dashboard");
        } catch (err) {
            console.error(err);
            res.status(500).send("Facebook login failed");
        }
    }


    useEffect(() => {
        handler();

    }, [])

    return (<div>
        Facebook Callback

    </div>
    )

}

export default authUi;

