const express = require('express');
const router = express.Router();
const { Product } = require("../models/Product");
const multer = require('multer');

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })

  var upload = multer({ storage: storage }).single("file")

  // 가져온 이미지 저장
router.post('/image', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            return res.json({success: false, err})
        }
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename})
    })
})

router.post('/', (req, res) => {
    const product = new Product(req.body) //디비 가져와서 받아온 body 넣기
    product.save((err) => { // 저장
        if(err) return res.status(200).json({success: false, err})
        return res.status(200).json({success: true})
    })
})

// https://www.inflearn.com/questions/33456

// LandingPage
// 상품 목록 조회(필터)
router.post('/products', (req, res) => {
  console.log(req.body) //=> skip, limit, filters
  

  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let findArgs = {}; // category: [2]
  let search = req.body.searchTerm
  let order = "desc";
  let sortBy = "_id";
  //let order = req.body.order ? req.body.order : "desc";

  //let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let sort = req.body.filters && req.body.filters.sort;

  //console.log("sort",sort)

  //정렬 
  if(sort === undefined && sort === 1){
    order = "desc";
    sortBy = "_id";
  }  else if( sort === 2){
    order = "1";
    sortBy = "price"
  } else if( sort === 3){
    order = "-1";
    sortBy = "price"
  } else if( sort === 4){
    order = "-1";
    sortBy = "sold"
  }

  for(let key in req.body.filters){ 
    if(req.body.filters[key].length > 0){ //key 는 category or price
      console.log('key',key)   
      if(key === "price"){ //radio
        findArgs[key] = {
          $gte: req.body.filters[key][0], // 보다 크거나 같고
          $lte: req.body.filters[key][1] // 보다 작거나 같은
        }
      }
      else {
        findArgs[key] = req.body.filters[key]; // checkbox 필터
      }     
    }
  }

  // 검색어
  if(search){
    Product.find(findArgs)
    .find({$text: {$search: search}}) //검색에 필요한 옵션
    .populate('writer')
    .skip(skip)
    .limit(limit)
    .sort([[sortBy, order]])
    .exec((err, productInfo) => {
      if(err) return res.status(400).json({success: false, err})
      return res.status(200).json({success: true, productInfo, postSize: productInfo.length})
    })
  } else {
    Product.find(findArgs) 
    .populate('writer')
    .skip(skip)
    .limit(limit)
    .sort([[sortBy, order]]) 
    .exec((err, productInfo) => {
      if(err) return res.status(400).json({success: false, err})
      return res.status(200).json({success: true, productInfo, postSize: productInfo.length})
    })

  }

})

//`/product/${product._id}`
router.get('/product_id',(req, res,) => {

  let type = req.query.type //single or array
  let productIds = req.query.id

  if(type === "array"){
    // productIds = 123123,234234,345345 를
    // productIds  = ['123123', '234234', '345345] 로 바꿔줌
    let ids = req.query.id.split(',')
    productIds = ids.map(item=>{
      return item
    })
  }

  Product.find({_id: {$in: productIds}})
  .populate('writer')
  .exec((err, product) => {
    if(err) return res.status(200).json({success: false, err})
    return res.status(200).send(product)
  })
})

module.exports = router;
