import { useParams } from 'react-router-dom';
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";

export default function Profile(props) {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;
        let contract = props.contract;
        let transaction = await contract.getMyNFTs();

        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);

            let meta = await axios(tokenURI, {
                method: 'GET',  // Sending a POST request
                mode: 'cors'
            });

            meta = meta.data;
            let image = getIPFSGatewayURL(meta.image);
            console.log("image url: " + image);

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            console.log("price", Number(price))
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: image,
                name: meta.name,
                description: meta.description,
            }
            sumPrice += Number(price);
            return item;
        }))
        console.log("sum", sumPrice)
        updateData(items);
        updateFetched(true);
        updateAddress(props.account);
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched)
        getNFTData(tokenId);

    const getIPFSGatewayURL = (ipfsURL) => {
        let urlArray = ipfsURL.split("/");
        let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
        return ipfsGateWayURL;
    }
    return (
        <div>

            <div className="text-white text-center  mb-5 fw-semibold fs-3">
                Wallet Address
                <h3 className="text-white text-center  mb-5 fw-normal fs-4">{props.account}</h3>
            </div>
            <div class="container text-center">
                <div class="row">
                    <div class="col">
                        <div className="text-white text-center  mb-5 fw-semibold fs-3">
                            No. of NFTs
                            <h3 className="text-white text-center  mb-5 fw-normal fs-4">{data.length}</h3>
                        </div>
                    </div>
                    <div class="col">
                    </div>
                    <div class="col">
                        <div className="text-white text-center  mb-5 fw-semibold fs-3">
                            Total Value
                            <h3 className="text-white text-center  mb-5 fw-normal fs-4">{totalPrice} ETH</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-white text-center  mb-5 fw-semibold fs-5">
                Your NFTs
            </div>
            <div class="row row-cols-1 row-cols-md-4 g-4 mx-5 text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
            <div className="text-white text-center  mb-5 fw-normal fs-5">
                {data.length == 0 ? "Oops, No NFT data to display (Are you logged in?)" : ""}
            </div>
        </div>
    )
};