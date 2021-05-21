const Producer = require('../../../Models/producer')
const Product = require('../../../Models/product')

module.exports.index = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    const keyWordSearch = req.query.search;

    const perPage = parseInt(req.query.limit) || 8;
    const totalPage = Math.ceil(await Producer.countDocuments() / perPage);

    let start = (page - 1) * perPage;
    let end = page * perPage;

    const producers = await Producer.find();


    if (!keyWordSearch) {
        res.json({
            producers: producers.slice(start, end),
            totalPage: totalPage
        })

    } else {
        var newData = producers.filter(value => {
            return value.producer.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.id.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
        })

        res.json({
            producers: newData.slice(start, end),
            totalPage: totalPage
        })
    }
}

module.exports.create = async (req, res) => {
    const producer = await Producer.find();

    const producerFilter = producer.filter((c) => {
        return c.producer.toUpperCase() === req.query.name.toUpperCase().trim()
    });

    if (producerFilter.length > 0) {
        res.json({ msg: 'Loại đã tồn tại' })
    } else {
        var newproducer = new Producer()
        req.query.name = req.query.name.toLowerCase().replace(/^.|\s\S/g, a => { return a.toUpperCase() })
        newproducer.producer = req.query.name

        newproducer.save();
        res.json({ msg: "Bạn đã thêm thành công" })
    }
}

module.exports.delete = async (req, res) => {
    console.log(req.query)
    const id = req.query.id;

    await Producer.deleteOne({ _id: id }, (err) => {
        if (err) {
            res.json({ msg: err })
            return;
        }
        res.json({ msg: "Thanh Cong" })
    })

}


module.exports.detailProduct = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    const keyWordSearch = req.query.search;

    const perPage = parseInt(req.query.limit) || 8;


    let start = (page - 1) * perPage;
    let end = page * perPage;

    let products = await Product.find().populate('id_producer');

    if (req.params.id !== 'undefined') {

        products = products.filter((c) => {
            return c.id_producer.producer.toUpperCase() === req.params.id.toUpperCase()
        });
    }


    const totalPage = Math.ceil(products.length / perPage);

    if (!keyWordSearch) {
        res.json({
            products: products.slice(start, end),
            totalPage: totalPage
        })

    } else {
        var newData = products.filter(value => {
            return value.name_product.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.price_product.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1 ||
                value.id.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
            // value.id_category.category.toUpperCase().indexOf(keyWordSearch.toUpperCase()) !== -1
        })

        res.json({
            products: newData.slice(start, end),
            totalPage: totalPage
        })
    }
}

module.exports.update = async (req, res) => {
    const producer = await Producer.find();

    const producerFilter = producer.filter((c) => {
        return c.producer.toUpperCase() === req.query.name.toUpperCase().trim() && c.id !== req.query.id
    });

    if (producerFilter.length > 0) {
        res.json({ msg: 'Loại đã tồn tại' })
    } else {
        req.query.name = req.query.name.toLowerCase().replace(/^.|\s\S/g, a => { return a.toUpperCase() })
        await Producer.updateOne({ _id: req.query.id }, { producer: req.query.name }, function (err, res) {
            if (err) return res.json({ msg: err });
        });
        res.json({ msg: "Bạn đã update thành công" })
    }
}

module.exports.detail = async (req, res) => {
    const producer = await Producer.findOne({ _id: req.params.id });

    res.json(producer)
}