import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import couponAPI from '../Api/couponAPI';
import isEmpty from 'validator/lib/isEmpty'
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

function CreateCoupon(props) {
    const [code, setCode] = useState('')
    const [describe, setDescribe] = useState('');
    const [promotion, setPromotion] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [number, setNumber] = useState('');
    const [payment, setPayment] = useState([]);
    const [rank, setRank] = useState([]);
    const [paymentChoose, setPaymentChoose] = useState("");
    const [rankChoose, setRankChoose] = useState('');

    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();

    useEffect(() => {
        const fetchAllData = async () => {
            const response = await couponAPI.getCreate();
            setPayment(response.payment)
            setRank(response.rank)
        }
        fetchAllData()
    }, [])

    const onChangeNumber = (e) => {
        const value = e.target.value
        if (!Number.isNaN(value) && Number(value) >= 0) {
            setNumber(value)
        }
    }

    const onChangePromotion = (e) => {
        const value = e.target.value
        if (!Number.isNaN(value) && Number(value) >= 0 && Number(value) <= 90) {
            setPromotion(value)
        }
    }

    const validateAll = () => {
        let msg = {}
        const usernameRegex = /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
        if (isEmpty(code.trim())) {
            msg.code = "Code không được để trống"
        } else if (!usernameRegex.test(code.trim())) {
            msg.code = "Code sai định dạng"
        }

        if (isEmpty(describe.trim())) {
            msg.describe = "Mô tả không được để trống"
        }
        if (isEmpty(promotion.trim())) {
            msg.promotion = "Phần trăm giảm không được để trống"
        }
        if (isEmpty(number.trim())) {
            msg.number = "Số lượng không được để trống"
        }
        if (startDate === null) {
            msg.startDate = "Ngày bắt đầu không được để trống"
        }
        if (endDate === null) {
            msg.endDate = "Ngày bắt đầu không được để trống"
        }
        else if (startDate > endDate) {
            msg.endDate = "Ngày kết thúc không được nhỏ hơn ngày bắt đầu"
        }

        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleCreate = () => {
        const isValid = validateAll();
        if (!isValid) return
        addCoupon();
    }
    const addCoupon = async () => {
        const body = {
            code: code.trim(),
            describe: describe.trim(),
            promotion: (Math.round(promotion * 10) / 10).toString().trim(),
            startDate: new Date(moment(startDate).startOf('day').format('L LTS')),
            endDate: new Date(moment(endDate).endOf('day').format('L LTS')),
            number: (Math.round(number)).toString().trim(),
            id_payment: paymentChoose,
            id_rank: rankChoose
        }
        const response = await couponAPI.postCreate(body)

        if (response.msg === "Bạn đã thêm thành công") {
            setCode('');
            setDescribe('');
            setPromotion('');
            setStartDate(new Date());
            setEndDate(new Date())
            setNumber('')
            setPaymentChoose('');
            setRankChoose('')

        }
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
                                <h4 className="card-title">Create Coupon</h4>
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
                                        <label htmlFor="describe">Mô tả</label>
                                        <input type="text" className="form-control" id="describe" name="describe" value={describe} onChange={(e) => setDescribe(e.target.value)} />
                                        <p className="form-text text-danger">{validationMsg.describe}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="code">Code</label>
                                        <input type="text" className="form-control" id="code" name="code" value={code} onChange={(e) => setCode(e.target.value)} />
                                        <p className="form-text text-danger">{validationMsg.code}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="promotion">Phần trăm giảm</label>
                                        <input type="text" className="form-control" id="pro" name="promotion" value={promotion} onChange={(e) => onChangePromotion(e)} />
                                        <p className="form-text text-danger">{validationMsg.promotion}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="number">Số lượng: </label>
                                        <input type="text" className="form-control" id="number" name="number" value={number} onChange={(e) => onChangeNumber(e)} />
                                        <p className="form-text text-danger">{validationMsg.number}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="start">Ngày bắt đầu</label><br />
                                        <DatePicker
                                            closeOnScroll={true}
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            id="start"
                                            isClearable
                                        />
                                        <p className="form-text text-danger">{validationMsg.startDate}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="start">Ngày kết thúc</label><br />
                                        <DatePicker
                                            closeOnScroll={true}
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            isClearable
                                        />
                                        <p className="form-text text-danger">{validationMsg.endDate}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="payment" className="mr-2">Chọn loại thanh toán:</label>
                                        <select name="payment" id="payment" value={paymentChoose} onChange={(e) => setPaymentChoose(e.target.value)}>
                                            <option value="">Tất cả hình thức thanh toán</option>
                                            {
                                                payment && payment.map((item, index) => (
                                                    <option value={item._id} key={index} >{item.pay_name}</option>
                                                ))
                                            }

                                        </select>
                                        <p className="form-text text-danger">{validationMsg.payment}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="rank" className="mr-2">Chọn thành viên:</label>
                                        <select name="rank" id="rank" value={rankChoose} onChange={(e) => setRankChoose(e.target.value)}>
                                            <option value="">Tất cả khách hàng</option>
                                            {
                                                rank && rank.map((item, index) => (
                                                    <option value={item._id} key={index}>{item.rank}</option>
                                                ))
                                            }

                                        </select>
                                        <p className="form-text text-danger">{validationMsg.rank}</p>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Create Coupon</button>
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

export default CreateCoupon;