import React, {useState} from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Modal, Select, Button  } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';

const { Option } = Select;

export default function ModalPage(props) {
    const dispatch = useDispatch();
    const [Value, setValue] = useState(0)

    const NumberOption = (e) => {
        //console.log(e)
        setValue(e) 
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

        const showModal = () => {
            setIsModalVisible(true);
        };

        const handleOk = () => {
            setIsModalVisible(false);
        };

        const handleCancel = () => {
            setIsModalVisible(false);
        };

        const addCart = () => {
            //console.log("value",Value)
            dispatch(addToCart(props.product._id,Value))
            setIsModalVisible(false);
        }

    return (
        <div>
            <ShoppingCartOutlined style={{float: 'right', fontSize: '25px'}} onClick={showModal}/>
            <Modal title={props.product.title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} style={{backgroundColor:'rgba(0, 0, 0, 0.6)'}}
                 footer={[
                    <Button key="back" onClick={handleCancel}>
                      Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={addCart}>
                      Submit
                    </Button>,
                  ]}
            >
                <Select defaultValue="수량" style={{ width: 480, float: 'right' }} onChange={NumberOption}> 
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                </Select>
            </Modal>
                        {/* 클릭시 수량 체크 팝업, 카트로 이동 */}
        </div>
    )
}


// 수량 체크 옵션 장바구니에 넣기 모달창닫기