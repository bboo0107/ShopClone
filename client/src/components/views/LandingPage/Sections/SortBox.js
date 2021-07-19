import React, {useState} from 'react'
import { Collapse, Radio } from 'antd';
const { Panel } = Collapse;

export default function RadioBox(props) {

    const [Value, setValue] = useState(1)
  
                
    // 내가 선택한 radio값이 Value로 들어감 (하나만 선택됨)
     const handleChange = (e) => {
        setValue(e.target.value)
        props.handleFilters(e.target.value)
     }

    return (
        <div>
                    <Radio.Group onChange={handleChange} value={Value}>
                        <Radio value={1}>최신순</Radio>
                        <Radio value={2}>가격 낮은순</Radio>
                        <Radio value={3}>가격 높은순</Radio>
                        <Radio value={4}>인기순</Radio>
                    </Radio.Group>
        </div>
    )
}

