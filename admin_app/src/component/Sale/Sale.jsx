import React, { useEffect, useState } from 'react';
import queryString from 'query-string'
import { Link } from 'react-router-dom';

import SaleAPI from '../Api/saleAPI';
import Pagination from '../Shared/Pagination';
import Search from '../Shared/Search';


function Sale(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '5',
        search: '',
        status: true
    })

    const [sale, setSale] = useState([])
    const [totalPage, setTotalPage] = useState()


    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const response = await SaleAPI.getAPI(query)
            console.log(response)
            setSale(response.sales)
            setTotalPage(response.totalPage)
        }
        fetchAllData()
    }, [filter])


    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }

    const handlerSearch = (value) => {
        setFilter({
            ...filter,
            page: '1',
            search: value
        })
    }

    const handleDelete = async (id) => {
        const response = await SaleAPI.delete(id)
        setFilter({
            ...filter,
            status: !filter.status
        })
    }

    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Sale</h4>
                                <Search handlerSearch={handlerSearch} />

                                <Link to="/sale/create" className="btn btn-primary my-3">New create</Link>


                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Promotion</th>
                                                <th>Describe</th>
                                                <th>Status</th>
                                                <th>Edit</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                sale && sale.map((value, index) => (
                                                    <tr key={index}>
                                                        <td className="name">{value._id}</td>
                                                        <td className="name">{value.promotion}</td>
                                                        <td className="name">{value.describe}</td>
                                                        <td className="name">{value.status ? "Hoạt Động" : "Ngưng Hoạt Động"}</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"/sale/update/" + value._id} className="btn btn-success mr-1">Update</Link>
                                                                <button type="button" style={{ cursor: 'pointer', color: 'white' }} onClick={() => handleDelete(value._id)} className="btn btn-danger" >Delete</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                                </div>
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

export default Sale;