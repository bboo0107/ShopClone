import React, {useEffect, useState} from 'react'
import {RocketOutlined} from '@ant-design/icons';
import { Col, Card, Row } from 'antd';
import axios from 'axios';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../Utils/ImageSlider'
import CheckBox from './Sections/CheckBox';
import { categorys, price } from './Sections/Datas';
import RadioBox from './Sections/RadioBox';
import SearchBox from './Sections/SearchBox';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        categorys: [],
        price: []
    })
    const [searchTerm, setsearchTerm] = useState("")

        useEffect(() => { //componentDidMount, componentDidUpdate, componentWillUnmount를 합친것

            let body = {
                skip: Skip, // 어디서부터
                limit: Limit //몇개씩 보여줄건지
            }
            getProducts(body)            
        }, [])

        const renderCards = Products.map((product, index) => {
            return <Col lg={6} md={8} sm={24} key={index}>
                <Card                  
                    cover={<ImageSlider images={product.images}/>}
                >
                    <Meta 
                        title={product.title}
                        description={`$${product.price}`}
                    />
                </Card>
            </Col>
        })

        const getProducts = (body) => {
            axios.post('api/product/products', body)
            .then(res => {
                if(res.data.success){
                    //console.log(res.data)
                    if(body.loadMore){ // 더보기 버튼 눌렀을 때
                        setProducts([...Products, ...res.data.productInfo]) // 기존의 데이터복제 + 추가 데이터
                    } else {
                        setProducts(res.data.productInfo)
                    }
                    setPostSize(res.data.postSize)
                } else {
                    alert('데이터를 불러오지 못했습니다.')
                }
            })
        }

        // 더보기
        const loadMore = () => { 
            let skip = Skip + Limit

            let body = {
                skip: skip,
                limit: Limit,
                loadMore: true
            }
            getProducts(body)
            setSkip(skip)
        }

        const showFilterdResults = (filters) => {
            let body = {
                skip: 0,
                limit: Limit,
                filters: filters
            }
            getProducts(body)
            setSkip(0)
        }

        // 필터 검색
        const handleFilters = (filters, category) => {
            const newFilters = {...Filters}
            newFilters[category] = filters
            //console.log(filters)

            if(category === "price"){
                let priceValue = handlePrice(filters)
                newFilters[category] = priceValue // 결국 priceValues는 price의 array
            }
            
            showFilterdResults(newFilters)
            setFilters(newFilters)
        }

        const handlePrice = (value) => {
            const data = price; //Datas의 price데이터
            let array = [];

            for(let key in data){
                if(data[key]._id === parseInt(value, 10)){
                    array = data[key].array;
                    console.log(array)
                }
            }
            return array;
        }

        // 단어 검색
        const searchWord = (newSearch) => {
            //console.log(newSearch)
            let body = {
                skip: 0,
                limit: Limit,
                filters: Filters,
                searchTerm: newSearch
            }
            getProducts(body)
            setSkip(0)
            setsearchTerm(newSearch)
        }


    return (
        <div style={{width: '75%', margin: '3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h1> Coffee <RocketOutlined /></h1>
            </div>
            <br />
            {/* Filter */}
            <Row gutter={16,16}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox list={categorys} handleFilters={filters => handleFilters(filters, "categorys")}/>
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")}/>
                </Col>
            </Row>
            <br />
            {/* Search */}
            <div style={{float: 'right'}}>
                <SearchBox SearchFunction={searchWord}/>
            </div>
            <br />
            <br />
            {/* Cards */}
            <Row gutter={16, 16}>
                {renderCards}
            </Row>

            <br />
            <br />
            {PostSize >= Limit &&
                <div style={{display:'flex', justifyContent:'center'}}>
                    <button onClick={loadMore}>더보기</button>
                </div>
            }
        </div>
    )
}

export default LandingPage
