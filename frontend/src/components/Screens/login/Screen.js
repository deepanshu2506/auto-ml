import {
    Button,
    Col,
    Form,
    Row,
    InputGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import React from "react";

import LottieAnimation from '../../../Lottie';
import home from '../../../Animation/login3.json';

import { connect } from 'react-redux';
import { userActions } from '../../../actions';

const LoginScreen = (props) => {
    // useEffect(()=>{
    //     props.logout();
    // },[]);

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
        const { email, password } = form
        const newErrors = {}
        if (!email || email === '') newErrors.email = 'Please enter your email id!'
        else if (!re.test(email))
            newErrors.email = 'Please enter valid email id!'
        else
            newErrors.email = ''
        if (!password || password === '')
            newErrors.password = ' Please enter password!'
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
            if (newErrors.email === '' && newErrors.password === ''){
                const { email, password } = form
                props.login({email, password});
            }
        }
    }

    return (
            <Row className={styles.rowStyle}>
                    <Col s="8" md="6" className={styles.anime}>
                        <LottieAnimation lotti={home} height={100} width={100} />
                    </Col>
                    <Col s="8" md="5" className={styles.inner}>
                        <Form
                            onSubmit={handleSubmit}
                            className={`w-100`}
                        >
                            <h3>LOGIN</h3>
                            <Col>
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
                                    LOGIN
                                </Button>
                            </Col>
                        </Form>
                    </Col>
            </Row>
    );

};

function mapState(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
  }
   
  const actionCreators = {
    login: userActions.login,
    logout: userActions.logout
  };
   
  const connectedLoginPage = connect(mapState, actionCreators)(LoginScreen);
  export { connectedLoginPage as LoginScreen };


