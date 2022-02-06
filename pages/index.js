import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../config'
import AgroNFT from '../artifacts/contracts/AgroNFT.sol/AgroNFT.json'
import MandiHouse from '../artifacts/contracts/MandiHouse.sol/MandiHouse.json'

export default function Home() {
  //hooks
  const [nfts, setNFts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    // what we want to load:
    // ***provider, tokenContract, marketContract, data for our marketItems***

    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    const tokenContract = new ethers.Contract(nftaddress, AgroNFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, MandiHouse.abi, provider)
    const data = await marketContract.fetchMarketTokens()
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
        type: meta.data.type,
        description: meta.data.description
      }
      return item
    }))
    setNFts(items)
    setLoadingState('loaded')
  }

  // function to buy nfts for market 

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, MandiHouse.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1
    className='text-3x-1 mb-4 font-bold text-white'>No NFTs in marketplace</h1>)

  function returnUrl(nft) {
    if (nft.type == "text") {
      return 'https://ipfs.io/ipfs/QmebNxW4fmeuXCsXJUYmFUQDBsQAYsJ5ttxq1GN3dhUpF9'
    }
    return nft.nftdata
  }
  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div>

      <div className='flex justify-center'>

        <div className='px-4' style={{ maxWidth: '1600px' }}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
            {
              nfts.map((nft, i) => (

                <div key={i} className='border shadow rounded-x1 overflow-hidden'>

                  <img src={returnUrl(nft)} />

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
                    <button className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded'
                      onClick={() => buyNFT(nft)} >Buy
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )

}
