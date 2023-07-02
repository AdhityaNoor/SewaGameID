import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './layout/Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'
import Product from '../components/Product'
import { Row, Col } from 'react-bootstrap'

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products } = productTopRated

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger' dismissible={false}>
      {error}
    </Message>
  ) : (
    <Row>
      {products
      .map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product}  />
          </Col>
        ))}
    </Row>
  )
}

export default ProductCarousel
