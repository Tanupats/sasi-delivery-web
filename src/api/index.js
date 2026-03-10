import { httpGet } from "../http"
export const getStock = async () => {
    return await httpGet('/stock').then(res => res.data)
}   
export const getMenuType = async (shopId, token) => {
    if (shopId !== undefined) {
        return await httpGet(`/menutype/${shopId}`, { headers: { 'apikey': token } }).then(res => res.data)
    }
}