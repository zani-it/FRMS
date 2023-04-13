import React from 'react';
import './ReturnButton.scss';

function ReturnButton() {
  return (
    <div className='menu'>
      <button
        className='menu__button'
        style={{padding:'1.5rem', backgroundColor:'#435f8ada', color:'#fff', display:'flex', alignItems:'center'}}

        onClick={() => (window.location.href = 'http://localhost:3000')}
      >
        FRMS Menu
      </button>
    </div>
  );
}

export default ReturnButton;
