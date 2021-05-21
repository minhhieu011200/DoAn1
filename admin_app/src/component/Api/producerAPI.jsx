import axiosClient from "./axiosClient"

const producerAPI = {

    getAPI: () => {
        const url = '/producer'
        return axiosClient.get(url)
    },
    getAPIPage: (query) => {
        const url = `/admin/producer${query}`
        return axiosClient.get(url)
    },
    details: (id) => {
        const url = `/admin/producer/${id}`
        return axiosClient.get(url)
    },
    detailProduct: (id, query) => {
        const url = `/admin/producer/detail/${id}${query}`
        return axiosClient.get(url)
    },
    create: (query) => {
        const url = `/admin/producer/create${query}`
        return axiosClient.post(url)
    },
    update: (query) => {
        const url = `/admin/producer/update${query}`
        return axiosClient.put(url)
    },
    delete: (query) => {
        const url = `/admin/producer/delete${query}`
        return axiosClient.delete(url)
    }

}

export default producerAPI