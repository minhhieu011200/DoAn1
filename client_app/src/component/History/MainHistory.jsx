import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import OrderAPI from '../API/order';
import { AuthContext } from '../context/AuthContext'
import axios from 'axios';
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import queryString from 'query-string'


function MainHistory(props) {
    const { user } = useContext(AuthContext);
    const [history, set_history] = useState([])
    const [page, set_page] = useState(1)
    const [show_load, set_show_load] = useState(true)
    const [status, setStatus] = useState(false)

    if (!user) {
        props.history.push('/login')
    }


    useEffect(() => {
        const fetchData = async () => {
            const params = {
                page: page,
                count: '5'
            }

            const query = '?' + queryString.stringify(params)
            const response = await OrderAPI.get_order(user._id, query)
            if (response.length < 1) {
                set_show_load(false)
            }
            set_history(prev => [...prev, ...response])

        }

        setTimeout(() => {
            fetchData()
        }, 200)
    }, [page, status])

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

        const response = await OrderAPI.cancelOrder(query)
        if (response.msg === "Thanh Cong") {
            const index = history.indexOf(value);
            history[index].status = "5"
            set_history(history)
            setStatus(!status)
        }
    }

    return (
        <div>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">History</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="Shopping-cart-area pt-60 pb-60" >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="table-content table-responsive">
                                <InfiniteScroll
                                    className="m-3"
                                    style={{ overflow: 'none' }}
                                    dataLength={history.length}
                                    next={() => set_page(page + 1)}
                                    hasMore={true}
                                    loader={show_load && (
                                        <div className="text-center mt-2">
                                            <div class="spinner-grow ml-1"></div>
                                            <div class="spinner-grow ml-1"></div>
                                            <div class="spinner-grow ml-1"></div>
                                        </div>

                                    )}

                                >
                                    <table className="table">

                                        <thead>
                                            <tr>
                                                <th className="li-product-remove">Action</th>
                                                <th className="li-product-remove">Ngày đặt</th>
                                                <th className="cart-product-name">SĐT</th>
                                                <th className="li-product-price">Địa chỉ</th>
                                                <th className="li-product-quantity">Tổng tiền</th>
                                                <th className="li-product-subtotal">Thanh toán</th>
                                                <th className="li-product-subtotal">Tình trạng thanh toán</th>
                                                <th className="li-product-subtotal">Tình trạng</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {
                                                history && history.map(value => (
                                                    <tr key={value._id}>
                                                        <td className="li-product-price">
                                                            <div className="d-flex">
                                                                <Link to={`/order/${value._id}`} className="btn btn-info mr-1">View</Link>
                                                                {
                                                                    value.status < 4 ?
                                                                        (
                                                                            <button type="button" style={{ cursor: 'pointer', color: 'white' }} onClick={() => handleCancel(value)} className="btn btn-danger" >Hủy</button>
                                                                        ) :
                                                                        ("")
                                                                }

                                                            </div>
                                                        </td>

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
                                                            </span></td>

                                                        <td className="li-product-price"><span className="amount">{value.id_note.phone}</span></td>
                                                        <td className="li-product-price"><p className="amount address">{value.address}</p></td>
                                                        <td className="li-product-price"><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(value.total) + ' VNĐ'}</span></td>
                                                        <td className="li-product-price"><span className="amount">{value.id_payment.pay_name}</span></td>
                                                        <td className="li-product-price"><span className="amount" style={value.pay ? { color: 'green' } : { color: 'red' }}>{value.pay ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></td>
                                                        <td className="li-product-price"><span className="amount">
                                                            {
                                                                value.status == '1' ? 'Đang xử lý' :
                                                                    (value.status == '2' ? 'Đã xác nhận' :
                                                                        (value.status == '3' ? 'Đang giao' :
                                                                            (value.status == '4' ? 'Hoàn tất' : 'Đơn bị hủy')))}
                                                        </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>

                                    </table>
                                    {
                                        !show_load && history.length < 1 && (
                                            <h3 className="text-center mt-3">Không có đơn hàng nào</h3>
                                        )
                                    }
                                </InfiniteScroll>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainHistory;