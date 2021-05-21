import axiosClient from "./axiosClient"

const producerAPI = {

    getAPI: () => {
        const url = '/producer'
        return axiosClient.get(url)
    },

    detailProduct: (id, query) => {
        const url = `/admin/producer/detail/${id}${query}`
        return axiosClient.get(url)
    }


}

export default producerAPI