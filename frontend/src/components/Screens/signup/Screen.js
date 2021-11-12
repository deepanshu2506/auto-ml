import {
    Button,
    Col,
    Row,
    Form,
    InputGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import React from "react";

import LottieAnimation from '../../../Lottie';
import home from '../../../Animation/register.json';

import { connect } from 'react-redux';
import { userActions } from '../../../actions';

const SignupScreen = (props) => {
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})
    const [validate, setValidate] = useState(false)

    useEffect(() => {
        if (validate) {
            const newErrors = findFormErrors()
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors)
            }
        }
    }, [form]);

    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        })
    }

    const findFormErrors = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { username, email, password } = form
        const newErrors = {}
        if (!username || username === '') newErrors.username = 'Please enter your username!'
        else if (username.length < 4 || username.length > 15)
            newErrors.username = 'Username must be of length ranging from 4 to 15!'
        else
            newErrors.username = ''
        if (!email || email === '') newErrors.email = 'Please enter your email id!'
        else if (!re.test(email))
            newErrors.email = 'Please enter valid email id!'
        else
            newErrors.email = ''
        if (!password || password === '')
            newErrors.password = ' Please enter password!'
        else if (password.length < 8 || password.length > 15)
            newErrors.password = ' Password must be of length ranging from 8 to 15!'
        else if (password.search(/[A-Z]/) < 0)
            newErrors.password = ' Password must contain at least one uppercase letter!'
        else if (password.search(/[a-z]/) < 0)
            newErrors.password = ' Password must contain at least one lowercase letter!'
        else if (password.search(/[0-9]/) < 0)
            newErrors.password = ' Password must contain at least one digit!'
        else if (password.search(/[!@#$%^&*]/) < 0)
            newErrors.password = ' Password must contain at least one special character!'
        else
            newErrors.password = ''
        return newErrors
    }

    const handleSubmit = e => {
        e.preventDefault()
        setValidate(true)
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            if (newErrors.username === '' && newErrors.email === '' && newErrors.password === '')
            {
                const { username, email, password } = form
                props.register({username, email, password});
            }
            // e.target.reset();
            // setForm({});
        }
    }

    return (
            <Row className={styles.rowStyle}>
                <Col s="8" md="6" className={styles.anime}>
                    <LottieAnimation lotti={home} height={500} width={500} />
                </Col>
                <Col s="8" md="5"  className={styles.inner}>
                    <Form
                        onSubmit={handleSubmit}
                        className={`w-100`}
                    >
                        <h3>REGISTER</h3>
                        <Col>
                            <Form.Group as={Col} md="12" controlId="username">
                                <Form.Label>User Name</Form.Label>
                                <InputGroup >
                                    <Form.Control
                                        type="text"
                                        placeholder="User Name"
                                        aria-describedby="inputGroupPrepend"
                                        onChange={e => setField('username', e.target.value)}
                                        isInvalid={!!errors.username}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.username}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="12" controlId="email">
                                <Form.Label>Email ID</Form.Label>
                                <InputGroup >
                                    <Form.Control
                                        type="text"
                                        placeholder="Email ID"
                                        aria-describedby="inputGroupPrepend"
                                        onChange={e => setField('email', e.target.value)}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="12" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <InputGroup >
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        aria-describedby="inputGroupPrepend"
                                        onChange={e => setField('password', e.target.value)}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Button block type="submit">
                                CREATE ACCOUNT
                            </Button>
                        </Col>
                    </Form>
                </Col>
            </Row>
    );

};

function mapState(state) {
    const { registering } = state.register;
    return { registering };
    }
     
    const actionCreators = {
    register: userActions.register
    }
     
const connectedRegister = connect(mapState, actionCreators)(SignupScreen);
export { connectedRegister as SignupScreen };

