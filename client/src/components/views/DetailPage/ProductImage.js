import React, { useState, useEffect } from 'react'
import ImageGallery from 'react-image-gallery';

export default function ProductImage(props) {

    const [Image, setImage] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){
            let images = []
            props.detail.images.map(item => {
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImage(images)
        }
    }, [props.detail])

    return (
        <div>
            <ImageGallery items={Image} autoPlay/>
        </div>
    )
}

//https://www.npmjs.com/package/react-image-gallery