import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import producerAPI from '../Api/producerAPI';
import isEmpty from 'validator/lib/isEmpty'
import productAPI from '../Api/productAPI';

function CreateProduct(props) {
    const [producer, setProducer] = useState([])
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [number, setNumber] = useState('');
    const [producerChoose, setProducerChoose] = useState('');
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();


    useEffect(() => {
        const fetchAllData = async () => {
            const ct = await producerAPI.getAPI()
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
        if (!Number.isNaN(value) && Number(value) >= 0) {
            setPrice(value)
        }
    }


    const validateAll = () => {
        const priceRegex = /^[1-9](?=.+[0-9]).{0,}$/
        let msg = {}
        if (isEmpty(name)) {
            msg.name = "Tên không được để trống"
        }
        if (isEmpty(price)) {
            msg.price = "Giá không được để trống"
        } else if (!priceRegex.test(price)) {
            msg.price = "Giá sai định dạng"
        }
        if (isEmpty(description)) {
            msg.description = "Mô tả không được để trống"
        }
        if (isEmpty(number)) {
            msg.number = "Số lượng không được để trống"
        } else if (!priceRegex.test(number)) {
            msg.number = "Số lượng sai định dạng"
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
        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("name", name)
        formData.append("price", price)
        formData.append("producer", producerChoose)
        formData.append("number", number)
        formData.append("description", description)
        const response = await productAPI.create(formData)

        if (response.msg === "Bạn đã thêm thành công") {
            setName('');
            setPrice('');
            setDescription('');
            setNumber('')
            setProducerChoose('')
            setFile('')
            setFileName('')
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
                                <h4 className="card-title">Create Product</h4>
                                {
                                    validationMsg.api === "Bạn đã thêm thành công" ?
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
                                        <input type="number" className="form-control" id="number" name="number" value={number} onChange={(e) => onChangeNumber(e)} required />
                                        <p className="form-text text-danger">{validationMsg.number}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="producers" className="mr-2">Chọn nhà sản xuất:</label>
                                        <select name="producers" id="producers" value={producerChoose} onChange={(e) => setProducerChoose(e.target.value)}>
                                            <option >Chưa chọn</option>
                                            {
                                                producer && producer.map((item, index) => (
                                                    <option value={item._id} key={index} >{item.producer}</option>
                                                ))
                                            }

                                        </select>
                                        <p className="form-text text-danger">{validationMsg.producer}</p>
                                    </div>
                                    <div className="form-group w-50">
                                        <label>Hình Ảnh</label>
                                        <input type="file" className="form-control-file" name="file" onChange={saveFile} />
                                    </div>

                                    <button type="submit" className="btn btn-primary">Create Product</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by Minh Hiếu.
            </footer>
        </div>
    );
}

export default CreateProduct;