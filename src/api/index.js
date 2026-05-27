import { http } from "../http"
export const getStock = async () => {
    return await http.get('/stock').then(res => res.data)
}   
export const getMenuType = async (shopId, token) => {
    if (shopId !== undefined) {
        return await http.get(`/menutype/${shopId}`, { headers: { 'apikey': token } }).then(res => res.data)
    }
}