import React, { useState, useEffect, useContext } from "react";
import { Row, Card, Image, Button, Modal, Alert } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from "axios";
import Details from "./Details";
import moment from "moment";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Myorder = () => {
    const steps = ['รับออเดอร์แล้ว', 'ทำอาหารเสร็จแล้ว', 'กำลังจัดส่ง', 'จัดส่งสำเร็จ'];
    const [activeStep, setActiveStep] = React.useState(4);
    const [skipped, setSkipped] = React.useState(new Set());
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    let messengerId = localStorage.getItem("messangerId");
    const [myOrder, setMyOrder] = useState([]);
    const getMyOrder = () => {

        axios.get(`${import.meta.env.VITE_BAKUP_URL}/bills/myorder?messengerId=${messengerId}`)
            .then(res => {
                if (res.status === 200) {
                    setMyOrder(res.data);
                }

            })
    }

    useEffect(() => {
        getMyOrder();
    }, [])


    useEffect(() => {

        const interval = setInterval(() => {
            getMyOrder();
        }, 5000); // ดึงข้อมูลจาก API ทุกๆ 5 วินาที

        return () => clearInterval(interval);
    }, [])
    return (<>
        <Card>

            <Card.Body>
                <Card.Title className="text-center mb-3">
                    คำสั่งซื้อของฉัน
                </Card.Title>
                <Tabs
                    defaultActiveKey="home"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="home" title="คำสั่งซื้อใหม่">
                        {
                            myOrder?.map(item => {
                                if (item.statusOrder === "รับออเดอร์แล้ว") {

                                    return (

                                        <>
                                            <Card className="mb-4">
                                                <Card.Body>
                                                    <h6>หมายเลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()} <br />  วันที่สั่งออเดอร์ { }
                                                        {moment(item.Date_times).format('YYYY-MM-DD')}
                                                        &nbsp;  เวลา {moment(item.Date_times).format('HH:mm')} น.
                                                    </h6>
                                                 
                                                    <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                    <h5 style={{ fontSize: '18px' }}>รวมทั้งหมด {item.amount} บาท</h5>
                                                  

                                                    <Row>

                                                        <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
                                                            {steps.map((label, index) => {
                                                                const stepProps = {};
                                                                const labelProps = {};

                                                                if (isStepSkipped(index)) {
                                                                    stepProps.completed = false;
                                                                }
                                                                return (
                                                                    <Step key={label} {...stepProps}>
                                                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                                                    </Step>
                                                                );
                                                            })}
                                                        </Stepper>
                                                    </Row>


                                                </Card.Body>

                                            </Card>
                                        </>)
                                }

                            })
                        }
                    </Tab>
                    <Tab eventKey="profile" title="ติดตามสถานะคำสั่งซื้อ">
                        {
                            myOrder.map(item => {
                                if (item.statusOrder !== "รับออเดอร์แล้ว") {
                                    return (<>
                                        <Card className="mb-4">
                                            <Card.Body>
                                                <p> หมายเลขออเดอร์ {item.bill_ID.slice(-5).toUpperCase()} <br />  วันที่สั่งออเดอร์ { }
                                                    {moment(item.Date_times).format('YYYY-MM-DD')}
                                                    &nbsp;  เวลา {moment(item.Date_times).format('HH:mm')} น.
                                                </p>

                                                <Details bill_ID={item.bill_ID} status={item.statusOrder} />
                                                <p style={{ fontSize: '18px' }}>รวมทั้งหมด {item.amount} บาท</p>
                                                <Alert> <h5>  {item.statusOrder}</h5></Alert>
                                            </Card.Body>

                                        </Card>
                                    </>)
                                }
                            })

                        }
                    </Tab>

                </Tabs>


                {myOrder.length === 0 && (

                    <Alert variant="danger text-center">ยังไม่มีคำสั่งซื้อ</Alert>
                )}
            </Card.Body>
        </Card>
    </>)
}

export default Myorder;