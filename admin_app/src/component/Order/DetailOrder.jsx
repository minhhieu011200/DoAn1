import React, { useState, useEffect } from 'react';

import queryString from 'query-string'
import axios from 'axios';
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';


import orderAPI from '../Api/orderAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'


function DetailOrder(props) {
    const [idDetail] = useState(props.match.params.id)
    const [filter, setFilter] = useState({
        page: '1',
        limit: '4',
        search: '',
        change: true
    })

    const [order, setOrder] = useState()
    const [totalPage, setTotalPage] = useState()
    const [details, setDetails] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            const res = await orderAPI.details(idDetail)
            console.log(res)
            setOrder(res)

        }

        fetchAllData()
    }, [idDetail])

    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const od = await orderAPI.detailOrder(idDetail, query)
            console.log(od)
            setTotalPage(od.totalPage)
            setDetails(od.details)
        }

        fetchAllData()
    }, [filter, idDetail])

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

    const handleRefund = async () => {
        const path = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
        const partnerCode = process.env.REACT_APP_PARTNER_CODE
        const accessKey = process.env.REACT_APP_ACCESS_KEY
        const serectkey = process.env.REACT_APP_SECRET_KEY
        const amount = order.total.toString()
        const requestId = uuidv4()
        const transId = order.id_momo.transId
        const orderId = order.id_momo.orderId
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
            .then(async response => {
                if (response.data.errorCode === 0) {
                    const query = '?' + queryString.stringify({ id_momo: order.id_momo._id })
                    const res = await orderAPI.refund(query)
                    if (res === "Thanh Cong") {
                        setFilter({
                            ...filter,
                            change: !filter.change
                        })
                    }
                }
                else {
                    alert(response.data.localMessage)
                }
            })
            .catch(error => {
                alert(error)
            })
    }

    return (


        <div className="page-wrapper">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 style={{ fontWeight: 'bold' }} className="card-title ml-1">Detail Order</h4>
                                {
                                    order ?
                                        (
                                            <div className="mt-3 ml-1">
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>ID: <span style={{ fontWeight: 'lighter' }}>{order._id}</span></p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>Ngày đặt: <span style={{ fontWeight: 'lighter' }}>
                                                    {order.createDate && new Intl.DateTimeFormat("it-IT", {
                                                        year: "numeric",
                                                        month: "numeric",
                                                        day: "numeric",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        second: "numeric"
                                                    }).format(new Date(order.createDate))}</span>
                                                </p>

                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>SĐT: <span style={{ fontWeight: 'lighter' }}>{order.id_note && order.id_note.phone}</span></p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>Địa chỉ: <span style={{ fontWeight: 'lighter' }}>{order.address}</span></p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>Tên: <span style={{ fontWeight: 'lighter' }}>{order.id_note && order.id_note.fullname}</span></p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>Tổng tiền: <span style={{ fontWeight: 'lighter' }}>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(order.total) + ' VNĐ'}</span></p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>Feeship: <span style={{ fontWeight: 'lighter' }}>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(order.feeship) + ' VNĐ'}</span></p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>Phương thức thanh toán: <span style={{ fontWeight: 'lighter' }}>{order.id_payment && order.id_payment.pay_name}</span></p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bolder', color: 'black' }}>Tình trạng thanh toán: <span style={{ fontWeight: 'lighter' }}>{order.pay ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></p>
                                                {
                                                    order.status === "5" && order.id_momo && !order.id_momo.refund && (

                                                        <button className="btn btn-success mt-3" onClick={handleRefund}>Hoàn tiền lại</button>

                                                    )
                                                }
                                            </div>

                                        ) :
                                        (
                                            <div></div>
                                        )
                                }

                                <div className="table-responsive mt-3">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Count</th>
                                                <th>Total Money</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                details && details.map((value, index) => (
                                                    <tr key={index}>
                                                        <td><img src={process.env.REACT_APP_API + value.id_product.image} alt="" style={{ width: '70px' }} /></td>
                                                        <td className="name">{value.name_product}</td>
                                                        <td className="name">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(value.price_product) + ' VNĐ'}</td>
                                                        <td className="name">{value.count}</td>
                                                        <td className="name">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(value.count * Number(value.price_product)) + ' VNĐ'}</td>
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
        </div >
    );
}

export default DetailOrder;