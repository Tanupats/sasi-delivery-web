import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

export const httpGet = async (path, params) => {
  try {
    const response = await axios.get(`${baseURL + path}`, params);

    return response
  } catch (error) {
    console.log('error fetch' + path);
  }
}

export const httpPost = async (path, body, header) => {
  try {
    const response = await axios.post(`${baseURL + path}`, body, header);
    return response
  } catch (error) {
    return error;
    //console.log('error fetch' + path);
  }
};

export const httpDelete = async (path, header) => {
  try {
    const response = await axios.delete(`${baseURL + path}`, header);
    return response
  } catch (error) {
    console.log('error fetch' + path);
  }
};


export const httpPut = async (path, params, header) => {
  try {
    const response = await axios.put(`${baseURL + path}`, params, header);
    return response
  } catch (error) {
    console.log('error fetch')
  }
};

export const sendNotificationBot = async (userid) => {
  try {
    const response = await axios.post(`https://api.chatfuel.com/bots/5e102b272685af000183388a/users/${userid}/send?chatfuel_token=qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74&chatfuel_block_name=order_ok`);
    return response
  } catch (error) {
    console.log('error fetch')
  }
};

export const sendDelivery = async (userid) => {
  try {
    const response = await axios.post(`https://api.chatfuel.com/bots/5e102b272685af000183388a/users/${userid}/send?chatfuel_token=qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74&chatfuel_block_name=delivery_ok`);
    return response
  } catch (error) {
    console.log('error fetch')
  }
};

export const sendDeliverySuccess = async (userid) => {
  try {
    const response = await axios.post(`https://api.chatfuel.com/bots/5e102b272685af000183388a/users/${userid}/send?chatfuel_token=qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74&chatfuel_block_name=delivery_success`);
    return response
  } catch (error) {
    console.log('error fetch')
  }
};

const page_token = import.meta.env.VITE_PAGE_ACCESS_TOKEN;
export const sendMessageToPage = (userid, messageText) => {
  axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${page_token}`, {
    recipient: {
      id: userid
    },
    message: {
      text: messageText
    }
  }).then(response => {
    if (response) {
      Swal.fire({
        title: 'ส่งข้อความรับออเดอร์สำเร็จแล้ว',
        icon: 'success',
      })

    }
  }).catch(error => {
    if (error) {
      Swal.fire({
        title: 'ส่งข้อความไปยังลูกไม่สำเร็จ',
        icon: 'error',
      })
    }
  });
}
