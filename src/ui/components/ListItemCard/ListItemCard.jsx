import EditIcon from "../../../assets/icons/Edit.svg?react";
import "./ListItemCard.css";

export default function ListItemCard({
  item,
  columns,
  canEdit,
  onEditClick
}) {
  return (
    <div className="list-item-card">
      {columns.map((col, index) => (
        <div
          key={col.key}
          className={`list-item-card__cell ${index === 0
            ? "align-left"
            : index === columns.length - 1
              ? "align-right"
              : "align-center"
          }`}
        >
          {col.render ? col.render(item) : item[col.key]}
        </div>
      ))}
      {canEdit && <button 
        className="list-item-card__edit-btn" 
        onClick={() => onEditClick(item)}
      >
        <EditIcon className="list-item-card__edit-icon" />
      </button>}
    </div>
  );
}