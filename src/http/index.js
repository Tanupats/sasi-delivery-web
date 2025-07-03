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


export const sendImageToPage = (userid, url) => {
  const PAGE_ACCESS_TOKEN = 'EAAkMtjSMoDoBOZCGYSt499z6jgiiAjAicsajaOWhjqIxmHsl0asrAm61k6LgD1ifGXHzbDsHrJFCZASriCSyoPDpeqFh3ZBTrWC4ymdZCZBwcioKueKj31QK6w6GFHILPiJaZA8hgNHXtW5OqkRTZBzI0VFvIOoVhGdGq28DvOHGVSNEmPMJjkAOikE1thOaF3mzDg6dnjSyZBGpIY6mMZA1rWaIx';
  console.log('send image')
  axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    recipient: {
      id: userid
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: url,
          is_reusable: false
        }
      }
    }
  }).then(response => {
    console.log('Image sent:', response.data);
  }).catch(error => {
    console.error('Error sending image:', error.response?.data || error.message);
  });
}

