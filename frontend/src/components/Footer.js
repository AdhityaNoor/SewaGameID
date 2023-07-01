import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3 hide-sm'>
            PT Sewa Game Indonesia 2023 - All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
