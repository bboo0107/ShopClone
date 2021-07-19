import React, {useEffect, useState} from 'react'
import {RocketOutlined} from '@ant-design/icons';
import { Col, Card, Row, Modal } from 'antd';
import axios from 'axios';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../Utils/ImageSlider'
import CheckBox from './Sections/CheckBox';
import { categorys, price } from './Sections/Datas';
import RadioBox from './Sections/RadioBox';
import SearchBox from './Sections/SearchBox';
import { ShoppingCartOutlined } from '@ant-design/icons';
import SortBox from './Sections/SortBox';
// import "antd/dist/antd.css";

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

        // const [isModalVisible, setIsModalVisible] = useState(false);

        // const showModal = () => {
        //     setIsModalVisible(true);
        // };

        // const handleOk = () => {
        //     setIsModalVisible(false);
        // };

        // const handleCancel = () => {
        //     setIsModalVisible(false);
        // };


        const renderCards = Products.map((product, index) => {
            return <Col lg={6} md={8} sm={24} key={index}>
                <Card                  
                    cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} auto/></a>}
                >
                    <Meta 
                        title={product.title}
                        description={`$${product.price}`}
                    />
                        {/* 모달창 */}
                        {/* <ShoppingCartOutlined style={{float: 'right', fontSize: '25px'}} onClick={showModal}/> */}
                        {/* <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} style={{backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Modal> */}.
                        {/* 클릭시 수량 체크 팝업, 카트로 이동 */}
                </Card>
                <br />
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
            // console.log("filter",filters)
            // console.log("category",category)

            if(category === "price"){
                let priceValue = handlePrice(filters)
                newFilters[category] = priceValue // 결국 priceValues는 price의 array
            }
            
            showFilterdResults(newFilters)
            setFilters(newFilters)
            //console.log(Filters)
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
            <div style={{float: 'left'}}>
                <SortBox handleFilters={filters => handleFilters(filters, "sort")}/>
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
