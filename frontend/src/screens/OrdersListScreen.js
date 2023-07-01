import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import NumberFormat from 'react-number-format'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import Spinner from '../components/layout/Spinner'
import { getAllOrders, deleteOrder } from '../actions/orderActions'
import { ORDER_DELIVERED_RESET } from '../constants/orderConstants'

const OrdersListScreen = ({ history }) => {
  const [successDelivered, setSuccessDelivered] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const ordersList = useSelector((state) => state.ordersList)
  const { loading, error, orders, message } = ordersList

  const orderDelivered = useSelector((state) => state.orderDelivered)
  const { loading: loadingDeliver, success: successDeliver } = orderDelivered

  const orderDelete = useSelector((state) => state.orderDelete)
  const { loading: loadingDelete, error: deleteError } = orderDelete

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      history.push('/')
      return
    }

    if (!loading && !loadingDeliver && successDeliver) {
      setSuccessDelivered(true)
      setTimeout(() => {
        setSuccessDelivered(false)
        dispatch({ type: ORDER_DELIVERED_RESET })
      }, 2000)
    }

    dispatch(getAllOrders())

    // eslint-disable-next-line
  }, [dispatch, userInfo, history, loadingDeliver, successDeliver])

  const deleteHandler = (id) => {
    if (window.confirm('האם אתם בטוחים שברצונכם למחוק את ההזמנה?')) {
      dispatch(deleteOrder(id, userInfo._id))
    }
  }

  return (
    <>
      <Helmet>
        <title>Pesanan</title>
      </Helmet>
      <h1 style={{ color: '#AAAAAA' }}>Pesanan</h1>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {message && (
            <Message
              variant='success'
              dismissible={false}
              classN='alert-product-screen'
            >
              {message}
            </Message>
          )}

          {deleteError && (
            <Message
              variant='danger'
              dismissible={true}
              classN='alert-product-screen'
            >
              {deleteError}
            </Message>
          )}

          {error ? (
            <Message variant='danger' dismissible={false}>
              {error}
            </Message>
          ) : successDelivered ? (
            <Message
              variant='success'
              dismissible={false}
              classN='alert-product-screen'
            >
              ההזמנה סומנה כנשלחה בהצלחה
            </Message>
          ) : loadingDelete ? (
            <Spinner />
          ) : (
            <Table
              striped
              bordered
              hover
              responsive
              className='table-sm'
              style={{ color: '#AAAAAA' }}
            >
              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <th style={{ width: '7rem' }}>Order ID</th>
                  <th style={{ width: '8rem' }}>Tanggal Pemesanan</th>
                  <th style={{ width: '8rem' }}>Nama Pelanggan</th>
                  <th
                    style={{ textAlign: 'right', width: '18rem' }}
                    className='hide-sm'
                  >
                    Alamat Pelanggan
                  </th>
                  <th className='hide-sm hide-md'>Produk yang dipilih :</th>
                  <th>Status Pembayaran</th>
                  <th className='hide-sm'>Tanggal Pembayaran</th>
                  <th>Status Pengiriman</th>
                  <th className='hide-sm'>Dikirim</th>
                  <th>Jumlah Pesanan</th>
                  <th className='hide-sm hide-md'>Hapus</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  orders &&
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td
                        onClick={() => history.push(`/order/${order._id}`)}
                        className='order-link'
                      >
                        <span title='Detail Pemesanan'>
                          {order._id.slice(17, 24)}
                        </span>
                      </td>

                      <td
                        onClick={() => history.push(`/order/${order._id}`)}
                        className='order-link'
                      >
                        <span title='מעבר לפרטי ההזמנה'>
                          {new Date(
                            order.createdAt.substring(0, 10)
                          ).toLocaleDateString('id-ID')}
                        </span>
                      </td>
                      <td
                        onClick={() => history.push(`/order/${order._id}`)}
                        className='order-link'
                      >
                        <span title='מעבר לפרטי ההזמנה'>{order.user.name}</span>
                      </td>
                      <td
                        onClick={() => history.push(`/order/${order._id}`)}
                        className='order-link text-right hide-sm'
                      >
                        <span title='מעבר לפרטי ההזמנה'>
                          {order.shippingAddress.address}{' '}
                          {order.shippingAddress.city}
                        </span>
                      </td>
                      <td
                        onClick={() => history.push(`/order/${order._id}`)}
                        className='order-link hide-sm hide-md'
                      >
                        <span title='מעבר לפרטי ההזמנה'>
                          {order.orderItems.length}
                        </span>
                      </td>
                      <td
                        onClick={() =>
                          history.push(`/admin/user/${order.user._id}/edit`)
                        }
                        className='order-link'
                      >
                        <span title='מעבר לפרטי ההזמנה'>
                          {order.isPaid ? (
                            <i
                              className='fas fa-check'
                              style={{ color: '#3fa63f' }}
                            ></i>
                          ) : (
                            <i
                              className='fas fa-times'
                              style={{
                                color: '#e9352f',
                              }}
                            ></i>
                          )}
                        </span>
                      </td>

                      <td
                        onClick={() => history.push(`/order/${order._id}`)}
                        className='hide-sm'
                      >
                        <span title='מעבר לפרטי ההזמנה'>
                          {order.isPaid
                            ? new Date(
                                order.paidAt.substring(0, 10)
                              ).toLocaleDateString('id-ID')
                            : ''}
                        </span>
                      </td>

                      <td
                        onClick={() =>
                          history.push(`/admin/user/${order.user._id}/edit`)
                        }
                        className='order-link'
                      >
                        <span title='מעבר לפרטי ההזמנה'>
                          {order.isDelivered ? (
                            <i
                              className='fas fa-check'
                              style={{ color: '#3fa63f' }}
                            ></i>
                          ) : (
                            <i
                              className='fas fa-times'
                              style={{
                                color: '#e9352f',
                              }}
                            ></i>
                          )}
                        </span>
                      </td>
                      <td
                        onClick={() => history.push(`/order/${order._id}`)}
                        className='hide-sm'
                      >
                        <span title='מעבר לפרטי ההזמנה'>
                          {order.isDelivered
                            ? new Date(
                                order.deliveredAt.substring(0, 10)
                              ).toLocaleDateString('id-ID')
                            : ''}
                        </span>
                      </td>

                      <td
                        onClick={() => history.push(`/order/${order._id}`)}
                        className='order-link'
                      >
                        <span title='מעבר לפרטי ההזמנה'>
                          <NumberFormat
                            value={order.totalPrice}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </span>
                      </td>
                      <td
                        style={{ textAlign: 'center' }}
                        className='hide-sm hide-md'
                      >
                        {!order.isPaid ? (
                          <i
                            className='fas fa-trash-alt'
                            style={{
                              color: '#e9352f',
                              cursor: 'pointer',
                            }}
                            onClick={() => deleteHandler(order._id)}
                          ></i>
                        ) : (
                          <span title='לא ניתן למחוק הזמנה משולמת'>
                            <i
                              className='fas fa-trash-alt'
                              style={{
                                color: '#AAAAAA',
                                cursor: 'not-allowed',
                              }}
                            ></i>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </>
  )
}

export default OrdersListScreen
