const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const { auth } = require("../middleware/auth");
const async = require('async');
//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart, //모든 페이지에서 유저의 정보를 받음
        history: req.user.history,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    //먼저 User Collection에서 유저 정보 가져옴
    //console.log(req.body)
    User.findOne({_id: req.user._id},
        (err, userInfo) => {
            //가져온 정보에서 카트에다 넣으려 하는 상품이 있는지 확인
            let duplicate = false;
            //let quantity = req.user.quantity;
            userInfo.cart.forEach((item)=>{
                if(item.id === req.body.productId){
                    duplicate = ture;
                }
            })  
            let quantity = parseInt(req.body.quantity);
            //console.log("quantity",quantity)
    
        //있을때
        if(duplicate){
            User.findOneAndUpdate(
                {_id: req.user._id, "cart.id": req.body.productId},
                {$inc: {"cart.$.quantity": quantity}}, 
                {new: true},
                (err, userIfo)=>{
                    if(err) return res.status(200).json({success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
        } 
        //없을때
        else {
            User.findOneAndUpdate(
                {_id: req.user._id},
                {$push: {cart: { id: req.body.productId, quantity: quantity, date: Date.now()}}},
                {new: true},
                (err, userInfo)=>{
                    if(err) return res.status(400).json({success: false, err})
                    res.status(200).send(userInfo.cart)
                    //console.log(userInfo.cart)
                }
            )
        }

        })

});

router.post("/decrement", auth, (req, res) => {
    let minQuantity = false;

    User.findOne({_id: req.user._id, "cart.id": req.body.id},
    (err, userInfo)=>{
        userInfo.cart.forEach((item)=>{
        if(item.id === req.body.id){
            if(item.quantity <= 1){
                minQuantity = false
            } else {
                minQuantity = true
            }
        }
    })
    if(minQuantity){
    User.findOneAndUpdate(
        {_id: req.user._id, "cart.id": req.body.id},
        {$inc: {"cart.$.quantity": -1}},
        {new: true},
        (err, userInfo)=>{
            if(err) return res.status(200).json({success: false, err})
                    res.status(200).send(userInfo.cart)
                   
        }
    )}
})
});

router.post("/increment", auth, (req, res) => {

    User.findOneAndUpdate(
        {_id: req.user._id, "cart.id": req.body.id},
        {$inc: {"cart.$.quantity": 1}},
        {new: true},
        (err, userInfo)=>{
            if(err) return res.status(200).json({success: false, err})
                    res.status(200).send(userInfo.cart)
        }
    )
});

router.get('/removeFromCart',  auth, (req, res) => {
    // cart 안에서 지워주기
    User.findOneAndUpdate(
        {_id: req.user._id},
        {"$pull":{"cart":{"id": req.query.id}}},
        {new: true},
        (err, userInfo) => {
            let cart = userInfo.cart; //3241234,12341234로 되어있는거
            let array = cart.map(item => { //[12341234,231234123]로 바꿔주기
                return item.id
            })
            // product collection에서 현재 남아있는 상품들의 정보를 가져오기
            Product.find({_id : {$in : array}}) //product array안에 있는 정보를 모두 가져옴
            .populate('writer')
            .exec((err, productInfo) => {
                //console.log("productInfo",productInfo, "cart",cart)
                return res.status(200).json({ // CartDetail정보 = userCollection + productCollection
                    productInfo,
                    cart
                })
            })
        }
    )
})

router.post('/successBuy', auth, (req, res) => {

    // User collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    //cartDetail은 props로 넘겨줌
    req.body.cartDetail.forEach((item) => {
        history.push({
            // cartDetail에 담겨있는 정보
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            // paymentData에 들어있는 정보
            paymentId: req.body.paymentData.paymentID
        })
    })

    // Payment collection 안에 자세한 정보들 넣어주기
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData
    transactionData.product = history

    // history 정보 저장
    User.findOneAndUpdate( // 필터조건에 걸리는 첫번째 document 를 업데이트한다.
        {_id: req.user._id},
        {$push: {history: history}, $set: {cart: []}},
        {new: true},
        (err, user) => {
            if(err) return res.json({ success: false, err})

            // payment transactionData 정보 저장
            const payment = new Payment(transactionData);
            payment.save((err, doc) => {
                //console.log(doc.product)
                if(err) return res.json({ success: false, err})

                // Product collection 안에 있는 sold 필드 정보 업데이트 시켜주기
                
                // 상품당 몇개를 샀는지(quantity)
                let products = [];
                doc.product.forEach(item => {
                    products.push({id: item.id, quantity: item.quantity})
                })

                async.eachSeries(products, (item, callback) => {
                    
                    Product.update( //여러개의 documents를 한번에 업데이트 할수 있다.
                        {_id: item.id},
                        {
                            $inc: {
                                "sold" : item.quantity
                            }
                        },
                        {new: false},
                        callback
                    )
                }, (err) => {
                    if(err) return res.json({success: false, err})
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })
            })
        }
    )

    

})

module.exports = router;
