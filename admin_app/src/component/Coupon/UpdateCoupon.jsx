import React, { useEffect, useState } from 'react';
import queryString from 'query-string'
import { useForm } from "react-hook-form";
import { useParams } from 'react-router';
import couponAPI from '../Api/couponAPI';
import isEmpty from 'validator/lib/isEmpty'
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

function UpdateCoupon(props) {
    const { id } = useParams()
    const [code, setCode] = useState('')
    const [describe, setDescribe] = useState('');
    const [promotion, setPromotion] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [number, setNumber] = useState('');
    const [payment, setPayment] = useState([]);
    const [rank, setRank] = useState([]);
    const [paymentChoose, setPaymentChoose] = useState("");
    const [rankChoose, setRankChoose] = useState("");

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

    useEffect(() => {
        const fetchAllData = async () => {
            const response = await couponAPI.details(id);
            setCode(response.code)
            setNumber(response.number)
            setDescribe(response.describe)
            setPromotion(response.promotion)
            setStartDate(new Date(response.startDate))
            setEndDate(new Date(response.endDate))
            response.id_payment && setPaymentChoose(response.id_payment._id)
            response.id_rank && setRankChoose(response.id_rank._id)
        }
        fetchAllData()
    }, [id])

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
            msg.code = "Code kh??ng ???????c ????? tr???ng"
        } else if (!usernameRegex.test(code.trim())) {
            msg.code = "Code sai ?????nh d???ng"
        }

        if (isEmpty(describe.trim())) {
            msg.describe = "M?? t??? kh??ng ???????c ????? tr???ng"
        }
        if (isEmpty(promotion.toString().trim())) {
            msg.promotion = "Ph???n tr??m gi???m kh??ng ???????c ????? tr???ng"
        }
        if (isEmpty(number.toString().trim())) {
            msg.number = "S??? l?????ng kh??ng ???????c ????? tr???ng"
        }
        if (startDate === null) {
            msg.startDate = "Ng??y b???t ?????u kh??ng ???????c ????? tr???ng"
        }
        if (endDate === null) {
            msg.endDate = "Ng??y b???t ?????u kh??ng ???????c ????? tr???ng"
        }
        else if (startDate > endDate) {
            msg.endDate = "Ng??y k???t th??c kh??ng ???????c nh??? h??n ng??y b???t ?????u"
        }

        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleCreate = () => {
        const isValid = validateAll();
        if (!isValid) return
        updateCoupon();
    }
    const updateCoupon = async () => {
        const body = {
            id: id,
            code: code.trim(),
            describe: describe.trim(),
            promotion: (Math.round(promotion * 10) / 10).toString().trim(),
            startDate: new Date(moment(startDate).startOf('day').format('L LTS')),
            endDate: new Date(moment(endDate).endOf('day').format('L LTS')),
            number: (Math.round(number)).toString().trim(),
            id_payment: paymentChoose,
            id_rank: rankChoose
        }
        const query = '?' + queryString.stringify(body)
        const response = await couponAPI.update(query)

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
                                <h4 className="card-title">Update Coupon</h4>
                                {
                                    validationMsg.api === "B???n ???? update th??nh c??ng" ?
                                        (
                                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                {validationMsg.api}
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">??</span>
                                                </button>
                                            </div>
                                        ) :
                                        (
                                            <p className="form-text text-danger">{validationMsg.api}</p>
                                        )
                                }


                                <form onSubmit={handleSubmit(handleCreate)}>
                                    <div className="form-group w-50">
                                        <label htmlFor="describe">M?? t???</label>
                                        <input type="text" className="form-control" id="describe" name="describe" value={describe} onChange={(e) => setDescribe(e.target.value)} />
                                        <p className="form-text text-danger">{validationMsg.describe}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="code">Code</label>
                                        <input type="text" className="form-control" id="code" name="code" value={code} onChange={(e) => setCode(e.target.value)} />
                                        <p className="form-text text-danger">{validationMsg.code}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="promotion">Ph???n tr??m gi???m</label>
                                        <input type="text" className="form-control" id="pro" name="promotion" value={promotion} onChange={(e) => onChangePromotion(e)} />
                                        <p className="form-text text-danger">{validationMsg.promotion}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="number">S??? l?????ng: </label>
                                        <input type="text" className="form-control" id="number" name="number" value={number} onChange={(e) => onChangeNumber(e)} />
                                        <p className="form-text text-danger">{validationMsg.number}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="start">Ng??y b???t ?????u</label><br />
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
                                        <label htmlFor="start">Ng??y k???t th??c</label><br />
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
                                        <label htmlFor="payment" className="mr-2">Ch???n lo???i thanh to??n:</label>
                                        <select name="payment" id="payment" value={paymentChoose} onChange={(e) => setPaymentChoose(e.target.value)}>
                                            <option value="">T???t c??? h??nh th???c thanh to??n</option>
                                            {
                                                payment && payment.map((item, index) => (
                                                    <option value={item._id} key={index} >{item.pay_name}</option>
                                                ))
                                            }

                                        </select>
                                        <p className="form-text text-danger">{validationMsg.payment}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="rank" className="mr-2">Ch???n th??nh vi??n:</label>
                                        <select name="rank" id="rank" value={rankChoose} onChange={(e) => setRankChoose(e.target.value)}>
                                            <option value="">T???t c??? kh??ch h??ng</option>
                                            {
                                                rank && rank.map((item, index) => (
                                                    <option value={item._id} key={index} >{item.rank}</option>
                                                ))
                                            }

                                        </select>
                                        <p className="form-text text-danger">{validationMsg.rank}</p>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Update Coupon</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by Minh Hi???u.
            </footer>
        </div>
    );
}

export default UpdateCoupon;