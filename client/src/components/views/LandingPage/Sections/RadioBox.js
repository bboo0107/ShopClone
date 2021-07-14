import React, {useState} from 'react'
import { Collapse, Radio } from 'antd';
const { Panel } = Collapse;

export default function RadioBox(props) {

    const [Value, setValue] = useState(0)

     const randerRadioBox = () => 
         props.list && props.list.map(value => (
                <Radio key={value._id} value={value._id}>{value.name}</Radio>
                ))         
                
    // 내가 선택한 radio값이 Value로 들어감 (하나만 선택됨)
     const handleChange = (e) => {
        setValue(e.target.value)
        props.handleFilters(e.target.value) //부모컴퍼넌트로 보냄
     }

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Price" key="1">
                    <Radio.Group onChange={handleChange} value={Value}>
                        {randerRadioBox()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

