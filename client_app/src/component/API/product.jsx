import axiosClient from "./axiosClient"

const productAPI = {

    getAPI: (query) => {
        const url = `/admin/product${query}`
        return axiosClient.get(url)
    },
    detailProduct: (id) => {
        const url = `/admin/product/${id}`
        return axiosClient.get(url)
    },
    searchProduct: (query) => {
        const url = `/product/search/${query}`
        return axiosClient.get(url)
    },
    getCategory: (query) => {
        const url = `/product/category${query}`
        return axiosClient.get(url)
    }

}

export default productAPI