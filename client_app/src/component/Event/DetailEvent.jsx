import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CouponAPI from '../API/coupon';
import './Event.css'

function DetailEvent(props) {

    const { id } = useParams()

    const [coupon, setCoupon] = useState({})
    const [show, setShow] = useState(false);

    useEffect(() => {
        let timer1 = setTimeout(() => setShow(true), 800);
        return () => {
            clearTimeout(timer1);
        };
    }, [])

    useEffect(() => {

        const fetchData = async () => {

            const resposne = await CouponAPI.details(id)

            setCoupon(resposne)

        }

        fetchData()

    }, [id])

    return (
        <div>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li className="active">Event</li>
                        </ul>
                    </div>
                </div>
            </div>
            {
                show && (
                    coupon._id ? (<div className="container" style={{ marginTop: '3rem' }}>
                        <h1 className="h4_event">{coupon.describe} CÙNG FEAR OF GOD!!!</h1>
                        <div style={{ padding: '1rem 0' }}>
                            <img style={{ width: '100%' }} src="http://file.hstatic.net/1000383950/file/qua-tang-khuyen-mai_6e85a42a6d1c431fafeaa478a79b4052.jpg" alt="" />
                        </div>
                        <div style={{ margin: '1rem 0' }}>
                            <span style={{ fontSize: '1.2rem', color: 'black', fontWeight: 'bold' }}>Cơ hội nhận ngay mã giảm giá đơn hàng của FEAR OF GOD!!!</span>
                            <br />
                            <li style={{ fontSize: '1.05rem' }}>Mã Code: <span style={{ color: '#0e8170', fontWeight: 'bolder' }}>{coupon.code}</span></li>
                            <li style={{ fontSize: '1.05rem' }}>Thời gian hiệu lực:
                                <span style={{ color: '#0e8170', fontWeight: 'bolder' }}>
                                    {coupon.startDate && " " + new Intl.DateTimeFormat("it-IT", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric"
                                    }).format(new Date(coupon.startDate))}
                                    <span>&#10142; </span>
                                    {coupon.endDate && new Intl.DateTimeFormat("it-IT", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric"
                                    }).format(new Date(coupon.endDate))}
                                </span>
                            </li>
                            <li style={{ fontSize: '1.05rem' }}>Điều kiện áp dụng:
                                <span style={{ color: '#0e8170', fontWeight: 'bolder' }}>
                                    {
                                        coupon.id_payment ? (" Thanh toán " + coupon.id_payment.pay_name) : " Tất cả hình thức thanh toán"

                                    },
                                    {
                                        coupon.id_rank ? (" thành viên " + coupon.id_rank.rank) : " tất cả thành viên"
                                    }
                                </span>
                            </li>
                            <li style={{ fontSize: '1.05rem' }}>Còn lại: <span style={{ color: '#0e8170', fontWeight: 'bolder' }}>{coupon.number} lần</span></li>
                            <br />
                            <span style={{ fontSize: '1.05rem' }}>Lưu ý: <i style={{ color: 'red' }}>Mã không bao gồm phí giao hàng. Mỗi mã chỉ được sử dụng 1 lần cho mỗi user</i></span>
                        </div>

                    </div>
                    ) : (<h3 className="text-center mt-3">Khuyến mãi không tồn tại</h3>)
                )
            }

        </div >
    );
}

export default DetailEvent;