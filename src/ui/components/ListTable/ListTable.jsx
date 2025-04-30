import LockIcon from "../../../assets/icons/Lock.svg?react";
import ListItemCard from "../ListItemCard/ListItemCard";
import "./ListTable.css";

export default function ListTable({
  title,
  columns,
  items,
  canEdit,
  onEditClick = () => { }
}) {
  console.log(columns);
  console.log(items);
  return (
    <div className="list-table">
      <div className="list-table-header">
        <h2 className="list-table-title">{title}</h2>
        {!canEdit && <LockIcon className="lock-icon" />}
      </div>
      <div className="list-table-body">
        {columns && columns.length > 0 ?
          <div className="list-table-row">
            {columns.map(col => (
              <div key={col.key} className="list-table-cell">
                {col.header}
              </div>
            ))}
          </div> : ""}

        {items.map((item, i) => (
          <ListItemCard
            key={item.id + i || JSON.stringify(item) + i}
            item={item}
            columns={columns}
            canEdit={canEdit}
            onEditClick={onEditClick}
          />
        ))}
      </div>
    </div>
  );
}