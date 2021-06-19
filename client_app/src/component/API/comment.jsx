import axiosClient from "./axiosClient"

const productAPI = {

    getAPI: (id) => {
        const url = `/comment/${id}`
        return axiosClient.get(url)
    },
    postComment: (id, data) => {
        const url = `/comment/${id}`
        return axiosClient.post(url, data)
    },
    deleteComment: (id, query) => {
        const url = `/comment/${id}${query}`
        return axiosClient.delete(url)
    }

}

export default productAPI