import axiosClient from "./axiosClient"

const couponAPI = {

    getAPI: (query) => {
        const url = `/admin/coupon${query}`
        return axiosClient.get(url)
    },
    details: (id) => {
        const url = `/admin/coupon/${id}`
        return axiosClient.get(url)
    },
    checkCoupon: (data) => {
        const url = `/admin/coupon/check`
        return axiosClient.post(url, data)
    }

}

export default couponAPI