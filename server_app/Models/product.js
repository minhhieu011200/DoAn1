var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    {
        id_producer: {
            type: String,
            ref: 'Producer'
        },
        name_product: String,
        price_product: String,
        image: String,
        describe: String,
        number: Number,
    }
);

var Products = mongoose.model('Products', schema, 'product');

module.exports = Products;