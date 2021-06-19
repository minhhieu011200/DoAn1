import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router';
import queryString from 'query-string'
import isEmpty from 'validator/lib/isEmpty'

import productAPI from '../API/product';
import commentAPI from '../API/comment';
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import SelectCount from '../Shared/SelectCount';


function Detail_Product(props) {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { id } = useParams()
    const [product, setProduct] = useState({})
    const [comments, setComments] = useState([])
    const [star, setStar] = useState(5)
    const [avgStar, setAVGStar] = useState(0)
    const [comment, setComment] = useState('')
    const [load, setLoad] = useState(true)
    const [error_comment, set_error_comment] = useState(false)
    const [validationMsg, setValidationMsg] = useState('');
    const [count, setCount] = useState(1)

    const [show, setShow] = useState(false);

    useEffect(() => {
        let timer1 = setTimeout(() => setShow(true), 800);
        return () => {
            clearTimeout(timer1);
        };
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await productAPI.detailProduct(id)
            setProduct(response)
        }

        fetchData()
    }, [id])

    useEffect(() => {
        const fetchData = async () => {
            const response = await commentAPI.getAPI(id)
            setAVGStar(response.star)
            setComments(response.comment)
        }

        fetchData()

    }, [load, id])

    const increaseCount = (value) => {
        setCount(count + 1)
    }


    const decreaseCount = (value) => {
        setCount(count - 1)
    }

    const onChangeCount = (value, item) => {
        setCount(Number(value))
    }

    const handleComment = async () => {
        console.log(user)
        if (!user) { // Khi khách hàng chưa đăng nhập
            set_error_comment(true)
            setTimeout(() => {
                set_error_comment(false)
            }, 1500)
        } else {
            const isValid = validateAll();
            if (!isValid) return

            const data = {
                id_user: user._id,
                content: comment,
                star: star
            }
            const reponse = await commentAPI.postComment(id, data);
            setComment("")
            setStar(5)
            setLoad(!load)

        }


    }

    const validateAll = () => {
        let msg = {}
        if (isEmpty(comment)) {
            msg.comment = "Comment không được để trống"
        }

        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleDelete = async (value) => {
        console.log(user)
        const query = '?' + queryString.stringify({ userID: user._id, permission: user.id_permission.permission })
        const reponse = await commentAPI.deleteComment(value._id, query);
        if (reponse.msg === "Thanh Cong") {
            setLoad(!load)
        }
    }


    return (

        <div >
            {
                error_comment &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff', backgroundColor: '#f84545' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Vui Lòng Kiểm Tra Lại Đăng Nhập!</h4>
                    </div>
                </div>
            }
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">Detail</li>
                        </ul>
                    </div>
                </div>
            </div>

            {
                show ?
                    (
                        product._id ? (
                            <div className="content-wraper">
                                <div className="container">
                                    <div className="row single-product-area">
                                        <div className="col-lg-5 col-md-6">
                                            <div className="product-details-left">
                                                <div className="product-details-images slider-navigation-1">
                                                    <div className="lg-image">
                                                        <img src={product.image ? process.env.REACT_APP_API + product.image : ""} alt="product image" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-7 col-md-6">
                                            <div className="product-details-view-content pt-60">
                                                <div className="product-info">
                                                    <h2 className="product_name">{product.name_product}</h2>
                                                    <p>
                                                        <span>{product.id_producer ? product.id_producer.producer : ""}</span>
                                                    </p>
                                                    <div className="rating-box">
                                                        <ul className="rating">
                                                            {avgStar > 0 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                            {avgStar > 1 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                            {avgStar > 2 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                            {avgStar > 3 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                            {avgStar > 4 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                        </ul>
                                                    </div>
                                                    <div className="price-box pt-20">
                                                        {
                                                            product.id_sale && product.id_sale.status ?
                                                                (
                                                                    <div>
                                                                        <del className="new-price">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(product.price_product) + ' VNĐ'}</del>
                                                                        <div className="new-price mt-2" style={{ color: 'black' }}>
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(Number(product.price_product) * (100 - Number(product.id_sale.promotion)) / 100) + ' VNĐ'}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="price-box">
                                                                        <span className="new-price">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(product.price_product) + ' VNĐ'}</span>
                                                                    </div>
                                                                )

                                                        }

                                                    </div>

                                                    <div className="product-desc">
                                                        <p>
                                                            {product.describe}
                                                        </p>
                                                    </div>
                                                    <div className="product-variants">
                                                        <div className="single-add-to-cart">
                                                            <div className="quantity">
                                                                <SelectCount count={count} increaseCount={increaseCount} decreaseCount={decreaseCount} onChangeCount={onChangeCount} />
                                                            </div>
                                                            <div className="cart-quantity">
                                                                {
                                                                    product.number < 1 ?
                                                                        (
                                                                            <button className="sold-out" type="submit">Sold Out</button>
                                                                        ) :
                                                                        (
                                                                            <button onClick={() => addToCart(product, count)} className="add-to-cart" type="submit">Add to cart</button>
                                                                        )
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="product-area pt-35">
                                            <div className="col-lg-12">
                                                <div className="li-product-tab">
                                                    <ul className="nav li-product-menu">
                                                        <li style={{ color: '#242424', fontSize: '20px', fontWeight: 'bolder' }}>Reviews</li>
                                                    </ul>
                                                </div>

                                                <div className="product-details-comment-block">
                                                    <div style={{ overflow: 'auto', maxHeight: '15rem', width: '50rem' }}>
                                                        {
                                                            comments.length > 0 ?
                                                                (
                                                                    comments.map((value, key) => (
                                                                        <div className="comment-author-infos pt-15">
                                                                            <div className="d-flex justify-content-between comment-header">
                                                                                <span>{value.id_user.username}</span>
                                                                                {
                                                                                    user && (user._id === value.id_user._id || user.id_permission.permission === "Nhân Viên") &&
                                                                                    <div className="dropdown mr-3">
                                                                                        <p className="dropdown-toggle" data-toggle="dropdown"></p>
                                                                                        <ul className="dropdown-menu comment-menu">
                                                                                            <li onClick={() => handleDelete(value)}><p>Xóa</p></li>
                                                                                        </ul>
                                                                                    </div>
                                                                                }

                                                                            </div>
                                                                            <div>{value.content}</div>
                                                                            <ul className="rating">
                                                                                <li><i className={value.star > 0 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                                                <li><i className={value.star > 1 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                                                <li><i className={value.star > 2 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                                                <li><i className={value.star > 3 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                                                <li><i className={value.star > 4 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                                            </ul>
                                                                            <p>{new Intl.DateTimeFormat("it-IT", {
                                                                                year: "numeric",
                                                                                month: "numeric",
                                                                                day: "numeric",
                                                                                hour: "numeric",
                                                                                minute: "numeric",
                                                                                second: "numeric"
                                                                            }).format(new Date(value.createDate))}</p>
                                                                        </div>
                                                                    ))
                                                                ) :
                                                                (
                                                                    <h3>Chưa có đánh giá nào</h3>
                                                                )
                                                        }
                                                    </div>
                                                    <div className="cart-quantity">
                                                        <button type="button" className="add-to-cart mb-3" data-toggle="modal" data-target="#exampleModal">Write Your Review!</button>
                                                        <div id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" className="modal fade modal-wrapper">
                                                            <div className="modal-dialog modal-dialog-centered" role="document">
                                                                <div className="modal-content">
                                                                    <div className="modal-body">
                                                                        <h3 className="review-page-title">Write Your Review</h3>
                                                                        <div className="modal-inner-area row">
                                                                            <div className="col-lg-6">
                                                                                <div className="li-review-product">
                                                                                    <img src={product.image} alt="Li's Product" style={{ width: '20rem' }} />
                                                                                    <div className="li-review-product-desc">
                                                                                        <p className="li-product-name product_name">{product.name_product}</p>
                                                                                        <p>
                                                                                            <span>{product.describe}</span>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-6">
                                                                                <div className="li-review-content">
                                                                                    <div className="feedback-area">
                                                                                        <div className="feedback">
                                                                                            <h3 className="feedback-title">Our Feedback</h3>

                                                                                            <p className="your-opinion">
                                                                                                <label>Your Rating</label>
                                                                                                <span>
                                                                                                    <select className="star-rating" value={star} onChange={(e) => setStar(e.target.value)}>
                                                                                                        <option value="1">1</option>
                                                                                                        <option value="2">2</option>
                                                                                                        <option value="3">3</option>
                                                                                                        <option value="4">4</option>
                                                                                                        <option value="5" >5</option>
                                                                                                    </select>
                                                                                                </span>
                                                                                            </p>
                                                                                            <p className="feedback-form">
                                                                                                <label htmlFor="feedback">Your Review</label>
                                                                                                <p className="form-text text-danger">{validationMsg.comment}</p>
                                                                                                <textarea id="feedback" name="comment" cols="45" rows="8" aria-required="true" onChange={(e) => setComment(e.target.value)}></textarea>

                                                                                            </p>
                                                                                            <div className="feedback-input">
                                                                                                <div className="feedback-btn pb-15">
                                                                                                    <a style={{ cursor: 'pointer' }} className="close" data-dismiss="modal">Close</a>
                                                                                                    <a style={{ cursor: 'pointer' }} data-dismiss="modal" onClick={handleComment}>Submit</a>
                                                                                                </div>
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <h3 className="text-center mt-3">Sản phẩm không tồn tại</h3>
                        )

                    ) : (<div></div>)
            }



        </div >

    );
}

export default Detail_Product;