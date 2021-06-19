import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import queryString from 'query-string'
import axios from 'axios';
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';

import orderAPI from '../Api/orderAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'

function ConfirmDelivery(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '4',
        search: '',
        status: '3',
        change: true
    })

    const [order, setOrder] = useState([])
    const [totalPage, setTotalPage] = useState()

    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const od = await orderAPI.getAPI(query)
            console.log(od)
            setTotalPage(od.totalPage)
            setOrder(od.orders)


        }

        fetchAllData()
    }, [filter])

    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }

    const handlerSearch = (value) => {
        setFilter({
            ...filter,
            page: '1',
            search: value
        })
    }

    const handleConfirm = async (value) => {
        const query = '?' + queryString.stringify({ id: value._id })

        const response = await orderAPI.confirmDelivery(query)

        if (response.msg === "Thanh Cong") {
            setFilter({
                ...filter,
                change: !filter.change
            })
        }
    }

    const handleCancel = async (value) => {
        if (value.id_momo && !value.id_momo.refund && value.status !== "5") {
            const path = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
            const partnerCode = process.env.REACT_APP_PARTNER_CODE
            const accessKey = process.env.REACT_APP_ACCESS_KEY
            const serectkey = process.env.REACT_APP_SECRET_KEY
            const amount = value.total.toString()
            const requestId = uuidv4()
            const transId = value.id_momo.transId
            const orderId = value.id_momo.orderId
            const requestType = "refundMoMoWallet"

            const rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&transId=${transId}&requestType=${requestType}`

            var signature = crypto.createHmac('sha256', serectkey)
                .update(rawSignature)
                .digest('hex');

            var body = JSON.stringify({
                partnerCode: partnerCode,
                accessKey: accessKey,
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                transId: transId,
                requestType: requestType,
                signature: signature

            })
            axios.post(path, body)
                .then(response => {
                    if (response.data.errorCode == 0) {
                        cancelAPI(value, value.id_momo._id)
                    }
                    else {
                        cancelAPI(value, "")
                    }
                })
                .catch(error => {
                    cancelAPI(value, "")
                })
        } else {
            cancelAPI(value, "")
        }
    }

    const cancelAPI = async (value, id) => {
        const query = '?' + queryString.stringify({ id: value._id, id_momo: id })

        const response = await orderAPI.cancelOrder(query)
        if (response.msg === "Thanh Cong") {
            setFilter({
                ...filter,
                change: !filter.change
            })
        }
    }
    return (
        <div className="page-wrapper">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Confirm Delivery</h4>
                                <Search handlerSearch={handlerSearch} />

                                <div className="table-responsive mt-3">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>Action</th>
                                                <th>ID</th>
                                                <th>CreateDate</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Status</th>
                                                <th>Total Money</th>
                                                <th>Payment</th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                order && order.map((value, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"/order/detail/" + value._id} className="btn btn-info mr-1">Detail</Link>

                                                                <button type="button" style={{ cursor: 'pointer', color: 'white' }} onClick={() => handleConfirm(value)} className="btn btn-success mr-1" >Hoàn tất</button>

                                                                <button type="button" style={{ cursor: 'pointer', color: 'white' }} onClick={() => handleCancel(value)} className="btn btn-danger" >Hủy bỏ</button>
                                                            </div>
                                                        </td>
                                                        <td className="name">{value._id}</td>
                                                        <td className="li-product-price">
                                                            <span className="amount">
                                                                {new Intl.DateTimeFormat("it-IT", {
                                                                    year: "numeric",
                                                                    month: "numeric",
                                                                    day: "numeric",
                                                                    hour: "numeric",
                                                                    minute: "numeric",
                                                                    second: "numeric"
                                                                }).format(new Date(value.createDate))}
                                                            </span>
                                                        </td>
                                                        <td className="name">{value.id_note.fullname}</td>
                                                        <td className="name">{value.id_user ? value.id_user.email : ""}</td>
                                                        <td className="name">{value.id_note.phone}</td>
                                                        <td className="name">{value.address}</td>
                                                        <td>
                                                            {(() => {
                                                                switch (value.status) {
                                                                    case "1": return "Đang xử lý";
                                                                    case "2": return "Đã xác nhận";
                                                                    case "3": return "Đang giao";
                                                                    case "4": return "Hoàn thành";
                                                                    default: return "Đơn bị hủy";
                                                                }
                                                            })()}
                                                        </td>
                                                        <td>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(value.total) + ' VNĐ'}</td>
                                                        <td className="name">{value.pay === true ? "Đã thanh toán" : "Chưa thanh toán"}</td>

                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by Minh Hiếu.
            </footer>
        </div>
    );
}

export default ConfirmDelivery;