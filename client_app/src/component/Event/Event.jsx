import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

import './Event.css'

import couponAPI from '../API/coupon';
import Pagination from '../Shared/Pagination'

function Event(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '6',
        status: true
    })

    const [coupons, setCoupons] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [show, setShow] = useState(false);

    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const response = await couponAPI.getAPI(query)
            console.log(response)
            setCoupons(response.coupons)
            setTotalPage(response.totalPage)
        }
        fetchAllData()
    }, [filter])

    useEffect(() => {
        let timer1 = setTimeout(() => setShow(true), 900);
        return () => {
            clearTimeout(timer1);
        };
    }, [])


    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }
    return (
        <div >
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
                    <div className="container" style={{ marginTop: '1rem' }}>
                        <div className="row d-flex justify-content-center justify-content-lg-round justify-content-xl-start">
                            {
                                coupons && coupons.map(value => (
                                    <div className="col-sm-12 col-lg-4 col-xl-4 animate__animated animate__zoomIn bg_event mt-50" style={{ maxWidth: '350px', marginLeft: '30px' }}>
                                        <div>
                                            <div>
                                                <img style={{ width: '100%' }} src="http://file.hstatic.net/1000383950/file/qua-tang-khuyen-mai_6e85a42a6d1c431fafeaa478a79b4052.jpg" alt="" />
                                            </div>
                                            <div style={{ padding: '1rem 1.2rem' }}>
                                                <h4 >{value.describe}</h4>
                                                <div style={{ marginTop: '.5rem' }}>
                                                    <p className="text-dark" style={{ fontSize: '15px' }}>Mã khuyễn mãi: <span style={{ fontWeight: 'bolder' }}>{value.code}</span></p>
                                                </div>
                                                <div style={{ marginTop: '.5rem' }}>
                                                    <p className="text-dark" style={{ fontSize: '15px' }}>Ngày hết hạn: <span style={{ fontWeight: 'bolder' }}>
                                                        {value.endDate && new Intl.DateTimeFormat("it-IT", {
                                                            year: "numeric",
                                                            month: "numeric",
                                                            day: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                            second: "numeric"
                                                        }).format(new Date(value.endDate))}</span></p>
                                                </div>

                                                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                                    <span className="text-dark" style={{ fontSize: '1rem' }}>Còn lại: <i style={{ color: '#0e8170', fontWeight: 'bolder' }}>{value.number} lần</i></span>
                                                </div>
                                                <hr />
                                                <div style={{ marginTop: '.5rem' }}>
                                                    <span style={{ fontSize: '1rem', color: 'black' }}>
                                                        Cơ hội nhận nhiều ưu đãi khi mua sản phẩm tại shop của chúng tôi
                                                    </span>
                                                </div>

                                                <div style={{ marginTop: '1rem' }} className="d-flex justify-content-center">
                                                    <Link to={`/event/${value._id}`} className="btn btn-coupon">Xem Ngay</Link>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                ))
                            }

                        </div>
                        <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />



                    </div>

                )
            }

        </div >
    );
}

export default Event;