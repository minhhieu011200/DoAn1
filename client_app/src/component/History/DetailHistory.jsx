import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';
import { Link, useParams } from 'react-router-dom';
import './History.css'
import OrderAPI from '../API/order';
import { CartContext } from '../context/CartContext'
import Detail_OrderAPI from '../API/detailOrder';
import queryString from 'query-string'


function DetailHistory(props) {
    const { id } = useParams()
    const { resetCart } = useContext(CartContext);

    const [order, set_order] = useState({})

    const [detail_order, set_detail_order] = useState([])
    const [status, setStatus] = useState(true)

    useEffect(() => {

        const fetchData = async () => {

            const response = await OrderAPI.get_detail(id)

            set_order(response)

            const response_detail_order = await Detail_OrderAPI.get_detail_order(id)

            set_detail_order(response_detail_order)

        }

        fetchData()

    }, [id, status])

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
                    const res = await OrderAPI.refund(query)
                    if (res === "Thanh Cong") {
                        setStatus(!status)
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
        <div>
            <div className="container" style={{ paddingTop: '3rem' }}>
                <h1>Thông Tin Chi Tiết Đơn Hàng</h1>
                <ul>
                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>ID: <span style={{ fontWeight: 'lighter', color: 'black' }}>{order._id}</span></li>
                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Ngày đặt: <span style={{ fontWeight: 'lighter', color: 'black' }}>
                        {order.createDate && new Intl.DateTimeFormat("it-IT", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric"
                        }).format(new Date(order.createDate))}</span>
                    </li>

                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>SĐT: <span style={{ fontWeight: 'lighter', color: 'black' }}>{order.id_note && order.id_note.phone}</span></li>
                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Địa chỉ: <span style={{ fontWeight: 'lighter', color: 'black' }}>{order.address}</span></li>
                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Tên: <span style={{ fontWeight: 'lighter', color: 'black' }}>{order.id_note && order.id_note.fullname}</span></li>
                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Tổng tiền: <span style={{ fontWeight: 'lighter', color: 'black' }}>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(order.total) + ' VNĐ'}</span></li>
                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Feeship: <span style={{ fontWeight: 'lighter', color: 'black' }}>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(order.feeship) + ' VNĐ'}</span></li>
                    {
                        order.discount && (
                            <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Discount: <span style={{ fontWeight: 'lighter', color: 'black' }}>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(order.discount) + ' VNĐ'}</span></li>
                        )}

                    {
                        order.id_coupon && (
                            <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Mã giảm giá: <span style={{ fontWeight: 'lighter', color: 'black' }}>{order.id_coupon.code}</span></li>
                        )
                    }

                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Phương thức thanh toán: <span style={{ fontWeight: 'lighter', color: 'black' }}>{order.id_payment && order.id_payment.pay_name}</span></li>
                    <li style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Tình trạng thanh toán: <span style={{ fontWeight: 'lighter', color: 'black' }}>{order.pay ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></li>

                    <div className="d-flex">
                        <li>
                            <button className="btn btn-primary mt-3" onClick={() => resetCart(detail_order)}>Đặt lại</button>
                            {
                                order.status === "5" && order.id_momo && !order.id_momo.refund && (
                                    <button className="btn btn-success mt-3" onClick={handleRefund}>Hoàn tiền lại</button>
                                )
                            }
                        </li>
                    </div>


                </ul>
                <div className="group_box_status" style={{ marginTop: '3rem' }}>
                    <div className="d-flex justify-content-center">
                        <div className="group_status_delivery d-flex justify-content-around">
                            <div className="detail_status_delivery">
                                <div className="w-100 d-flex justify-content-center">
                                    <div className={order.status > 0 && order.status < 5 ? 'bg_status_delivery_active' : 'bg_status_delivery'}></div>
                                </div>
                                <a className="a_status_delivery">Đang xử lý</a>
                            </div>

                            <div className="detail_status_delivery">
                                <div className="w-100 d-flex justify-content-center">
                                    <div className={order.status > 1 && order.status < 5 ? 'bg_status_delivery_active' : 'bg_status_delivery'}></div>
                                </div>
                                <a className="a_status_delivery">Đã xác nhận</a>
                            </div>

                            <div className="detail_status_delivery">
                                <div className="w-100 d-flex justify-content-center">
                                    <div className={order.status > 2 && order.status < 5 ? 'bg_status_delivery_active' : 'bg_status_delivery'}></div>
                                </div>
                                <a className="a_status_delivery">Đang giao</a>
                            </div>

                            <div className="detail_status_delivery">
                                <div className="w-100 d-flex justify-content-center">
                                    <div className={order.status > 3 && order.status < 5 ? 'bg_status_delivery_active' : 'bg_status_delivery'}></div>
                                </div>
                                <a className="a_status_delivery">Hoàn tất</a>
                            </div>
                        </div>
                    </div>
                    <div className="test_status d-flex justify-content-center">
                        <div className="hr_status_delivery"></div>
                    </div>
                </div>
            </div>

            <div className="Shopping-cart-area pt-60 pb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <form action="#">
                                <div className="table-content table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="li-product-remove">Image</th>
                                                <th className="li-product-thumbnail">Name Product</th>
                                                <th className="cart-product-name">Price</th>
                                                <th className="li-product-price">Count</th>
                                                <th className="li-product-price">Total money</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                detail_order && detail_order.map(value => (
                                                    <tr key={value._id}>
                                                        <td className="li-product-thumbnail"><img src={process.env.REACT_APP_API + value.id_product.image} style={{ width: '5rem' }} alt="Li's Product Image" /></td>
                                                        <td className="li-product-name"><Link to={"/detail/" + value.id_product._id}>{value.name_product}</Link></td>
                                                        <td className="li-product-price"><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(value.price_product) + ' VNĐ'}</span></td>
                                                        <td className="li-product-price"><span className="amount">{value.count}</span></td>
                                                        <td className="li-product-price"><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(Number(value.price_product) * value.count) + ' VNĐ'}</span></td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailHistory;