import axiosClient from "./axiosClient"

const couponAPI = {

    getAPI: (query) => {
        const url = `/admin/coupon${query}`
        return axiosClient.get(url)
    },
    getCreate: () => {
        const url = `/admin/coupon/create`
        return axiosClient.get(url)
    },
    postCreate: (data) => {
        const url = `/admin/coupon/create`
        return axiosClient.post(url, data)
    },
    details: (id) => {
        const url = `/admin/coupon/${id}`
        return axiosClient.get(url)
    },
    update: (query) => {
        const url = `/admin/coupon/update${query}`
        return axiosClient.patch(url)
    },
    delete: (query) => {
        const url = `/admin/coupon/delete/${query}`
        return axiosClient.delete(url)
    }

}

export default couponAPI