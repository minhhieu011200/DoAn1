import axiosClient from './axiosClient'

const noteAPI = {

    post_note: (data) => {
        const url = `/Note`
        return axiosClient.post(url, data)
    },

    get_note: (id) => {
        const url = `/Note/${id}`
        return axiosClient.post(url)
    }

}

export default noteAPI