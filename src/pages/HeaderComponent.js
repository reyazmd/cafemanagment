import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { Image, Layout, Menu } from 'antd';
const { Header } = Layout;

const HeaderComponent = () => {

    const location = useLocation();


    return (
        <Header>
            <div className="logo" > <Image
                src="../logo.png"
            /></div>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[location.pathname]}
                selectable={true}
            >
                <Menu.Item key="/"> <Link to="/" >Cafe</Link></Menu.Item>
                <Menu.Item key="/employee"> <Link to="/employee" >Employees</Link></Menu.Item>
            </Menu>
        </Header>
    );
}

export default HeaderComponent