import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import isEmpty from 'validator/lib/isEmpty'
import { useParams } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import queryString from 'query-string'

import saleAPI from '../Api/saleAPI';

function UpdateSale(props) {
    const { id } = useParams()
    const [describe, setDescribe] = useState('');
    const [promotion, setPromotion] = useState('');
    const [status, setStatusChoose] = useState(true);
    const [products, setProducts] = useState([])
    const [page, set_page] = useState(1)
    const [loadCategory, setLoadCategory] = useState(true)
    const [show_load, set_show_load] = useState(true)
    const [validationMsg, setValidationMsg] = useState('');

    const { handleSubmit } = useForm();

    const onChangePromotion = (e) => {
        const value = e.target.value
        if (!Number.isNaN(value) && Number(value) >= 0 && Number(value) <= 90) {
            setPromotion(value)
        }
    }

    useEffect(() => {
        const fetchAllData = async () => {
            const response = await saleAPI.details(id);

            setDescribe(response.describe)
            setPromotion(response.promotion)
            setStatusChoose(response.status)
        }
        fetchAllData()
    }, [id])

    useEffect(() => {
        const fetchData = async () => {
            const params = {
                page: page,
                count: '6',
                category: loadCategory
            }

            const query = '?' + queryString.stringify(params)
            const response = await saleAPI.getCreate(query)

            let newData = response.map(e => {
                if (e.id_sale && e.id_sale == id) {
                    return Object.assign({}, e, { check: true });
                }
                return Object.assign({}, e, { check: false });
            })

            if (response.length < 1) {
                set_show_load(false)
            }
            setProducts(prev => [...prev, ...newData])
            setLoadCategory(false)
        }

        fetchData()

    }, [page, id])

    const validateAll = () => {
        let msg = {}

        if (isEmpty(describe.trim())) {
            msg.describe = "Mô tả không được để trống"
        }
        if (isEmpty(promotion.toString().trim())) {
            msg.promotion = "Phần trăm giảm không được để trống"
        } else if (Number(promotion === 0)) {
            msg.promotion = "Phần trăm giảm phải lớn hơn 0"
        }
        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleChange = (item) => {
        const index = products.indexOf(item);
        products[index].check = !products[index].check
        setProducts(products)
    }


    const handleUpdate = () => {
        const isValid = validateAll();
        if (!isValid) return
        addCoupon();
    }
    const addCoupon = async () => {
        const body = {
            id: id,
            describe: describe.trim(),
            promotion: (Math.round(promotion * 10) / 10).toString().trim(),
            status: status,
        }
        const query = '?' + queryString.stringify(body)
        console.log(products)
        const response = await saleAPI.update(query, { product: products })

        window.scrollTo(0, 0)
        setValidationMsg({ api: response.msg })

    }

    return (
        <div className="page-wrapper">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Update Sale</h4>
                                {
                                    validationMsg.api === "Bạn đã update thành công" ?
                                        (
                                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                {validationMsg.api}
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                        ) :
                                        (
                                            <p className="form-text text-danger">{validationMsg.api}</p>
                                        )
                                }


                                <form onSubmit={handleSubmit(handleUpdate)}>
                                    <div className="form-group w-50">
                                        <label htmlFor="describe">Mô tả</label>
                                        <input type="text" className="form-control" id="describe" name="describe" value={describe} onChange={(e) => setDescribe(e.target.value)} />
                                        <p className="form-text text-danger">{validationMsg.describe}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="promotion">Phần trăm giảm</label>
                                        <input type="text" className="form-control" id="pro" name="promotion" value={promotion} onChange={(e) => onChangePromotion(e)} />
                                        <p className="form-text text-danger">{validationMsg.promotion}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="status" className="mr-2">Chọn tình trạng:</label>
                                        <select name="status" id="status" value={status} onChange={(e) => setStatusChoose(e.target.value)}>
                                            <option value={true} >Hoạt động</option>
                                            <option value={false}  >Ngưng hoạt động</option>
                                        </select>
                                    </div>

                                    <div className="form-group w-50">
                                        <div>Chọn sản phẩm:</div>
                                        <div id="scrollableDiv" className="border-product mx-3 my-3">
                                            <InfiniteScroll
                                                className="m-3"
                                                style={{ overflow: 'none', height: '100' }}
                                                scrollableTarget="scrollableDiv"
                                                dataLength={products.length}
                                                next={() => set_page(page + 1)}
                                                hasMore={true}
                                                loader={show_load && <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
                                            >
                                                {
                                                    products && products.map((item, index) => (
                                                        item.producer ?
                                                            (
                                                                <div className="" key={item._id}>
                                                                    <input type="checkbox" onChange={() => handleChange(item)} id={index} defaultChecked={item.check} name={index} value={item._id} className="mr-3" />
                                                                    <label htmlFor={index}>{"Tất cả sản phẩm " + item.producer}</label>
                                                                </div>
                                                            ) :
                                                            (
                                                                <div className="" key={item._id}>
                                                                    <input type="checkbox" onChange={() => handleChange(item)} id={index} defaultChecked={item.check} name={index} value={item._id} className="mr-3" />
                                                                    <label htmlFor={index}>{item.name_product}</label>
                                                                </div>
                                                            )

                                                    ))
                                                }
                                            </InfiniteScroll>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary mt-3">Update Sale</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by Minh Hiếu.
            </footer>
        </div >

    );
}

export default UpdateSale;