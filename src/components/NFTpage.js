import { useParams } from 'react-router-dom';
import axios from "axios";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
export default function NFTPage(props) {

    const [data, updateData] = useState([]);
    const [dataFetched, updateDataFetched] = useState(false);

    const [message, updateMessage] = useState("");
    const [own, setOwn] = useState(false);
    const [currAddress, updateCurrAddress] = useState("0x");

    async function getNFTData(tokenId) {
        let contract = props.contract;

        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);

        //change to token uri
        let meta = await axios(tokenURI, {
            method: 'GET',  // Sending a POST request
            mode: 'cors'
        });

        meta = meta.data;
        console.log("metadata", meta)
        console.log("seller", listedToken.seller)

        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        updateData(item);
        if (props.account.toLowerCase() == data.seller.toLowerCase() || props.account.toLowerCase() == data.seller.toLowerCase()) {
            setOwn(true)
        }

        console.log("accc", props.account.toLowerCase())
        console.log("seller", data.seller.toLowerCase())
        updateDataFetched(true);

    }

    async function buyNFT(tokenId) {
        try {
            const ethers = require("ethers");
            //Pull the deployed contract instance
            let contract = props.contract;
            const salePrice = ethers.utils.parseUnits(data.price, 'ether')
            updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
            //run the executeSale function
            let transaction = await contract.executeSale(tokenId, { value: salePrice });
            await transaction.wait();
            alert('You successfully bought the NFT!');
            updateMessage("");
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched)
        getNFTData(tokenId);

    return (
        <>
            <center>
                <div class="row row-cols-1 row-cols-md-1 g-4 mx-5 ">
                    <div class="col">
                        <div class="card h-100 w-50 ">
                            <img src={data.image} class="card-img-top" />
                            <div class="card-body text-left">
                                <div>
                                    <span className='text-info font-weight-bold'>Name:</span>{' '}{data.name}
                                </div>
                                <div>
                                    <span className='text-info font-weight-bold'>Description:</span>{' '}{data.description}
                                </div>
                                <div>
                                    <span className='text-info font-weight-bold'>Price:</span>{' '}{data.price + " ETH"}
                                </div>
                                <div>
                                    <span className='text-info font-weight-bold'>Owner:</span>{' '}{data.owner}
                                </div>
                                <div>
                                    <span className='text-info font-weight-bold'>Seller:</span>{' '}{data.seller}
                                </div>
                                <br />
                                <div className="d-grid gap-2">
                                    {own ?
                                        <div className="font-weight-bold text-success">You are the owner of this NFT</div>
                                        : <Button variant="primary" size="lg" onClick={() => buyNFT(tokenId)}>Buy this NFT</Button>
                                    }
                                    <div className="font-weight-bold">{message}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </>
    )
}
// <div style={{ "min-height": "100vh" }}>
        //     <div className="flex ml-20 mt-20">
        //         <img src={data.image} alt="" className="w-2/5" />
        //         <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
        //             <div>
        //                 Name: {data.name}
        //             </div>
        //             <div>
        //                 Description: {data.description}
        //             </div>
        //             <div>
        //                 Price: <span className="">{data.price + " ETH"}</span>
        //             </div>
        //             <div>
        //                 Owner: <span className="text-sm">{data.owner}</span>
        //             </div>
        //             <div>
        //                 Seller: <span className="text-sm">{data.seller}</span>
        //             </div>
        //             <div>
        //                 {currAddress == data.owner || currAddress == data.seller ?
        //                     <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
        //                     : <div className="text-emerald-700">You are the owner of this NFT</div>
        //                 }

        //                 <div className="text-green text-center mt-3">{message}</div>
        //             </div>
        //         </div>
        //     </div>
        // </div>