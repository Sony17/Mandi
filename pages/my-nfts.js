
// we want to load the users nfts and display

import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config'

import AgroNFT from '../artifacts/contracts/AgroNFT.sol/AgroNFT.json'
import MandiHouse from '../artifacts/contracts/MandiHouse.sol/MandiHouse.json'

export default function MyAssets() {
    // array of nfts
  const [nfts, setNFts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(()=> {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    // what we want to load:
    // we want to get the msg.sender hook up to the signer to display the owner nfts

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, AgroNFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, MandiHouse.abi, signer)
    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      // we want get the token metadata - json 
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image, 
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))

    setNFts(items)
    setLoadingState('loaded')
  }
  
  if(loadingState === 'loaded' && !nfts.length) return (<h1
  className='px-20 py-7 text-4x1'>You do not own any NFTs  :(</h1>)

  return (
    <div className='flex justify-center'>
          <div className='px-4' style={{maxWidth: '1600px'}}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
              nfts.map((nft, i) => (

                <div key={i} className='border shadow rounded-x1 overflow-hidden'>

                  <img src='https://ipfs.io/ipfs/QmebNxW4fmeuXCsXJUYmFUQDBsQAYsJ5ttxq1GN3dhUpF9' />

                  <div className='p-4 bg-black'>
                    <p style={{ height: '30px' }} className='text-1xl font-bold text-white'>{
                      nft.name}</p>
                    <div style={{ height: '72px', overflow: 'hidden' }}>
                      <p className='text-1xl  text-white'>
                        <a href={nft.image} target="_blank">View this token</a>
                      </p>
                      <p style={{ height: '30px' }} className='text-1xl font-bold text-white'>{
                        nft.description}</p>
                    </div>
                  </div>
                  <div className='p-4 bg-black'>
                    <p className='text-3x-1 mb-4 font-bold text-white'>{nft.price} ETH</p>
                    
                  </div>
                </div>
              ))
            }
          </div>
          </div>
    </div>
  )
}
