import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext'
import { Link } from 'react-router-dom'
import SelectCount from '../Shared/SelectCount';

function Cart(props) {
    const { cartItem, sumCount, sumPrice, onChangeCount, increaseCount, decreaseCount, deleteCart } = useContext(CartContext);
    return (
        <div>
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
                                                    <td className="li-product-thumbnail"><img src={value.image} style={{ width: '5rem' }} alt="Li's Product Image" /></td>
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
                                                <Link to="/checkout" style={{ color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Proceed to checkout</Link>
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