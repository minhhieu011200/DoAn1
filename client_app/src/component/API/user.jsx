import axiosClient from "./axiosClient"

const userAPI = {
    login: (data) => {
        const url = `/admin/user/login`
        return axiosClient.post(url, data)
    },
    create: (query) => {
        const url = `/admin/user/create${query}`
        return axiosClient.post(url)
    }

}

export default userAPI