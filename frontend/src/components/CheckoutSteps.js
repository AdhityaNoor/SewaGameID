import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4, isCartScreen }) => {
  return (
    <Nav
      className={`justify-content-right mr-n3 ${
        isCartScreen ? `mb-n3 mt-1` : 'mb-4'
      }`}
    >
      <Nav.Item>
        {step1 && (
          <LinkContainer to='/cart'>
            <Nav.Link>Keranjang Anda</Nav.Link>
          </LinkContainer>
        )}
      </Nav.Item>
      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link>Alamat Pengiriman</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Alamat Pengiriman</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link>Pembayaran</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Pembayaran</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

CheckoutSteps.defaultProps = {
  isCartScreen: false,
}

export default CheckoutSteps
