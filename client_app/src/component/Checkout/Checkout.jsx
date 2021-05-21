import React, { useContext, useState, useEffect } from 'react';
import io from "socket.io-client";
import { Redirect } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import isEmpty from 'validator/lib/isEmpty'
import { useForm } from "react-hook-form";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
import orderAPI from '../API/order';
import detailOrderAPI from '../API/detailOrder';
import noteAPI from '../API/note';
import Address from './Address'

const socket = io('http://localhost:8000/', {
    transports: ['websocket'], jsonp: false
});
socket.connect();

function Checkout(props) {
    const { cartItem, sumPrice, checkOut } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [address, setAddress] = useState('')
    const [fullname, setFullname] = useState('')
    const [phone, setPhone] = useState('')
    const [price] = useState(15000)
    const [total, setSumTotal] = useState()
    const [redirect, set_redirect] = useState(false)

    useEffect(() => {
        setSumTotal(Number(price) + Number(sumPrice))
    }, [])

    if (cartItem.length < 1 || !user) {
        props.history.push('/cart')
    }
    const handleSelect = async value => {
        // const result = await geocodeByAddress(value);
        // const lating = await getLatLng(result[0])
        setAddress(value)
        // console.log(lating)
        // setCoordinates(lating)
    }

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

    const handleCheckout = async () => {
        const isValid = validateAll();
        if (!isValid) return
        const data_delivery = {
            fullname: fullname,
            phone: phone,
        }

        // Xứ lý API Delivery
        const response_delivery = await noteAPI.post_note(data_delivery)

        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + " " + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()

        // data Order
        const data_order = {
            id_user: user._id,
            address: address,
            total: total,
            status: "1",
            pay: false,
            id_payment: '6086709cdc52ab1ae999e882',
            id_note: response_delivery._id,
            feeship: price,
            createDate: time
        }

        // Xứ lý API Order
        const response_order = await orderAPI.post_order(data_order)


        // Xử lý API Detail_Order
        for (let i = 0; i < cartItem.length; i++) {

            const data_detail_order = {
                id_order: response_order._id,
                id_product: cartItem[i].id_product,
                name_product: cartItem[i].name_product,
                price_product: cartItem[i].price_product,
                count: cartItem[i].count
            }

            await detailOrderAPI.post_detail_order(data_detail_order)

        }

        socket.emit('send_order', "Có người vừa đặt hàng")
        set_redirect(true)
        checkOut();



    }

    return (

        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            {/* {
                <Map />
            } */}
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
                                    {/* <div className="checkout-form-list">
                                        <label>Address <span className="required">*</span></label>
                                        <input placeholder="Street address" type="text" name="address" />
                                    </div> */}
                                    <PlacesAutocomplete placeholder="Enter A Location" value={address} onChange={setAddress} onSelect={handleSelect}>
                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
                                        (
                                            <div className="checkout-form-list">
                                                <label htmlFor="address">To</label>
                                                <input {...getInputProps({ placeholder: "Enter A Location", id: "address", name: "address" })} />
                                                <p className="form-text text-danger">{validationMsg.address}</p>
                                                {/* {loading && <div>Loading...</div>} */}
                                                {suggestions.map((suggestion, index) => {
                                                    return (
                                                        <div key={index} {...getSuggestionItemProps(suggestion)}>
                                                            <input type="text" name="from"
                                                                id="from_places"
                                                                disabled
                                                                value={suggestion.description} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </PlacesAutocomplete>
                                </div>
                                <div className="col-md-12">
                                    <div className="order-button-payment">
                                        {
                                            redirect && <Redirect to="/ordersuccess" />
                                        }
                                        <button type="submit" className="li-button li-button-fullwidth">Place order</button>
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
                                </tbody>
                                <tfoot>
                                    <tr className="cart-subtotal">
                                        <th>Shipping Cost</th>
                                        <td><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(price) + 'VNĐ'}</span></td>
                                    </tr>
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
                                                <a className="collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                    PayPal
                                                </a>
                                            </h5>
                                        </div>
                                        {/* <div id="collapseThree" className="collapse">
                                            <div className="card-body">
                                                {
                                                    show_error ? 'Please Checking Information!' :
                                                        <Paypal
                                                            information={information}
                                                            total={total_price}
                                                            Change_Load_Order={Change_Load_Order}
                                                            from={from}
                                                            distance={distance}
                                                            duration={duration}
                                                            price={price}
                                                        />
                                                }
                                            </div>
                                        </div > */}
                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >

        </div >
    );
}

export default Checkout;