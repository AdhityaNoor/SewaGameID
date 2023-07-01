import { Helmet } from 'react-helmet'

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>{`Halaman Tidak Ditemukan`}</title>
      </Helmet>
      <div style={{ height: '200px' }}></div>
      <div className='text-center'>
        <h1 className='x-large text-brand'>
          <i
            className='fas fa-exclamation-triangle'
            style={{ color: '#ffb440' }}
          ></i>{' '}
          Tidak Ditemukan
        </h1>
        <p className='large'>Maaf, halaman yang kamu masukkan tidak ada..</p>
      </div>
    </>
  )
}

export default NotFound
