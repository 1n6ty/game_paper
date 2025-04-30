import EditButton from "../EditButton/EditButton";
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
          className={`list-item-card-cell ${index === 0
            ? "align-left"
            : index === columns.length - 1
              ? "align-right"
              : "align-center"
          }`}
        >
          {col.render ? col.render(item) : item[col.key]}
        </div>
      ))}
      <div className="list-item-card-cell action-cell">
        <EditButton onClick={() => onEditClick(item)} disabled={!canEdit} />
      </div>
    </div>
  );
}