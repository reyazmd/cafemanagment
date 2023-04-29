import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout,  theme, Table, Input, Button, Space } from 'antd';
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import { Link } from "react-router-dom";
import axios from "axios";
const { Content } = Layout;
const { Search } = Input;

const Employee = () => {
    const [emplist , setEmpList] = useState([])

    useEffect(()=>{
        axios.get(`http://localhost:5000/employeeslist`).then((res) => {
            if(res.data.data) setEmpList(res.data.data)
        }).catch(err=> console.log(err))
    },[])
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'name',
            sorter: {
                compare: (a, b) => a.name - b.name,
                multiple: 3,
            },
            key:'empname'
        },
        {
            title: 'Email Address',
            dataIndex: 'email_address',
           key:'email'
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key:'phone'
        },
        {
            title: 'Cafe Name',
            dataIndex: 'cafeId',
            key:'cafename'
        },
        {
            title: 'Days Worked',
            dataIndex: 'days_worked',
            sorter: {
                compare: (a, b) => a.days_worked - b.days_worked,
                multiple: 1,
            },
            key:'worked'
        },

        {
            title: 'Action',
            key:'action',
            render: (_, record) => (
                <Space size="middle">
                  <Link to={`/employeeform/${record.id}`}>Edit</Link>
                  <span onClick={()=>deleteEmployee(record.id)} style={{color:'red', cursor:'pointer'}}>Delete</span>
                </Space>
              ),
        },
    ];
    const data = emplist;

    const onSearch = async(val) => {
        if(val){
            let res = axios.get(`http://localhost:5000/searchemployees/${val}`);
            let resdata = await res;
            if(resdata.data && resdata.data.data.length){
                setEmpList(resdata.data.data)
            }else{
                setEmpList([])
            }
        }else{
            let res = await axios.get(`http://localhost:5000/employeeslist`);
            if(res.data.data) setEmpList(res.data.data)
        }
       
    }

    const deleteEmployee = async(id) =>{
        // eslint-disable-next-line no-restricted-globals
        const result = confirm("Want to delet?")
        if(result){
            await axios.post(`http://localhost:5000/deleteemployee/${id}`);
        }
    }

    return(
        <Layout className="layout">
            <HeaderComponent />
            <Content
                style={{
                    padding: '0 50px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Employees</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-content"
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    <Search
                        placeholder="search employee"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                        style={{ marginBottom:'10px' }}
                    />
                    <Button type="primary" ><Link to="/employeeform">+ Add Employee</Link></Button>
                    <Table columns={columns} dataSource={data} rowKey={(record) => record.name} />
                </div>
            </Content>
            <FooterComponent />
        </Layout>
    );
}

export default Employee;