import axiosClient from "./axiosClient"

const saleAPI = {

    getAPI: (query) => {
        const url = `/admin/sale${query}`
        return axiosClient.get(url)
    },
    getCreate: (query) => {
        const url = `/admin/sale/create${query}`
        return axiosClient.get(url)
    },
    postCreate: (data) => {
        const url = `/admin/sale/create`
        return axiosClient.post(url, data)
    },
    details: (id) => {
        const url = `/admin/sale/${id}`
        return axiosClient.get(url)
    },
    update: (query, data) => {
        const url = `/admin/sale/update${query}`
        return axiosClient.patch(url, data)
    },
    delete: (query) => {
        const url = `/admin/sale/delete/${query}`
        return axiosClient.delete(url)
    },
    getAll: () => {
        const url = `/admin/sale/all`
        return axiosClient.get(url)
    }

}

export default saleAPI