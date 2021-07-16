import React, { useState } from 'react'
import {Button, Form, Input } from  'antd';
import FileUpload from '../Utils/FileUpload';
import Axios from 'axios';


const {TextArea} = Input;

const Continents = [
    {key:1, value:"과테말라"},
    {key:2, value:"에티오피아"},
    {key:3, value:"브라질"},
    {key:4, value:"케냐"},
    {key:5, value:"콜롬비아"},
    {key:6, value:"엘살바도르"},
    {key:7, value:"블렌드"},
]

const Categorys = [
    {key:1, value:"원두",},
    {key:2, value:"커피용품",},
    {key:3, value:"커피머신",},
    {key:4, value:"디저트"},
]

export default function UploadProduct(props) {

    const [Title, setTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [Price, setPrice] = useState(0)
    const [Continent, setContinent] = useState(1) //index 
    const [Images, setImages] = useState([]) //  FileUpload에서 받아온 이미지 정보
    const [Category, setCategory] = useState(1)

    const titleChangeHandler = (e) => {
        setTitle(e.currentTarget.value)
    }

    const descChangeHandler = (e) => {
        setDescription(e.currentTarget.value)
    }

    const priceChangeHandler = (e) => {
        setPrice(e.currentTarget.value)
    }

    const continentChangeHandler = (e) => {
        setContinent(e.currentTarget.value)
    }

    const categoryChangeHandler = (e) => {
        setCategory(e.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(!Title || !Description || !Price || !Continent || !Images){
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }

        const body = {
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            continents: Continent,
            categorys: Category
        }

        Axios.post('/api/product', body)
        .then(res => {
            console.log(res.data)
            if(res.data.success){
                alert('상품 등록에 성공했습니다.')
                props.history.push('/');
            } else {
                alert('상품 등록에 실패했습니다.')
            }
        })
    }

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto"}}>
            <div style={{ textAlign: "center", marginBottom: "2rem"}}>
                <h2> 상품 업로드 </h2>
            </div>
            <br />
            <br />

            <Form onSubmit={submitHandler}>
                {/* DropZone */}
                {/* FileUpload에서 받은 이미지 정보 */}
                <FileUpload refreshFunction={updateImages}/>
                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={Title}/>
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descChangeHandler} value={Description} style={{height:'150px'}}/>
                <br />
                <br />
                <label>가격($)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price}/>
                <br />
                <br />
                {/* 카테고리 1 원두면 원산지 나오게...수정필요**********************************************************/}
                <select onChange={categoryChangeHandler} value={Category} >
                    {Categorys.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                        ))}
                </select>
                <br />
                <br />                
                {Category === 1 ?
                    <select onChange={continentChangeHandler} value={Continent} >
                        {Continents.map(item => (
                            <option key={item.key} value={item.key}>{item.value}</option>
                        ))}
                    </select>   
                    :
                    <></>                 
            }
            {/* ********************************************************************************************************/}
                <br />
                <br />
                <Button type="submit" onClick={submitHandler}>
                    저  장
                </Button>
            </Form>
        </div>
    )
}
