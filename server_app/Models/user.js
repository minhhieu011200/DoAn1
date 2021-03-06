var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    {
        id_permission: {
            type: String,
            ref: 'Permission'
        },
        id_rank: {
            type: String,
            ref: 'Rank'
        },
        username: String,
        password: String,
        fullname: String,
        email: String,

    }
);

var Users = mongoose.model('Users', schema, 'user');

module.exports = Users;