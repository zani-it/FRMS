import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReturnButton.scss';

function ReturnButton() {
  const navigate = useNavigate();

  return (
    <div className='menu'>
    <button className='menu__buton' onClick={() => navigate('/')}>
      FRMS Menu
    </button>
    </div>
  );
}

export default ReturnButton;
