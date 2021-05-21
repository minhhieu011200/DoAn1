
const Comment = require('../../Models/comment')
const Users = require('../../Models/user')

// Gọi API hiện thị list comment của sản phẩm 
// Phương thức GET
module.exports.index = async (req, res) => {
    const id_product = req.params.id

    let star = 0;

    const comment = await (await Comment.find({ id_product: id_product }).populate('id_user')).reverse()

    comment.map((value) => {
        star += Number(value.star);
    })

    if (comment.length > 0) {
        star = Number(star) / Number(comment.length)
    }

    star = (Math.round(star))

    res.json({ comment: comment, star: star })

}

// Gửi comment
// Phương Thức Post
module.exports.post_comment = async (req, res) => {

    const id_product = req.params.id
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + " " + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()

    const data = {
        id_product: id_product,
        id_user: req.body.id_user,
        content: req.body.content,
        star: req.body.star,
        createDate: time
    }

    await Comment.create(data)

    res.send('Thanh Cong')

}