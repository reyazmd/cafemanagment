import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, theme, Table, Input, Button, Image, Space } from 'antd';
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import { Link } from "react-router-dom";
import axios from "axios";
const { Content } = Layout;
const { Search } = Input;

const Cafe = () => {
    const [cafelist, setCafeList] = useState([])

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        axios.get(`http://localhost:5000/cafeslist`).then((res) => {
            if (res.data.data) {
                const resData = res.data.data;
                resData.length && resData.map((r) => {
                    if (r.logo) {
                        r.logo = <Image
                            width={50}
                            height={50}
                            src={r.logo}
                        />
                    } else {
                        r.logo = <Image
                            width={50}
                            height={50}
                            src="error"
                        />
                    }
                    return r;
                })

                setCafeList(resData)
            }
        }).catch(err => console.log(err))
    }, [])
    const columns = [
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo'
        },
        {
            title: 'Cafe Name',
            dataIndex: 'name',
            sorter: {
                compare: (a, b) => a.name - b.name,
                multiple: 3,
            },
            key: 'name'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'desc'
        },
        {
            title: 'Employees',
            dataIndex: 'total_employees',
            sorter: {
                compare: (a, b) => a.total_employees - b.total_employees,
                multiple: 1,
            },
            render: (text) => <Link to="/employee">{text}</Link>,
            key: 'employee'
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                  <Link to={`/cafeform/${record.cafeId}`}>Edit</Link>
                  <span onClick={()=>deleteCafe(record.cafeId)} style={{color:'red', cursor:'pointer'}}>Delete</span>
                </Space>
              ),
        },
    ];
    const data = cafelist;

    const onSearch = async(val) => {
        if(val){
            let res = axios.get(`http://localhost:5000/searchcafes/${val}`);
            let resdata = await res;
            if(resdata.data && resdata.data.data.length){
                const newData = resdata.data.data;
                newData.length && newData.map((r) => {
                    if (r.logo) {
                        r.logo = <Image
                            width={50}
                            height={50}
                            src={r.logo}
                        />
                    } else {
                        r.logo = <Image
                            width={50}
                            height={50}
                            src="error"
                        />
                    }
                    return r;
                })
                setCafeList(newData)
            }else{
                setCafeList([])
            }
        }else{
            let res = await axios.get(`http://localhost:5000/cafeslist`);
            let resdata = await res;
            if(resdata.data && resdata.data.data.length){
                const newData = resdata.data.data;
                newData.length && newData.map((r) => {
                    if (r.logo) {
                        r.logo = <Image
                            width={50}
                            height={50}
                            src={r.logo}
                        />
                    } else {
                        r.logo = <Image
                            width={50}
                            height={50}
                            src="error"
                        />
                    }
                    return r;
                })
                setCafeList(newData)
            }
        }
        
    }

    const deleteCafe = async(id) => {
            // eslint-disable-next-line no-restricted-globals
            const result = confirm("Want to delet?")
            if(result){
                await axios.post(`http://localhost:5000/deletecafe/${id}`);
            }
    }

    return (
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
                    <Breadcrumb.Item>Cafe</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-content"
                    style={{
                        background: colorBgContainer,
                    }}
                >

                    <Search
                        placeholder="search your cafe by location"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                        style={{ marginBottom: '10px' }}
                    />
                    <Button type="primary" ><Link to="/cafeform">+ Add Cafe</Link></Button>
                    <Table columns={columns} dataSource={data} rowKey={(record) => record.name} />

                </div>
            </Content>
            <FooterComponent />
        </Layout>

    );
}

export default Cafe;