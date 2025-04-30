import EditButton from "../EditButton/EditButton";
import CheckIcon from "../../../assets/icons/Check.svg?react";
import PlusIcon from "../../../assets/icons/Plus.svg?react";
import "./CardContainer.css";

export default function CardContainer({
  title,
  mode = "view",
  onToggleEdit,
  onSave,
  showAddButton = false,
  onAdd,
  children
}) {
  const isEdit = mode === "edit";
  return (
    <div className="card-container">
      <div className="card-container-header">
        <h2>{title}</h2>
        <div className="card-container-actions">
          {showAddButton && !isEdit && <button className="icon-btn" onClick={onAdd}><PlusIcon /></button>}
          {!showAddButton && <button className="icon-btn" onClick={isEdit ? onSave : onToggleEdit}>
            {isEdit ? <CheckIcon /> : <EditButton className="" disabled={false} />}
          </button>}
        </div>
      </div>
      <div className="card-content">{children}</div>
    </div>
  );
}