import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import { Base64 } from 'js-base64';
import isEmpty from 'validator/lib/isEmpty'
import { useForm } from "react-hook-form";

import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

import orderAPI from '../API/order';
import couponAPI from '../API/coupon';
import MoMo from './MoMo'
import Map from './Map'


function Checkout(props) {
    const { cartItem, sumPrice, checkOut, redirect, check, setSumCount, setCheck } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [address, setAddress] = useState('')
    const [fullname, setFullname] = useState('')
    const [phone, setPhone] = useState('')
    const [price, setPrice] = useState()
    const [coupon, setCoupon] = useState(0)
    const [code, setCode] = useState('')
    const [show_error, set_show_error] = useState(false)
    const [flag, setFlag] = useState(false)
    const [extraData, setExtraData] = useState()
    const [total, setTotal] = useState()
    const [errorCode, setErrorCode] = useState('')
    const [discount, setDiscount] = useState(0)
    const [loadMap, setLoadMap] = useState(true)

    useEffect(async () => {
        setTotal(sumPrice + Number(price) - (((sumPrice * Number(coupon)) / 100)))
        setDiscount((sumPrice * Number(coupon)) / 100)

    }, [sumPrice, price, coupon])

    useEffect(() => {
        if (cartItem.length < 1 || !user) {
            props.history.push('/cart')
        }
    }, [])


    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();

    const validateAll = () => {
        let msg = {}
        if (isEmpty(fullname)) {
            msg.fullname = "Tên không được để trống"
        }
        if (isEmpty(phone)) {
            msg.phone = "Số điện thoại không được để trống"
        }
        if (isEmpty(address)) {
            msg.address = "Địa chỉ không được để trống"
        }
        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const checkCoupon = async () => {
        if (isEmpty(code)) {
            setCoupon(0)
            return
        }
        const body = {
            rank: user.id_rank._id,
            id_user: user,
            code: code
        }

        const response = await couponAPI.checkCoupon(body)

        if (response.msg !== "Thành công") {
            setErrorCode(response.msg)
            setCoupon(0)
        } else {
            setErrorCode("")
            setCoupon(response.coupon.promotion)
        }
    }

    const handleCheckout = async () => {
        if (cartItem.length < 1 || !user) {
            return props.history.push('/cart')
        }
        const isValid = validateAll();
        if (!isValid) return
        if (!flag) {
            setFlag(true)
            if (discount > 0) {
                const body = {
                    rank: user.id_rank._id,
                    id_user: user._id,
                    code: code,
                    payment: "6086709cdc52ab1ae999e882"
                }
                const response = await couponAPI.checkCoupon(body)

                if (response.msg !== "Thành công") {
                    setErrorCode(response.msg)
                    setCoupon(0)
                    setTimeout(() => {
                        setFlag(false)
                    }, 2000)
                    return
                }
            }

            checkOut(fullname, phone, user._id, address, total, "1", false, '6086709cdc52ab1ae999e882', price, code, discount)

            setTimeout(() => {
                setFlag(false)
            }, 2000)
        }
    }

    const handleMoMo = async () => {
        if (cartItem.length < 1 || !user) {
            return props.history.push('/cart')
        }
        const isValid = validateAll();
        if (!isValid) return

        if (!flag) {
            setFlag(true)
            if (discount > 0) {
                const body = {
                    id_user: user._id,
                    rank: user.id_rank._id,
                    code: code,
                    payment: "60afcfcedc48d73138aceaf6"
                }
                const response = await couponAPI.checkCoupon(body)
                if (response.msg !== "Thành công") {
                    setErrorCode(response.msg)
                    setCoupon(0)
                    setTimeout(() => {
                        setFlag(false)
                    }, 2000)
                    return
                }
            }

            const response = await orderAPI.checkCart({ cartItem: cartItem })
            if (response.msg !== "Thanh Cong") {
                setCheck(response.msg)
                localStorage.setItem('carts', JSON.stringify(response.cart))
                setTimeout(() => {
                    setSumCount(0)
                    setCheck("")
                }, 2000)
            } else {
                const data = {
                    fullname: fullname,
                    phone: phone,
                    id_user: user._id,
                    address: address,
                    total: total,
                    id_payment: '60afcfcedc48d73138aceaf6',
                    feeship: price,
                    cartItem: cartItem,
                    code: code,
                    discount: discount === 0 ? undefined : discount
                }

                const base = Base64.encode(JSON.stringify(data));
                setExtraData(base)
                console.log(base)

                set_show_error(true)
                setTimeout(() => {
                    set_show_error(false)
                }, 2000)
            }
            setTimeout(() => {
                setFlag(false)
            }, 2000)
        }
    }

    const handleCheckDistance = (address, price) => {
        setAddress(address)
        setPrice(price)
        setLoadMap(false)
    }



    return (


        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            {
                check !== "" && check !== "Thanh Cong" &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff', backgroundColor: '#f84545' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>{check}</h4>
                    </div>
                </div>
            }

            {
                !loadMap ? (
                    <div className="row">
                        <div className="col-lg-6 col-12 pb-5">
                            <form onSubmit={handleSubmit(handleCheckout)}>
                                <div className="checkbox-form">
                                    <h3>Billing Details</h3>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label htmlFor="fullname">Full Name </label>
                                                <input placeholder="Enter Fullname" type="text" name="fullname" id="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                                                <p className="form-text text-danger">{validationMsg.fullname}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label htmlFor="phone">Phone Number </label>
                                                <input placeholder="Enter Phone Number" type="text" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                                <p className="form-text text-danger">{validationMsg.phone}</p>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label htmlFor="address">Address:</label>
                                                <div className="d-flex">
                                                    <input type="text" className="form-control" id="address" name="address" value={address} disabled />
                                                    <button type="button" onClick={() => setLoadMap(true)} className="register-button" style={{ cursor: 'pointer', padding: '0px', margin: '0px', height: '43px' }}>Change</button>
                                                </div>

                                                <p className="form-text text-danger">{validationMsg.address}</p>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label htmlFor="code">Coupon</label>
                                                <div className="d-flex">
                                                    <input placeholder="Enter Coupon" type="text" name="code" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
                                                    <button type="button" onClick={checkCoupon} className="register-button" style={{ cursor: 'pointer', padding: '0px', margin: '0px', height: '43px' }}>Check</button>
                                                </div>

                                                <p className="form-text text-danger">{errorCode}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="order-button-payment">
                                                {
                                                    redirect && <Redirect to="/ordersuccess" />
                                                }
                                                <button type="submit" className="btn li-button li-button-fullwidth checkout">Place order</button>
                                            </div>
                                        </div >
                                    </div >
                                </div >
                            </form >
                        </div >
                        <div className="col-lg-6 col-12">
                            <div className="your-order">
                                <h3>Your order</h3>
                                <div className="your-order-table table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="cart-product-name">Product</th>
                                                <th className="cart-product-total">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartItem && cartItem.map(value => (
                                                    <tr className="cart_item" key={value._id}>
                                                        <td className="cart-product-name">{value.name_product}<strong className="product-quantity"> × {value.count}</strong></td>
                                                        <td className="cart-product-total"><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(parseInt(value.price_product) * parseInt(value.count)) + 'VNĐ'}</span></td>
                                                    </tr>
                                                ))
                                            }
                                            {
                                                discount > 0 &&
                                                (
                                                    <tr>
                                                        <th>Discount</th>
                                                        <th><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(discount) + 'VNĐ'}</span></th>
                                                    </tr>
                                                )
                                            }
                                            <tr>
                                                <th>Shipping Cost</th>
                                                <th><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(price) + 'VNĐ'}</span></th>
                                            </tr>
                                        </tbody>
                                        <tfoot>

                                            <tr className="order-total">
                                                <th>Order Total</th>
                                                <td><strong><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(total) + 'VNĐ'}</span></strong></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="payment-method">
                                    <div className="payment-accordion">
                                        <div id="accordion">
                                            <div className="card">

                                                <div className="card-header" id="#payment-3">
                                                    <h5 className="panel-title">
                                                        <a className="collapsed" data-toggle="collapse" data-target="#collapseMoMo" aria-expanded="false" aria-controls="collapseThree">
                                                            MoMo
                                                        </a>
                                                    </h5>
                                                </div>

                                                <div id="collapseMoMo" className="collapse" onClick={handleMoMo}>
                                                    <div className="card-body">
                                                        <img src="https://developers.momo.vn/images/logo.png" width="50" />
                                                        {
                                                            show_error && <MoMo extraData={extraData} total={total} />
                                                        }
                                                    </div>
                                                </div >

                                            </div >
                                        </div >
                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >

                ) : (
                    <Map handleCheckDistance={handleCheckDistance} />
                )
            }



        </div >
    );
}

export default Checkout;