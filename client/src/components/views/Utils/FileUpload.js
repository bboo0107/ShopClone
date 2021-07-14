import React, {useState} from 'react'
import Dropzone from 'react-dropzone'
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function FileUpload(props) {

    const [Images, setImages] = useState([])
    
    const dropHandler = (files) => {
            let formData = new FormData(); // 업로드할 파일에 대한 정보
        
            const config = {
                header: { 'content-type': 'multipart/form-data'}
            }
            formData.append("file", files[0]);  // 파일 정보 저장

            axios.post('/api/product/image', formData, config) // 요청 => index에서 router로 돌려서 요청 처리
                .then(res => {
                    if(res.data.success){
                            console.log(res.data)
                            setImages([...Images, res.data.filePath]) // 배열로 담아주기!!!!!!
                            props.refreshFunction([...Images, res.data.filePath])
                        } else {
                            alert('파일을 저장하는데 실패했습니다.')
                        }

                })
    }

    // 이미지 클릭시 삭제
    const removeImage = (image) => {
        //console.log(image)
        const currentImage = Images.indexOf(image)
        let newImages = [...Images]
        newImages.splice(currentImage, 1)
        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{ display:"flex", justifyContent: "space-between"}}>
            <Dropzone onDrop={dropHandler}>
            {({getRootProps, getInputProps}) => (
                <div
                    style={{
                        width: 300, height: 240, border: "1px solid lightgray", display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                    {...getRootProps()}>
                    <input {...getInputProps()} />
                    <PlusOutlined style={{ fontSize: '3rem' }}/>
                </div>
            )}
            </Dropzone>  

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll'}}>
                {Images.map((image, index) => (
                    <div key={index} onClick={()=>removeImage(image)}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px'}} src={`http://localhost:5000/${image}`}/>
                    </div>
                ))}                
            </div>       
        </div>
    )
}


// https://www.npmjs.com/package/react-dropzone