import React from 'react';
import PropTypes from 'prop-types';

NotFound.propTypes = {

};

function NotFound(props) {
    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <h1 style={{ fontWeight: 'bolder', color: "black" }}>Error 404!</h1>
            </div>
            <footer className="footer text-center text-muted">
                All Rights Reserved by Adminmart. Designed and Developed by Minh Hiếu.
        </footer>
        </div >
    );
}

export default NotFound;