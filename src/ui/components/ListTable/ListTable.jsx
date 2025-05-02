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
  const headerMarginBottom = title.length ? 20 : 0;

  return (
    <div className="list-table">
      <div className="list-table__header" style={{ marginBottom: headerMarginBottom }}>
        <h2 className="list-table__title">{title}</h2>
        {!canEdit && <LockIcon className="list-table__lock-icon" />}
      </div>
      <div className="list-table__body">
        {columns && columns.length > 0 ?
          <div className="list-table__row">
            {columns.map(col => (
              <div key={col.key} className="list-table__cell">
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