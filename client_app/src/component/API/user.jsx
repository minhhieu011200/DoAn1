import axiosClient from "./axiosClient"

const userAPI = {
    login: (data) => {
        const url = `/admin/user/login`
        return axiosClient.post(url, data)
    },
    create: (query) => {
        const url = `/admin/user/create${query}`
        return axiosClient.post(url)
    },
    update: (query) => {
        const url = `/admin/user/update${query}`
        return axiosClient.patch(url)
    },
    changePassword: (query) => {
        const url = `/admin/user/changePassword${query}`
        return axiosClient.patch(url)
    },
    sendOTP: (query) => {
        const url = `/admin/user/sendOTP${query}`
        return axiosClient.post(url)
    },
    checkOTP: (query) => {
        const url = `/admin/user/checkOTP${query}`
        return axiosClient.post(url)
    },
    checkLogin: (data) => {
        const url = `/admin/user/checkLogin`
        return axiosClient.post(url, data)
    }

}

export default userAPI