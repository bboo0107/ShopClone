const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
   writer: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   title: {
       type: String,
       maxlength: 50
   },
   description: {
       type: String,
   },
   price: {
       type: Number,
       default: 0
   },
   images: {
       type: Array,
       default: []
   },
   sold: {
        type: Number,
        maxlength: 100,
        default: 0
   },
   continents: {
        type: Number,
        default: 1
   },
   views: {
       type: Number,
       default: 0
   },
   // 카테고리 
   categorys: {
       type: Number,
       defualt: 1
   }
}, {timestamp: true})

productSchema.index({ // 검색 비중 control-results-of-text-search
    title: 'text',
    description: 'text'
},{
    weights:{
        title: 5,
        description: 1
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }

//디비에 넣을 것들