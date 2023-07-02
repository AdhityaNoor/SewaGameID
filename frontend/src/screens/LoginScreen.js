import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import Spinner from '../components/layout/Spinner'
import { login, register } from '../actions/userActions'
import GoogleLogin from 'react-google-login';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const [googleName, setGoogleName] = useState('')
  const [googleEmail, setGoogleEmail] = useState('')
  const [googleId, setGoogleId] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }

    if (error === 'Email atau Password tidak sesuai' && googleName !== '') {
      dispatch(register(googleName, googleEmail, googleId))
      setLoginSuccess(true)
      history.push('/')
    }
  }, [
    history,
    userInfo,
    redirect,
    error,
    dispatch,
    googleName,
    googleEmail,
    googleId,
  ])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  const googleLogin = (response) => {
    const {
      profileObj: { name, email },
      googleId,
    } = response

    setGoogleEmail(email)
    setGoogleName(name)
    setGoogleId(googleId)

    if (email) {
      dispatch(login(email, googleId))
    } else {
      setMessage('Terjadi kesalahan, coba lagi dalam beberapa saat.')
      setTimeout(() => {
        setMessage(null)
      }, 2500)
    }
  }

  return (
    <>
      <Helmet>
        <title>SewaGameID | Masuk</title>
      </Helmet>
      <FormContainer>
        <h1>Masuk</h1>
        {message && (
          <Message variant='danger' classN='alert-wide'>
            {message}
          </Message>
        )}
        {!loginSuccess && error && (
          <Message variant='danger' classN='alert-wide'>
            {error}
          </Message>
        )}
        {loading && <Spinner />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button className='btn-brand' type='submit'>
            Masuk
          </Button>
        </Form>
        <br/>
        <GoogleLogin
          clientId='816282195701-kdd4l2l5bnun3kbpsq8kqcusfb1cjkcr.apps.googleusercontent.com'
          onSuccess={googleLogin}
          onFailure={googleLogin}
          buttonText='Masuk dengan Google'
          className='google-login'
        />
        <Row className='py-3'>
          <Col>
            Pengguna Baru?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              Daftar
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  )
}

export default LoginScreen
