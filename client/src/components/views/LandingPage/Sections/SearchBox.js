import React, {useState} from 'react'
import { Input } from 'antd';

const { Search } = Input;
export default function SearchBox(props) {

    const [SearchWord, setSearchWord] = useState("")

    const searchHandler = (e) => {
        setSearchWord(e.target.value)
        props.SearchFunction(e.target.value)
    }

    return (
        <div>
           <Search
                placeholder="input search text" 
                onChange={searchHandler}
                style={{ width: 200 }}
                value={SearchWord}
                /> 
        </div>
    )
}
