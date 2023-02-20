import NFTTile from "./NFTTile";
import axios from "axios";
import { useState } from "react";

export default function Marketplace(props) {

    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);

    async function getAllNFTs() {
        const ethers = require("ethers");
        let contract = props.contract;
        let transaction = await contract.getAllNFTs()
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);

            // let meta = await axios.get(tokenURI);
            console.log("tokenURI", tokenURI)

            let meta = await axios(tokenURI, {
                method: 'GET',
                mode: 'cors'
            });
            meta = meta.data;
            let image = getIPFSGatewayURL(meta.image);
            console.log("image url: " + image);
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: image,
                name: meta.name,
                description: meta.description,
            }
            return item;
        }))

        updateFetched(true);
        updateData(items);
    }
    if (!dataFetched) {
        getAllNFTs();
    }

    const getIPFSGatewayURL = (ipfsURL) => {
        let urlArray = ipfsURL.split("/");
        let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
        return ipfsGateWayURL;
    }
    return (
        <div>
            <div>
                <div className="text-white text-center  mb-5 fw-bold fs-3">
                    Top NFTs
                </div>

                <div class="row row-cols-1 row-cols-md-4 g-4 mx-5 text-center">
                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
                <br /><br />
            </div>
        </div>
    );

}