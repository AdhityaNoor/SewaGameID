import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import Loader from './layout/Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'

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
    <Carousel pause='hover'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid rounded />
            <Carousel.Caption className='carousel-caption-sm'>
              <>
                <h2 style={{color: 'orange'}}>{product.name}</h2>
                <h5>Rp.{' '}
                  <NumberFormat
                    value={product.price}
                    displayType={'text'}
                    thousandSeparator={true}
                  /> / Hari, atau
                  Rp.{' '}<NumberFormat
                    value={(product.price * 7)*50/100}
                    displayType={'text'}
                    thousandSeparator={true}
                  /> / Minggu <span style={{color: 'lightgreen'}}>( Hemat 50%! )</span>.
                </h5>
                <br/>
                <h6>
                  {product.description}
                </h6>
              </>
            </Carousel.Caption>
            
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
