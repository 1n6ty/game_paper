import React from 'react';
import EditButton from '../EditButton/EditButton';
import LockIcon from '../../../assets/icons/Lock.svg?react';
import './List.css';

export default function List({
  title,
  columns,    // [{ key, header, render? }]
  items,
  canEdit = true,
  onEditClick = () => { }
}) {
  return (
    <div className="list-card">
      <div className="list-card-header">
        <h2 className="list-card-title">{title}</h2>
        {!canEdit && <LockIcon className="lock-icon" />}
      </div>
      <div className="list-card-table">
        {/* Header */}
        <div className="list-card-row list-card-row--header">
          {columns.map(col => (
            <div key={col.key} className="list-card-cell list-card-cell--header">
              {col.header}
            </div>
          ))}
        </div>
        {/* Rows */}
        {items.map(item => (
          <div key={item.id || JSON.stringify(item)} className="list-card-row list-card-row--content">
            {columns.map(col => (
              <div key={col.key} className="list-card-cell">
                {col.render ? col.render(item) : item[col.key]}
                {" "}
              </div>
            ))}
            <div className="list-card-cell list-card-cell--action">
              <EditButton onClick={() => onEditClick(item)} disabled={!canEdit} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}