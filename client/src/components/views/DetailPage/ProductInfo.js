import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../_actions/user_actions';
import { Descriptions, Select, Button } from 'antd';
const { Option } = Select;

export default function ProductInfo(props) {
    //console.log("detail",props.detail)

    const [Value, setValue] = useState(0)

    const NumberOption = (e) => {
        console.log(e)
        setValue(e)
    }

    let totalPrice = props.detail.price * Value

    const dispatch = useDispatch();

    const clickHandler = () => {
        //필요한 정보를 Cart필드에 넣어준다 => user에 관련된건 redux사용
        //user_actions
        dispatch(addToCart(props.detail._id,Value))
        //보여주는건 없음  res안해도된다
    }

    return (
        <div>
            <Descriptions title={props.detail.title} bordered>
                <Descriptions.Item label="Price" span={3}>${props.detail.price}</Descriptions.Item> 
                <Descriptions.Item label="Made in" span={3}>대한민국</Descriptions.Item>
            </Descriptions>
            <br />
            <Select defaultValue="수량" style={{ width: 480, float: 'right' }} onChange={NumberOption}> 
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
            </Select>
            <br />
            <br />
            <br />
            <div style={{float: 'right'}}>
                <h2>총 상품 금액 : $ {totalPrice}</h2>
                {/* 가격 * 수량 */}
            </div>
            <br />
            <br />
            <br />
            <div style={{display: 'flex', justifyContent: 'center', width: '300px', float: 'right'}}>
                <Button size= "large" shape="round" type="danger" block onClick={clickHandler}> 
                    Add to Cart
                </Button>
            </div>
        </div>
    )
}
