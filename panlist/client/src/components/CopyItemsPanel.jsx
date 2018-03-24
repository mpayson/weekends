import React from 'react';
import './CopyItemsPanel.css';

const CopyItemPanel = ({items}) => {
  const itemsString = items.join('; ');
  return (
    <div className="copy-item-panel">
      <label>
        Addresses
        <textarea className="copy-item-text" value={itemsString} readOnly/>
      </label>

    </div>
  )
};

export default CopyItemPanel;