import axiosClient from './axiosClient'

const orderAPI = {

    post_order: (data) => {
        const url = `/Payment/order`
        return axiosClient.post(url, data)
    },
    get_order: (id, query) => {
        const url = `/Payment/order/${id}${query}`
        return axiosClient.get(url)
    },

    get_detail: (id) => {
        const url = `/Payment/order/detail/${id}`
        return axiosClient.get(url)
    },
    checkCart: (data) => {
        const url = `/Payment/checkcart`
        return axiosClient.post(url, data)
    },
    post_email: (data) => {
        const url = `/Payment/email`
        return axiosClient.post(url, data)
    },
    momo: (data) => {
        const url = `/Payment/momo`
        return axiosClient.post(url, data)
    },
    cancelOrder: (query) => {
        const url = `/admin/order/cancelorder${query}`
        return axiosClient.patch(url)
    },
    refund: (query) => {
        const url = `/admin/order/refund${query}`
        return axiosClient.patch(url)
    }

}

export default orderAPI