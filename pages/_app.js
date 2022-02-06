import '../styles/globals.css'
import './app.css'
import Link from 'next/link'

function MandiHouse({Component, pageProps}) {
  return (
    <div>
      <nav className=' border-b p-6' style={{backgroundColor:'black'}}>
       <p className='text-4xl font-bold text-white'>Mandi House</p>
       <p className='text-1xl  text-white'>Maketplace to Mint your Ideas and any digital resources as NFT</p>

        <div className='flex mt-4 justify-center'>
          <Link href='/'>
            <a className='mr-4'>
              Marketplace
            </a>
          </Link>
          <Link href='/mint-item'>
            <a className='mr-6'>
              Mint Tokens
            </a>
          </Link>
          <Link href='/my-nfts'>
            <a className='mr-6'>
              My NFTs
            </a>
          </Link>
          <Link href='/account-dashboard'>
            <a className='mr-6'>
              Account Dashboard
            </a>
          </Link>
          <Link href='/about'>
            <a className='mr-6'>
              About

            </a>
          </Link>
          
          
          </div>
          <div>

          
          </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MandiHouse 