import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { decrement, increment } from '../../../_actions/user_actions';


import "./UserCardBlock.css";

export default function UserCardBlock(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)

    const renderCartImage = (images) => {
        if(images.length > 0){
            let image = images[0] //첫번째 이미지 불러와서 넣기
            return `http://localhost:5000/${image}` 
        }
    }

    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index}>
                <td>
                    <img style={{width: '70px'}} alt="product" src={renderCartImage(product.images)} />
                </td>
                <td>
                    {product.title} 
                </td>
                <td>
                    <button onClick={()=>dispatch(decrement(product))} min={1}>-</button>
                    <input value={product.quantity} style={{width:'30px'}}></input>  
                    <button onClick={()=>dispatch(increment(product))}>+</button>
                    {/* {product.quantity} */}
                </td>
                <td>                    
                   $ {product.price*product.quantity}                  
                </td>
                <td>
                    <button onClick={() => props.removeItem(product._id)}> {/* 부모컴퍼터넌트에서 처리 */}
                        Remove
                    </button>
                </td>
            </tr>
        ))
    )

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Title</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

