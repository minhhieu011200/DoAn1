import axiosClient from './axiosClient'

const detailOrderAPI = {

    post_detail_order: (data) => {
        const url = `/DetailOrder`
        return axiosClient.post(url, data)
    },

    get_detail_order: (id) => {
        const url = `/DetailOrder/${id}`
        return axiosClient.get(url)
    }

}

export default detailOrderAPI