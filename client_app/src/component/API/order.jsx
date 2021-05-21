import axiosClient from './axiosClient'

const orderAPI = {

    post_order: (data) => {
        const url = `/Payment/order`
        return axiosClient.post(url, data)
    },

    get_order: (id) => {
        const url = `/Payment/order/${id}`
        return axiosClient.get(url)
    },

    get_detail: (id) => {
        const url = `/Payment/order/detail/${id}`
        return axiosClient.get(url)
    },

    post_email: (data) => {
        const url = `/Payment/email`
        return axiosClient.post(url, data)
    }

}

export default orderAPI