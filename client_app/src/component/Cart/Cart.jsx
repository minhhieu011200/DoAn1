import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import SelectCount from '../Shared/SelectCount';
import { AuthContext } from '../context/AuthContext'

function Cart(props) {
    const { cartItem, sumCount, sumPrice, onChangeCount, increaseCount, decreaseCount, deleteCart, checkCart, check, setCheck } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [show_error, set_show_error] = useState(false)

    const handler_checkout = async () => {
        if (user) {
            await checkCart(cartItem);
        } else {
            set_show_error(true)
        }

        setTimeout(() => {
            set_show_error(false)
        }, 1500)

    }

    return (
        <div>
            {
                check === "Có sự thay đổi trong giỏ hàng. Vui lòng kiểm tra lại!" &&
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
                show_error &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff', backgroundColor: '#f84545' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Vui Lòng Kiểm Tra Tình Trạng Đăng Nhập!</h4>
                    </div>
                </div>
            }
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">Shopping Cart</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="Shopping-cart-area pt-60 pb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="table-content table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="li-product-remove">remove</th>
                                            <th className="li-product-thumbnail">images</th>
                                            <th className="cart-product-name">Product</th>
                                            <th className="li-product-price">Price</th>
                                            <th className="li-product-quantity">Quantity</th>
                                            <th className="li-product-subtotal">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            cartItem.length > 0 && cartItem.map((value, index) => (
                                                <tr key={index}>
                                                    <td className="li-product-remove">
                                                        <i className="fa fa-times" onClick={() => deleteCart(value)} style={{ cursor: 'pointer' }}></i>
                                                    </td>
                                                    <td className="li-product-thumbnail"><img src={process.env.REACT_APP_API + value.image} style={{ width: '5rem' }} alt="Li's Product Image" /></td>
                                                    <td className="li-product-name"><Link to={`/detail/${value.id_product}`} className="product_name">{value.name_product}</Link></td>
                                                    <td className="li-product-price"><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(value.price_product) + ' VNĐ'}</span></td>
                                                    <td className="quantity">
                                                        <SelectCount count={value.count} onChangeCount={onChangeCount} increaseCount={increaseCount} decreaseCount={decreaseCount} item={value} />
                                                    </td>
                                                    <td className="product-subtotal"><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(Number(value.price_product) * Number(value.count)) + ' VNĐ'}</span></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>

                            {
                                cartItem.length > 0 ? (
                                    <div className="row">
                                        <div className="col-md-5 ml-auto">
                                            <div className="cart-page-total">
                                                <h2>Cart totals</h2>
                                                <ul>
                                                    <li>Subtotal <span>{sumCount}</span></li>
                                                    <li>Total <span>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(sumPrice) + 'VNĐ'}</span></li>
                                                </ul>
                                                {
                                                    !show_error && check === "Thanh Cong" && <Redirect to="/checkout" />
                                                }
                                                <a style={{ color: '#fff', cursor: 'pointer', fontWeight: '600' }} onClick={handler_checkout}>Checkout</a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <h3 className="text-center mt-3">Không có sản phẩm nào</h3>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;