/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Badge } from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
   
    return (
      <Menu mode={props.mode} >
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else if(user.userData && user.userData.role === 0){ //관리자 아니면 진입조차 막기
    //console.log(user.userData)
    //console.log(props)
    return (
      <Menu mode={props.mode}>

        <Menu.Item key="upload">
        <a href="/product/upload">Upload</a>
        </Menu.Item>

        <Menu.Item key="cart" style={{paddingBottom: 3}}>
          <Badge count={user.userData && user.userData.cart.length}>
            <a href="/user/cart" style={{marginRight: -22, color:'#667777'}}>
              <ShoppingCartOutlined style={{fontSize: 30, marginBottom: 3}} />
            </a>
          </Badge>
        </Menu.Item>

        <SubMenu title={<span>My Page</span>}>
          <MenuItemGroup >
            <Menu.Item key="setting:1">##</Menu.Item>
            <Menu.Item key="setting:2">##</Menu.Item>
          </MenuItemGroup>
        </SubMenu>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
        
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>

        <Menu.Item key="cart" style={{paddingBottom: 3}}>
          <Badge  count={user.userData && user.userData.cart.length}>
            <a href="/user/cart" style={{marginRight: -22, color:'#667777'}}>
              <ShoppingCartOutlined style={{fontSize: 30, marginBottom: 3}} />
            </a>
          </Badge>
        </Menu.Item>

        <SubMenu title={<span>My Page</span>}>
          <MenuItemGroup >
            <Menu.Item key="setting:1">
              <a href="/user/mypage">나의 정보</a>
            </Menu.Item>
            <Menu.Item key="setting:2">
            <a href="#">주문 내역</a>
            </Menu.Item>
          </MenuItemGroup>
        </SubMenu>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
        
      </Menu>
    )
  }

}

export default withRouter(RightMenu);

