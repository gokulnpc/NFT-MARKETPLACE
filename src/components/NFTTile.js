import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';

function NFTTile(data) {
    const newTo = {
        pathname: "/nftPage/" + data.data.tokenId
    }
    return (
        <>
            <div class="col">
                <div class="card h-100">
                    <img src={data.data.image} class="card-img-top tileimg" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title">{data.data.name}</h5>
                        <p class="card-text">{data.data.description}</p>
                    </div>
                    <div class="card-footer">
                        <Button variant="primary" as={Link} to={newTo}>More Info</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NFTTile;
