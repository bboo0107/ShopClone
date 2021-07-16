import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
      <a href="/">Home</a>
    </Menu.Item>
    {/* <SubMenu title={<span>상품 카테고리</span>}>
      <MenuItemGroup >
        <Menu.Item key="setting:1">원두</Menu.Item>
        <Menu.Item key="setting:2">커피용품</Menu.Item>
        <Menu.Item key="setting:3">커피머신</Menu.Item>
        <Menu.Item key="setting:4">디저트</Menu.Item>
      </MenuItemGroup>
    </SubMenu> */}
  </Menu>
  )
}

export default LeftMenu