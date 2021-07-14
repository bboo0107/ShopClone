import React, {useState} from 'react'
import { Collapse, Checkbox } from 'antd';
const { Panel } = Collapse;

export default function CheckBox(props) {
    const [Checked, setChecked] = useState([])
    const handleToggle = (value) => {
        const currentIndex = Checked.indexOf(value)
        //console.log(currentIndex)
        const newChecked = [...Checked]

        if(currentIndex === -1){
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        //console.log(newChecked)
        props.handleFilters(newChecked)
    }

    const renderChaeckboxLists = () => props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={() => handleToggle(value._id)} checked={Checked.indexOf(value._id) === -1 ? false : true}/>
            <span> {value.name}  </span>
        </React.Fragment>
    ))
    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="카테고리" key="1">
                    {renderChaeckboxLists()}                    
                </Panel>
            </Collapse>
        </div>
    )
}
