import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import { LinkContainer } from 'react-router-bootstrap'
import { Form, Col, Row, Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import Spinner from '../components/layout/Spinner'
import { getUserDetails, updateUser } from '../actions/userActions'
import { getUsersOrders, deleteOrder } from '../actions/orderActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const { loading: loadingUpdate, error: errorUpdate, success } = userUpdate

  const getOrders = useSelector((state) => state.getOrders)
  const {
    orders,
    loading: loadingOrders,
    error: errorOrders,
    message: deleteOrderMessage,
  } = getOrders

  const orderDelete = useSelector((state) => state.orderDelete)
  const { error: deleteOrderError } = orderDelete

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      history.push('/')
      return
    }

    dispatch(getUsersOrders(userId))

    if (success) {
      dispatch({ type: USER_UPDATE_RESET })
      history.push('/admin/users')
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [userInfo, dispatch, history, success, user, userId])

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      updateUser({
        _id: userId,
        name,
        email,
        isAdmin,
      })
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {user ? `Admin | Edit User ${user.name}` : 'Admin | Edit User'}
        </title>
      </Helmet>
      <Button onClick={() => history.goBack()}>Kembali</Button>
      {deleteOrderMessage && (
        <Message
          variant='success'
          dismissible={false}
          classN='alert-edit-screen'
        >
          {deleteOrderMessage}
        </Message>
      )}
      {!loadingOrders && orders.length > 0 ? (
        <>
          <Row>
            <Col md={3}>
              {' '}
              <h1 style={{ color: '#AAAAAA' }}>Edit User</h1>
              {loadingUpdate ? (
                <Spinner />
              ) : loading ? (
                <Spinner />
              ) : error ? (
                <Message
                  variant='danger'
                  classN='alert-register'
                  dismissible={false}
                >
                  {error}
                </Message>
              ) : errorUpdate ? (
                <Message
                  variant='danger'
                  classN='alert-register'
                  dismissible={false}
                >
                  {errorUpdate}
                </Message>
              ) : (
                <>
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                      <Form.Label>Nama Anda</Form.Label>
                      <Form.Control
                        type='name'
                        placeholder='Masukkan Nama Anda'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Masukkan Email Anda'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isAdmin'>
                      <Form.Check
                        type='checkbox'
                        label='Administrator'
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                      ></Form.Check>
                    </Form.Group>

                    <Button
                      className='btn-brand btn-block mt-4_5'
                      type='submit'
                    >
                      Perbarui
                    </Button>
                  </Form>
                </>
              )}
            </Col>
            {deleteOrderError && (
              <Message
                variant='success'
                dismissible={true}
                classN='alert-delete-order alert-delete-order-sm'
              >
                {deleteOrderError}
              </Message>
            )}
            {errorOrders && (
              <Message variant='danger' dismissible={false}>
                {errorOrders}
              </Message>
            )}
            <Col md={9}>
              <h1 style={{ color: '#AAAAAA' }}>הזמנות</h1>
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                  <tr>
                    <th className='sm-hide'>Order ID - {' '}</th>
                    <th>Tanggal Pesanan</th>
                    <th>Total Pesanan</th>
                    <th className='sm=hide'>Status Pembayaran</th>
                    <th className='sm-hide'>Tanggal Dibayar</th>
                    <th className='sm=hide'>Status Pengiriman</th>
                    <th className='sm-hide'>Tanggal Pengiriman</th>
                    <th>Detail Pesanan</th>
                    <th className='sm-hide'>Batal</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className='sm-hide'>
                        <Link to={`/order/${order._id}`}>
                          {order._id.slice(17, 24)}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/order/${order._id}`}>
                          {new Date(
                            order.createdAt.substring(0, 10)
                          ).toLocaleDateString('id-ID')}
                        </Link>
                      </td>
                      <td
                        style={{
                          fontSize:
                            order.totalPrice < 999
                              ? '1rem'
                              : order.totalPrice > 9999
                              ? '0.75rem'
                              : '0.85rem',
                        }}
                      >
                        <Link to={`/order/${order._id}`}>
                        Rp.{' '}
                          <NumberFormat
                            value={order.totalPrice}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </Link>
                      </td>
                      <td className='sm=hide'>
                        {order.isPaid ? (
                          <Link to={`/order/${order._id}`}>
                            <i
                              className='fas fa-check'
                              style={{ color: 'green' }}
                            />
                          </Link>
                        ) : (
                          <Link to={`/order/${order._id}`}>
                            <i
                              className='fas fa-times'
                              style={{ color: 'red' }}
                            />
                          </Link>
                        )}
                      </td>
                      <td className='sm-hide'>
                        <Link to={`/order/${order._id}`}>
                          {order.isPaid &&
                            new Date(
                              order.paidAt.substring(0, 10)
                            ).toLocaleDateString('id-ID')}
                        </Link>
                      </td>
                      <td className='sm=hide'>
                        {order.isDelivered ? (
                          <Link to={`/order/${order._id}`}>
                            <i
                              className='fas fa-check'
                              style={{ color: 'green' }}
                            />
                          </Link>
                        ) : (
                          <Link to={`/order/${order._id}`}>
                            <i
                              className='fas fa-times'
                              style={{ color: 'red' }}
                            />
                          </Link>
                        )}
                      </td>
                      <td className='sm-hide'>
                        <Link to={`/order/${order._id}`}>
                          {order.isDelivered &&
                            new Date(
                              order.deliveredAt.substring(0, 10)
                            ).toLocaleDateString('id-ID')}
                        </Link>
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className='btn-sm'>Buka</Button>
                        </LinkContainer>
                      </td>
                      <td className='sm-hide'>
                        {!order.isPaid && (
                          <i
                            className='fas fa-trash-alt'
                            style={{ color: 'red' }}
                            onClick={() =>
                              dispatch(deleteOrder(order._id, order.user))
                            }
                          ></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      ) : (
        <FormContainer>
          <h1 style={{ color: '#AAAAAA' }}>Edit User</h1>
          {loadingUpdate ? (
            <Spinner />
          ) : loading ? (
            <Spinner />
          ) : error ? (
            <Message
              variant='danger'
              classN='alert-register'
              dismissible={false}
            >
              {error}
            </Message>
          ) : errorUpdate ? (
            <Message
              variant='danger'
              classN='alert-register'
              dismissible={false}
            >
              {errorUpdate}
            </Message>
          ) : (
            <>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                  <Form.Label>Nama Anda</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Masukkan Nama Anda'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Masukkan Email Anda'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='isAdmin'>
                  <Form.Check
                    type='checkbox'
                    label='Administrator'
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  ></Form.Check>
                </Form.Group>

                <Button className='btn-brand btn-block mt-4_5' type='submit'>
                  Perbarui
                </Button>
              </Form>
            </>
          )}
        </FormContainer>
      )}{' '}
    </>
  )
}

export default UserEditScreen
