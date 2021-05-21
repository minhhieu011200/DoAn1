import React, { useState, useEffect, useContext } from 'react';
import queryString from 'query-string'
import producerAPI from '../API/producer'
import { NavLink } from 'react-router-dom'
import Pagination from '../Shared/Pagination'
import SelectCount from '../Shared/SelectCount';
import { CartContext } from '../context/CartContext'

function Shop(props) {
    const { addToCart } = useContext(CartContext);
    const [menu, setMenu] = useState([])
    const [filter, setFilter] = useState({
        page: '1',
        limit: '6',
        search: '',
        status: true
    })

    const [products, setProducts] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [count, setCount] = useState(1)
    const [avgStar, setAVGStar] = useState(1)

    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const response = await producerAPI.detailProduct(props.match.params.id, query)

            setProducts(response.products)
            setTotalPage(response.totalPage)
        }
        fetchAllData()
    }, [filter, props.match.params.id])

    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }

    useEffect(() => {
        const fetchAllData = async () => {
            const res = await producerAPI.getAPI()
            setMenu(res)
        }

        fetchAllData()
    }, [])

    const increaseCount = (value) => {
        setCount(count + 1)
    }


    const decreaseCount = (value) => {
        setCount(count - 1)
    }

    const onChangeCount = (value, item) => {
        setCount(Number(value))
    }

    return (
        <div>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li className="active">Shop</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="content-wraper pt-60 pb-60 pt-sm-30">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 order-1 order-lg-2">

                            <div className="shop-top-bar">

                                <div className="product-select-box">
                                    <div className="product-short">
                                        <p>Sort By:</p>
                                        <select className="nice-select">
                                            <option value="trending">Relevance</option>
                                            <option value="sales">Name (A - Z)</option>
                                            <option value="sales">Name (Z - A)</option>
                                            <option value="rating">Price (Low &gt; High)</option>
                                            <option value="date">Rating (Lowest)</option>
                                            <option value="price-asc">Model (A - Z)</option>
                                            <option value="price-asc">Model (Z - A)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="shop-products-wrapper">
                                <div className="tab-content">
                                    <div id="grid-view" className="tab-pane fade active show" role="tabpanel">
                                        <div className="product-area shop-product-area">
                                            <div className="row">
                                                {
                                                    products && products.map((item, index) => (
                                                        <div className="col-lg-4 col-md-4 col-sm-6 mt-80" key={index}>
                                                            <div className="single-product-wrap">
                                                                <div className="product-image">
                                                                    <img src={"http://localhost:8000/" + item.image} width="250" height="300" />
                                                                </div>
                                                                <div className="product_desc">
                                                                    <div className="product_desc_info">
                                                                        <div className="product-review">
                                                                            <h5 className="manufacturer">
                                                                                <NavLink to={"/shop/" + item.id_producer.producer}>{item.id_producer.producer}</NavLink>
                                                                            </h5>
                                                                            {/* <div className="rating-box">
                                                                                <ul className="rating">
                                                                                    {avgStar > 0 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                                                    {avgStar > 1 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                                                    {avgStar > 2 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                                                    {avgStar > 3 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                                                    {avgStar > 4 ? (<li><i className="fa fa-star-o" /></li>) : (<li className="no-star"><i className="fa fa-star-o" /></li>)}
                                                                                </ul>
                                                                            </div> */}
                                                                        </div>
                                                                        <h4><a className="product_name" href="single-product.html">{item.name_product}</a></h4>
                                                                        <div className="price-box">
                                                                            <span className="new-price">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(item.price_product) + ' VNĐ'}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="add-actions">
                                                                        <ul className="add-actions-link">
                                                                            <li className="add-cart active"><NavLink to={"/detail/" + item._id} style={{ cursor: 'pointer' }}>Add to cart</NavLink></li>
                                                                            <li><a style={{ cursor: 'pointer' }} onClick={() => setCount(1)} title="quick view" className="quick-view-btn" data-toggle="modal" data-target={"#examplemodalcenter" + item._id} ><i className="fa fa-eye" /></a></li>
                                                                            <li><a className="links-details"><i className="fa fa-heart-o" /></a></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="modal fade modal-wrapper" id={"examplemodalcenter" + item._id}>
                                                                <div className="modal-dialog modal-dialog-centered" role="document">
                                                                    <div className="modal-content">
                                                                        <div className="modal-body">
                                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                                <span aria-hidden="true">×</span>
                                                                            </button>
                                                                            <div className="modal-inner-area row">
                                                                                <div className="col-lg-5 col-md-6 col-sm-6 image-cart-mini">
                                                                                    {/* Product Details Left */}
                                                                                    <div className="product-details-left">
                                                                                        <div className="product-details-images slider-navigation-1">
                                                                                            <div className="lg-image">
                                                                                                <img src={"http://localhost:8000/" + item.image} alt="product image" />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/*// Product Details Left */}
                                                                                </div>
                                                                                <div className="col-lg-7 col-md-6 col-sm-6">
                                                                                    <div className="product-details-view-content pt-60">
                                                                                        <div className="product-info">
                                                                                            <h2>{item.name_product}</h2>
                                                                                            <div className="rating-box pt-20">
                                                                                                <ul className="rating rating-with-review-item">
                                                                                                    <li><i className="fa fa-star-o" /></li>
                                                                                                    <li><i className="fa fa-star-o" /></li>
                                                                                                    <li><i className="fa fa-star-o" /></li>
                                                                                                    <li className="no-star"><i className="fa fa-star-o" /></li>
                                                                                                    <li className="no-star"><i className="fa fa-star-o" /></li>
                                                                                                    <li className="review-item"><a href="#">Read Review</a></li>
                                                                                                    <li className="review-item"><a href="#">Write Review</a></li>
                                                                                                </ul>
                                                                                            </div>
                                                                                            <div className="price-box pt-20">
                                                                                                <span className="new-price new-price-2">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: ' VND' }).format(item.price_product) + ' VNĐ'}</span>
                                                                                            </div>
                                                                                            <div className="product-desc">
                                                                                                <p>
                                                                                                    <span>
                                                                                                        {item.describe}
                                                                                                    </span>
                                                                                                </p>
                                                                                            </div>

                                                                                            <div className="single-add-to-cart">
                                                                                                <div className="quantity">

                                                                                                    <div className="cart-plus-minus">
                                                                                                        <SelectCount count={count} increaseCount={increaseCount} decreaseCount={decreaseCount} onChangeCount={onChangeCount} />
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="cart-quantity">
                                                                                                    <button onClick={() => addToCart(item, count)} className="add-to-cart" type="submit">Add to cart</button>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="product-additional-info pt-25">
                                                                                                <a className="wishlist-btn" href="wishlist.html">
                                                                                                    <i className="fa fa-heart-o" />Add to wishlist
                                                                                            </a>
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
                                                    ))

                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                                </div>
                            </div>
                            {/* shop-products-wrapper end */}
                        </div>
                        <div className="col-lg-3 order-2 order-lg-1">
                            {/*sidebar-categores-box start  */}
                            <div className="sidebar-categores-box mt-sm-30 mt-xs-30">
                                <div className="sidebar-title">
                                    <h2>SmartPhone</h2>
                                </div>
                                {/* category-sub-menu start */}
                                <div className="category-sub-menu">
                                    <ul>
                                        {
                                            menu && menu.map((item, index) =>
                                            (
                                                <li className="sub-dropdown-holder" key={index}>
                                                    <NavLink to={"/shop/" + item.producer.toLowerCase()} className="sidebar-link">
                                                        {item.producer}
                                                    </NavLink>
                                                </li>

                                            ))
                                        }
                                    </ul>
                                </div>
                                {/* category-sub-menu end */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Shop;