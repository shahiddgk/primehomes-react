import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo-ct.png';

export default function VisitingCard({ visitor }) {
  const printableCardRef = useRef(null);
  const navigate = useNavigate()
  const  printSection = () =>{
    const getFullContent = document.body.innerHTML;
    const printsection = printableCardRef.current.innerHTML;
    document.body.innerHTML = printsection;
    window.print();
    document.body.innerHTML = getFullContent;
    window.location.reload()
}


  return (
    <>
    <div className="visiting-card pt-2" style={{marginBottom:'20px'}} ref={printableCardRef}>
      <div className="visitor text-center mx-auto">
        <img className='img-fluid visitor-image' width='100px' src={visitor.image} alt={visitor.name} />
      </div>
      <div className='visitor-card-container'>
      <div className="card-content text-white">
        <h2>Visitor</h2>
        <div className="details text-white">
          <p><strong>Name:</strong> {visitor.name}</p>
          <p><strong>Email:</strong> {visitor.email}</p>
          <p><strong>Mobile:</strong> {visitor.mobile}</p>
        </div>
      </div>
      <div className="qr-code my-auto mx-auto text-center">
        {visitor.qrcodeImage && <img src={visitor.qrcodeImage} alt="QR Code" className="qr-image" />}
        <img src={logo} alt="Prime Homes" className="card-logo" />
      </div>
      </div>
    </div>
        <Button  variant='contained'  color='primary' className='print-btn text-white' style={{marginBottom:'20px'}} onClick={printSection}>
          Print Card
        </Button>
    </>
  );
}

VisitingCard.propTypes = {
  visitor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    qrcodeImage: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    mobile: PropTypes.string,
    // Add other prop types as needed
  }).isRequired,
};
