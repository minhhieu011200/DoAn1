import React from 'react';

function Pagination({ filter, onPageChange, totalPage }) {
    const { page } = filter
    let indexPage = []

    //Tạo ra số nút bấm cho từng trang
    for (var i = 1; i <= totalPage; i++) {
        indexPage.push(i)
    }

    const handlePageChange = (newPage) => {
        if (onPageChange) {
            onPageChange(newPage)
        }
    }
    return (
        <div className="paginatoin-area mt-90">
            <div className="row">
                <div className="col-lg-12 col-md-6">
                    <ul className="pagination-box pt-xs-20 pb-xs-15 text-center">
                        <li>
                            <button onClick={() => handlePageChange(parseInt(page) - 1)}
                                disabled={page <= 1} className="Previous" style={{ background: "#0e8170" }}><i className="fa fa-chevron-left" /></button>
                        </li>
                        {
                            indexPage && indexPage.map(value => (
                                <li className={value === parseInt(page) ? 'page-item active' : 'page-item'}
                                    key={value}
                                    onClick={() => handlePageChange(parseInt(value))}>

                                    <a>{value}</a>

                                </li>
                            ))
                        }

                        <li>
                            <button onClick={() => handlePageChange(parseInt(page) + 1)}
                                disabled={page >= totalPage} className="Next" style={{ background: "#0e8170" }}> <i className="fa fa-chevron-right" /></button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Pagination;