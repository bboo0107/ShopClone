import React, {useState, useEffect} from 'react'
import { Input, Form, Button } from 'antd';
import "./MyPage.css";
import { useSelector } from "react-redux";

export default function MyPage() {
    
    const user = useSelector(state => state.user)

    let name = user.userData&&user.userData.name
    
    const [Name, setName] = useState('')
    const [Password, setPassword] = useState('')
    //const [confirmpassword, setconfirmpassword] = useState('')

    //이름 받아오기
    useEffect(() => {
        setName(name)
        //console.log("Name",Name)
    }, [name])

    //user.userData && user.userData.name

    const changeName = (e) => {
        //console.log(e.target.value)
        setName(e.target.value)
    }

    const changePassword = (e) => {
        setPassword(e.target.value)
    }

    const confirmPassword = (e) => {
        //password랑 같은지 확인
        //e.target.value === Password ? true : false
        
    }
    return (
        <div style={{width:'70%', alignContent:'center', margin:'0 auto'}}>
            <div style={{marginTop:'100px', width:'100%'}}>
            <h1>나의 정보</h1>
            <Form>
            <table>
                <tbody>
                <tr>
                    <th>이름</th>
                    <td><Input style={{width:'200px'}} onChange={changeName} value={Name}/></td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>{user.userData && user.userData.email}</td>
                </tr>
                <tr>
                    <th>비밀번호 변경</th>
                    <td><Input style={{width:'200px'}} onChange={changePassword} value={Password}/></td>
                    {/* 기존 비밀번호랑 다르게 작성 */}
                </tr>
                <tr>
                    <th>비밀번호 확인</th>
                    <td><Input style={{width:'200px'}} onChange={confirmPassword}/></td>
                </tr>
                <tr>
                    <td>
                        <br />
                    <Button type="submit" style={{width:'150px'}}>
                        저  장
                    </Button>
                    </td>
                </tr>
                </tbody>
            </table>
            </Form>
            </div>
        </div>
    )
}


