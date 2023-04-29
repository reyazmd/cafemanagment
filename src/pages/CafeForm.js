/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, theme, Form, Input, Button, Alert, message, Space } from 'antd';
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
const { Content } = Layout;


const CafeForm = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState();
   // const [editform, setEditForm] = useState();
    const [formsubmitted, setFormSubmitted] = useState(false);
    let { id } = useParams();
   
    useEffect(()=>{
        if(id){
        axios.get(`http://localhost:5000/cafe/${id}`).then((res)=>{
        if(res.data.data) {
           // setEditForm(res.data.data[0])
            const resData = res.data.data[0];
            form.setFieldsValue({
                name: resData.name,
                description:resData.description,
                location:resData.location,
                logo: resData.logo
              });
        }
        }).catch(err => console.log(err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const {
        token: { colorBgContainer },
    } = theme.useToken();

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
        
        const formData = new FormData();
        formData.append("image", fileList);
        formData.set("name", vals.name);
        formData.set("description", vals.description);
        formData.set("location", vals.location);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            if(!id){
                const res = await axios.post(
                    "http://localhost:5000/newcafe",
                    formData, config
                );
    
                if (res.data && !res.data.error) setFormSubmitted(true)
            }else{
                const res = await axios.post(
                    `http://localhost:5000/updatecafe/${id}`,
                    formData, config
                );
    
                if (res.data && !res.data.error) setFormSubmitted(true)
            }
            
            return false;
        } catch (error) {
            setFormSubmitted(false)
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

    const onFileChange = e => {

        const file = e.target.files[0];
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false
        }
        if (isJpgOrPng && isLt2M) setFileList(file)

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
                    <Breadcrumb.Item>Cafe Form</Breadcrumb.Item>
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
                    <Form
                        {...formItemLayout}
                        layout={'horizontal'}
                        form={form}
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                    >

                        <Form.Item label="Cafe Name" name="name" 
                            rules={[
                                {
                                    required: true,
                                    min: 6,
                                    max: 10,
                                },
                            ]}>
                            <Input placeholder="Cafe Name" />
                        </Form.Item>
                        <Form.Item label="Description" name="description"
                            rules={[
                                {
                                    min: 0,
                                    max: 250,
                                },
                            ]}>
                            <Input placeholder="Description" />
                        </Form.Item>
                        <Form.Item label="Logo" >
                            <Input type="file" name="image" onChange={onFileChange} />
                        </Form.Item>
                        <Form.Item label="Location" name="location"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}>
                            <Input placeholder="Location" />
                        </Form.Item>

                        <Form.Item {...buttonItemLayout}>
                            <Button><Link to="/">Back</Link></Button>&nbsp;&nbsp;
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>

                </div>
            </Content>
            <FooterComponent />
        </Layout>

    );
}

export default CafeForm;