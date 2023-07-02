import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import NumberFormat from 'react-number-format'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import PayPal from '../images/paypal.png'
import { addToCart, hideToast, removeFromCart } from '../actions/cartActions'
import { createOrder, listMyOrders } from '../actions/orderActions'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // Calculate prices
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2)

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )

  cart.shippingPrice = addDecimals(50)

  cart.totalPrice = (
    Number(cart.itemsPrice) + Number(cart.shippingPrice)
  ).toFixed(2)

  const removeFromCartHandler = (id, qty) => {
    const message =
      qty === 1 ? 'Berhasil menghapus' : 'Berhasil menghapus'

    dispatch(removeFromCart(id, message))

    setTimeout(() => {
      dispatch(hideToast())
    }, 3500)
  }

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (!userInfo) {
      history.push('/cart')
    }

    if (cart.cartItems.length === 0) {
      history.push('/')
    }

    if (success) {
      history.push(`/order/${order._id}`)
    }
  }, [history, userInfo, success, order, cart])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    )
    setTimeout(() => {
      dispatch(listMyOrders())
    }, 2000)
  }

  return (
    <>
      <Helmet>
        <title>SewaGameID | Pemesanan</title>
      </Helmet>
      <CheckoutSteps step1 step2 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Alamat Pengiriman</h2>
              <p className='mb-0'>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}
              </p>
              <p className='mb-0'>
                {cart.shippingAddress.postalCode &&
                  cart.shippingAddress.postalCode}
              </p>
              {cart.shippingAddress.phoneNumber && (
                <p>
                  <strong>Nomor telepon :</strong> {cart.shippingAddress.phoneNumber}
                </p>
              )}
            </ListGroup.Item>
            <ListGroup.Item style={{marginTop: '10px'}}>
              <h2>Cara Pembayaran</h2>
              {cart.paymentMethod === 'PayPal' && (
                <>
                  <Image src={PayPal} alt='PayPal' className='paypal-img' />{' '}
                  <h4 style={{ display: 'inline', marginRight: '1.5rem' }}>
                    atau Kartu Kredit/Debit
                  </h4>
                </>
              )}
            </ListGroup.Item>
            
            <ListGroup.Item style={{marginTop: '10px'}}>
              <h2>Produk yang dipilih :</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant='brand' dismissible={false}>
                  עגלת הקניות ריקה
                </Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2} className='my-auto'>
                          <Link to={`/product/${item.product}`}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Link>
                        </Col>
                        <Col
                          className='my-auto mt-4-sm'
                          style={{ fontSize: '0.85rem' }}
                        >
                          <Link to={`/product/${item.product}`}>
                            {item.name.length > 27
                              ? `${item.name.slice(0, 27)}...`
                              : `${item.name}`}
                          </Link>
                        </Col>
                        <Col
                          md={4}
                          className='my-auto mt-4-sm'
                          style={{ fontSize: item.price > 1000 && '0.85rem' }}
                        >
                          {item.qty} * Rp.{' '} {item.price.toLocaleString('id-ID')}{' '}={' '}
                          Rp.{' '}{(item.qty * item.price).toLocaleString('id-ID')} 
                        </Col>
                        <Col md={2} className='my-auto mt-4-sm'>
                          <Form.Control
                            className='form-control-lg form-control-md form-control-small'
                            as='select'
                            value={item.qty}
                            onChange={(e) => {
                              dispatch(
                                addToCart(
                                  item.product,
                                  Number(e.target.value),
                                  'Keranjang belanja telah berhasil diperbarui'
                                )
                              )
                              setTimeout(() => {
                                dispatch(hideToast())
                              }, 3500)
                            }}
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                        <Col md={1} className='text-center my-auto'>
                          <i
                            className='fas fa-trash mt-4-sm icon-md'
                            onClick={() =>
                              removeFromCartHandler(item.product, item.qty)
                            }
                          ></i>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Ringkasan Pesanan</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Jumlah Produk :</Col>
                  <Col>Rp. {' '}
                    <NumberFormat
                      value={cart.itemsPrice}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Biaya Pengiriman :</Col>
                  <Col>Rp. {' '}{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Pesanan Pembayaran :</Col>
                  <Col>Rp. {' '}
                    <NumberFormat
                      value={cart.totalPrice}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
              {error && (
                <ListGroup.Item>
                  <Message
                    variant='danger'
                    classN='alert-extra-wide'
                    dismissible={false}
                  >
                    {error}
                  </Message>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                {cart.cartItems.length > 0 ? (
                  <Button
                    type='button'
                    className='btn-brand btn-block'
                    onClick={placeOrderHandler}
                  >
                    Pembayaran
                  </Button>
                ) : (
                  <Button
                    type='button'
                    className='btn-brand btn-block'
                    disabled
                    style={{ 
                      color: '#5b6671',
                      cursor: 'not-allowed',
                    }}
                  >
                    Pembayaran
                  </Button>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
