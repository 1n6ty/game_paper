import React from 'react';

const Header = () => {
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    padding: '0 16px',
    borderBottom: '1px solid #ccc',
  };

  const titleContainerStyle = {
    textAlign: 'center',
    flex: 1,
  };

  const cancelStyle = {
    color: '#007aff',
    minWidth: '60px',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: '80px',
  };

  const logoStyle = {
    width: '40px',
    height: 'auto',
    marginRight: '8px',
  };

  return (
    <div style={headerStyle}>
      <div style={cancelStyle}>Cancel</div>

      <div style={titleContainerStyle}>
        <div style={{ fontWeight: 'bold' }}>Городецкое молоко</div>
        <div style={{ fontSize: '12px', color: '#999' }}>bot</div>
      </div>
    </div>
  );
};

export default Header;
