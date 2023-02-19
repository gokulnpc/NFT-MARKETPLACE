import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../Pinata/pinata";
import ABI from '../contract/ABI.json';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function SellNFT() {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: '' });
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch (e) {
            console.log("Error during file upload", e);
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const { name, description, price } = formParams;
        //Make sure that none of the fields are empty
        if (!name || !description || !price || !fileURL)
            return;

        const nftJSON = {
            name, description, price, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch (e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (upto 5 mins)")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(ABI.address, ABI.abi, signer)

            //massage the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
            await transaction.wait()

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', price: '' });
            // window.location.replace("/")
        }
        catch (e) {
            alert("Upload error" + e)
        }
    }

    console.log("Working", process.env);
    return (
        <div>
            <Row className="justify-content-md-center text-white">
                <Col md="auto">
                    <form>
                        <div class="form-group">
                            <label htmlFor="name">NFT Name</label>
                            <input id="name" type="text" class="form-control" placeholder="XXXXX" onChange={e => updateFormParams({ ...formParams, name: e.target.value })} value={formParams.name} />
                        </div>

                        <div class="form-group">
                            <label htmlFor="description">NFT Description</label>
                            <textarea class="form-control" cols="40" rows="3" id="description" type="text" value={formParams.description} onChange={e => updateFormParams({ ...formParams, description: e.target.value })}></textarea>
                        </div>

                        <div class="form-group">
                            <label htmlFor="price">Price (in ETH)</label>
                            <input class="form-control" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({ ...formParams, price: e.target.value })}></input>
                        </div>

                        <div class="form-group">
                            <label htmlFor="image">Upload Image</label>
                            <input type="file" class="form-control-file" id="exampleFormControlFile1" onChange={OnChangeFile} />
                        </div>
                        <br></br>
                        <div class="text-green text-center">{message}</div>
                        <button onClick={listNFT} class="btn btn-primary">List NFT</button>
                    </form>
                </Col>
            </Row>
        </div>
    )
}