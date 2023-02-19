import npclogo from '../npclogo.png';
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

function Navibar(props) {

    const [connected, toggleConnect] = useState(false);

    useEffect(() => {
        let val = window.ethereum.isConnected();
        if (val) {
            toggleConnect(val);
        }
    });

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top" >
                <Container>
                    <Navbar.Brand as={Link} to="/"><img
                        src={npclogo}
                        width="120"
                        height="35"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />{' '}<span className="fw-bold">NFT Marketplace</span></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {connected ? (<><Nav.Link as={Link} to="/">Marketplace</Nav.Link>
                                <Nav.Link as={Link} to="/sellNFT">List My NFT</Nav.Link>
                                <Nav.Link as={Link} to="/profile">Profile</Nav.Link></>) :
                                (<><Nav.Link as={Link} to="/">Marketplace</Nav.Link>
                                    <Nav.Link as={Link} to="/">List My NFT</Nav.Link>
                                    <Nav.Link as={Link} to="/">Profile</Nav.Link></>)}
                        </Nav>
                        <Nav>
                            {props.account ? (<div className='text-white text-bold text-right mr-10 text-sm'>
                                Connected to {props.account.substring(0, 15) + '...'}
                            </div>) : (
                                <Button onClick={props.function} variant="success">Connect Wallet</Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
            <br /><br /><br /><br />
        </div>
    );
}

export default Navibar;