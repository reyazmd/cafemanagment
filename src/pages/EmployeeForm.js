/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, theme, Form, Input, Button, Radio, Select, Space, Alert } from 'antd';
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
const { Content } = Layout;


const EmployeeForm = () => {
    const [form] = Form.useForm();
    const [cafelist, setCafeList] = useState([])
    const [emplist, setEmpList] = useState([])
    const [formsubmitted, setFormSubmitted] = useState(false);
    const [duplicateEmp, setDuplicateEmp] = useState(false);
    const [defaultSelection, setDefaultSelection] = useState('');
    let { id } = useParams();

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/getemployees/${id}`).then((res) => {
                if (res.data.data) {
                    const resData = res.data.data[0];
                    setDefaultSelection(resData.cafeId)
                    form.setFieldsValue({
                        name: resData.name,
                        email_address: resData.email_address,
                        phone_number: resData.phone_number,
                        gender: resData.gender,
                        days_worked: resData.days_worked,
                        cafeId: resData.cafeId
                    });
                }
            }).catch(err => console.log(err))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    useEffect(() => {
        axios.get(`http://localhost:5000/cafeslist`).then((res) => {
            if (res.data.data) setCafeList(res.data.data);
            axios.get(`http://localhost:5000/employeeslist`).then((emp) => {
                if (emp.data.data) setEmpList(emp.data.data)
            }).catch(err => console.log(err))

        }).catch(err => console.log(err))

    }, [])
    const formItemLayout =
        'horizontal'
            ? {
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 16,
                },
            }
            : null;
    const buttonItemLayout =
        'horizontal'
            ? {
                wrapperCol: {
                    span: 14,
                    offset: 4,
                },
            }
            : null;

    const onFinish = async (vals) => {
        if (!id) {
            const cafedata = cafelist.length && cafelist.find(c => c.cafeId === vals.cafeId)
            const foundEmp = emplist.length && cafedata && emplist.some(em => em.name === vals.name && em.cafeId === cafedata.name);
            if (!foundEmp) {
                const res = await axios.post(
                    "http://localhost:5000/newemployee",
                    vals
                );

                if (res.data && !res.data.error) setFormSubmitted(true)
            } else {
                setDuplicateEmp(true)
            }

        } else {
            const res = await axios.post(
                `http://localhost:5000/updateemployee/${id}`,
                vals
            );

            if (res.data && !res.data.error) setFormSubmitted(true)
        }

    }



    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const onCafeChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onCafeSearch = (value) => {
        console.log('search:', value);
    };


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
                    <Breadcrumb.Item>Employee Form</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-content"
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    {formsubmitted && (
                        <Space
                            direction="vertical"
                            style={{
                                width: '50%',
                                marginBottom: '10px'
                            }}
                        >
                            <Alert message="Your data saved successfully !" type="success" showIcon closable />
                        </Space>
                    )}
                    {duplicateEmp && (
                        <Space
                            direction="vertical"
                            style={{
                                width: '50%',
                                marginBottom: '10px'
                            }}
                        >
                            <Alert message="Duplicate user!" type="error" showIcon closable />
                        </Space>
                    )}
                    <Form
                        {...formItemLayout}
                        layout={'horizontal'}
                        form={form}

                        onFinish={onFinish}
                        validateMessages={validateMessages}
                    >

                        <Form.Item label="Employee Name" name="name"
                            rules={[
                                {
                                    required: true,
                                    min: 6,
                                    max: 10,
                                },
                            ]}>
                            <Input placeholder="Employee Name" />
                        </Form.Item>
                        <Form.Item label="Email" name="email_address"
                            rules={[
                                {
                                    required: true,
                                    type: 'email'
                                },
                            ]}>
                            <Input placeholder="Email Address" />
                        </Form.Item>

                        <Form.Item label="Phone Number" name="phone_number"
                            rules={[
                                {
                                    required: true,
                                    min: 8,
                                    max: 8,
                                },
                            ]}>
                            <Input placeholder="Phone Number" />
                        </Form.Item>
                        <Form.Item label="Gender" name="gender" rules={[
                            {
                                required: true,
                            },
                        ]}>
                            <Radio.Group>
                                <Radio value="M"> Male </Radio>
                                <Radio value="F"> Female </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="Choose your Cafe" name="cafeId" defaultValue={id && defaultSelection ? defaultSelection : ''}>
                            <Select
                                showSearch
                                placeholder="Select a cafe"
                                optionFilterProp="children"
                                onChange={onCafeChange}
                                onSearch={onCafeSearch}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={cafelist.length && cafelist.map(c => {
                                    return { value: c.cafeId, label: c.name }
                                })}
                            />
                        </Form.Item>
                        <Form.Item label="# Days Worked" name="days_worked">
                            <Input type="number" placeholder="Days worked" />
                        </Form.Item>

                        <Form.Item {...buttonItemLayout}>
                            <Button><Link to="/employee">Back</Link></Button>&nbsp;&nbsp;
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>

                </div>
            </Content>
            <FooterComponent />
        </Layout>

    );
}

export default EmployeeForm;