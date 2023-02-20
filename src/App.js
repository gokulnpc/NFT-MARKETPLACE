import { Routes, Route } from "react-router-dom";
import { useState } from 'react'
import { ethers } from "ethers"
import ABI from './contract/ABI.json'
import { Container } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import SellNFT from './components/SellNFT';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import NFTPage from './components/NFTpage';

import Navibar from './components/Navibar';
import Footer from './components/Footer';
import Stack from 'react-bootstrap/Stack'
import './index.css';

function App() {
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)
    const [contract, setContract] = useState({})

    const web3Handler = async () => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x5') {
            //alert('Incorrect network! Switch your metamask network to Rinkeby');
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x5' }],
            })
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0])
        console.log("connected!!")
        // Get provider from Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Get signer
        const signer = provider.getSigner()
        loadContract(signer)
    }
    const loadContract = async (signer) => {
        // Get deployed copy of music nft marketplace contract
        const contract = new ethers.Contract(ABI.address, ABI.abi, signer)
        setContract(contract)
        setLoading(false)
    }

    window.ethereum.on('accountsChanged', function (accounts) {
        web3Handler();
    })
    return (
        <div>
            <Stack gap={2} className="col-md-12 mx-auto">
                <>
                    <Navibar function={web3Handler} account={account} />
                </>
                <div>
                    {loading ? (
                        <Container>
                            <br /><br /><br /><br />
                            <Card>
                                <Card.Body>
                                    <Card.Text class="text-center">
                                        Awaiting Metamask Connection...
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Container>

                    ) : (
                        <Routes>
                            <Route path="/" element={<Marketplace contract={contract} account={account} />} />
                            <Route path="/sellNFT" element={<SellNFT contract={contract} account={account} />} />
                            <Route path="/nftPage/:tokenId" element={<NFTPage contract={contract} account={account} />} />
                            <Route path="/profile" element={<Profile contract={contract} account={account} />} />
                        </Routes>
                    )}
                </div>
                <Footer />
            </Stack>
        </div>

    );
}

export default App;