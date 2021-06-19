import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import isEmpty from 'validator/lib/isEmpty'

import producerAPI from '../Api/producerAPI';
import productAPI from '../Api/productAPI';
import saleAPI from '../Api/saleAPI';

function UpdateProduct(props) {
    const [id] = useState(props.match.params.id)
    const [producer, setProducer] = useState([])
    const [sale, setSale] = useState([])
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [number, setNumber] = useState('');
    const [producerChoose, setProducerChoose] = useState('');
    const [saleChoose, setSaleChoose] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const [fileName, setFileName] = useState("");
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();


    useEffect(() => {
        const fetchAllData = async () => {
            const ct = await producerAPI.getAPI()
            const rs = await productAPI.details(id)
            const res = await saleAPI.getAll()
            setSale(res)
            setName(rs.name_product)
            setPrice(rs.price_product)
            setDescription(rs.describe)
            setNumber(rs.number)
            rs.id_producer && setProducerChoose(rs.id_producer._id)
            setImage(rs.image)
            rs.id_sale && setSaleChoose(rs.id_sale._id)
            setProducer(ct)
        }
        fetchAllData()
    }, [])

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const onChangeNumber = (e) => {
        const value = e.target.value
        if (!Number.isNaN(value) && Number(value) >= 0) {
            setNumber(value)
        }
    }


    const onChangePrice = (e) => {
        const value = e.target.value
        if (!Number.isNaN(value) && Number(value) > 0) {
            setPrice(value)
        }
    }

    const validateAll = () => {
        let msg = {}
        if (isEmpty(name.trim())) {
            msg.name = "Tên không được để trống"
        }
        if (isEmpty(price.toString().trim())) {
            msg.price = "Giá không được để trống"
        }
        if (isEmpty(description.trim())) {
            msg.description = "Mô tả không được để trống"
        }
        if (isEmpty(number.toString())) {
            msg.number = "Số lượng không được để trống"
        }
        if (isEmpty(producerChoose)) {
            msg.producer = "Vui lòng chọn loại"
        }

        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleCreate = () => {

        const isValid = validateAll();
        if (!isValid) return
        console.log(file)
        addProduct();

    }

    const addProduct = async () => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("name", name)
        formData.append("price", price)
        formData.append("producer", producerChoose)
        formData.append("number", number)
        formData.append("description", description)
        formData.append("id_sale", saleChoose)

        const response = await productAPI.update(formData)

        if (response.msg === "Bạn đã update thành công") {
            window.scrollTo(0, 0)
        }
        setValidationMsg({ api: response.msg })

    }


    return (
        <div className="page-wrapper">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Update Product</h4>
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


                                <form onSubmit={handleSubmit(handleCreate)}>
                                    <div className="form-group w-50">
                                        <label htmlFor="name">Tên Sản Phẩm</label>
                                        <input type="text" className="form-control" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                        <p className="form-text text-danger">{validationMsg.name}</p>
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="price">Giá Sản Phẩm</label>
                                        <input type="text" className="form-control" id="price" name="price" value={price} onChange={(e) => onChangePrice(e)} required />
                                        <p className="form-text text-danger">{validationMsg.price}</p>
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="description">Mô tả</label>
                                        <input type="text" className="form-control" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                        <p className="form-text text-danger">{validationMsg.description}</p>
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="number">Số lượng: </label>
                                        <input type="text" className="form-control" id="number" name="number" value={number} onChange={(e) => onChangeNumber(e)} />
                                        <p className="form-text text-danger">{validationMsg.number}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        {/* <label htmlFor="categories" className="mr-2">Chọn loại:</label> */}
                                        <label htmlFor="categories" className="mr-2">Chọn nhà sản xuất:</label>
                                        <select name="categories" id="categories" value={producerChoose} onChange={(e) => setProducerChoose(e.target.value)}>
                                            {
                                                producer && producer.map((item, index) => (
                                                    <option value={item._id} key={index} >{item.producer}</option>
                                                ))
                                            }

                                        </select>
                                        <p className="form-text text-danger">{validationMsg.producer}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="sale" className="mr-2">Chọn khuyến mãi:</label>
                                        <select name="sale" id="sale" value={saleChoose} onChange={(e) => setSaleChoose(e.target.value)}>
                                            <option value="">Không chọn khuyến mãi</option>
                                            {
                                                sale && sale.map((item, index) => (
                                                    <option value={item._id} key={index} >{item.describe}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group w-50">
                                        <label>Hình Ảnh</label>
                                        <input type="file" className="form-control-file" name="file" onChange={saveFile} />
                                    </div>

                                    <div className="form-group w-50">
                                        <label>Hình Ảnh Cũ</label>
                                        <img src={process.env.REACT_APP_API + image} alt="" style={{ width: '70px' }} />
                                    </div>


                                    <button type="submit" className="btn btn-primary">Update Product</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by <a href="https://wrappixel.com">WrapPixel</a>.
            </footer>
        </div>
    );
}

export default UpdateProduct;