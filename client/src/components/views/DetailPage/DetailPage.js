import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductImage from './ProductImage'
import {Row, Col} from 'antd';
import ProductInfo from './ProductInfo';

export default function DetailPage(props) {

    const productId = props.match.params.productId
    const [Product, setProduct] = useState({})

    useEffect(() => {
        Axios.get(`/api/product/product_id?id=${productId}`)
        .then(res => {
            console.log(res.data.product)
            setProduct(res.data.product[0])
        })
    }, [])

    return (
        <div style={{width: '80%', minHeight:'300px', maxHeight: '1200px', alignContent: 'center', margin: '0 auto'}}>
            <div style={{width: '80%', height: '600px', alignContent: 'center', margin: '0 auto'}}>
                <div style={{width: '50%', height: '550px', float:'left', margin: '4rem auto'}}>
                    <Col sm={20}>
                        {/* ProductImage */}
                        <ProductImage detail={Product}/>
                    </Col>
                </div>
                <div style={{width: '50%', height: '550px', float:'right', margin: '0 auto'}}>
                    <div style={{width: '100%', height: '100px', display:'flex', justifyContent:'center', margin: '4rem auto'}}>
                        <ProductInfo detail={Product}/>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div style={{width: '80%', minHeight: '300px', maxheight: '600px', alignContent: 'center', margin: '4rem auto'}}>
                {/* <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>상세정보</h2> */}
                {Product.description && Product.description.split("\n").map((line, index) => {
                    return (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    )
                })}
            </div>
        </div>
    )
}
