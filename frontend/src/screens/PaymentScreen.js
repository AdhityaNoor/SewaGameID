import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo) {
      history.push('/cart')
    }
  }, [history, userInfo])

  if (!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4={shippingAddress.address} />
      <FormContainer>
        <h1>Pilih Cara Bayar</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as='h2'></Form.Label>
            <Col>
              <Form.Check
                type='radio'
                label='Paypal atau Kartu Kredit/Debit'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <Button type='submit' className='btn-brand btn-profile'>
            Check Out
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default PaymentScreen
