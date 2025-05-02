import EditIcon from "../../../assets/icons/Edit.svg?react";
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
  className,
  children
}) {
  const isEdit = mode === "edit";

  const headerMarginBottom = !isEdit && !children ? 0 : 20;

  return (
    <div className={`card-container ${className}`}>
      <div className="card-container__header" style={{ marginBottom: headerMarginBottom }}>
        <h2 className="card-container__title">
          {title}
        </h2>
        <div className="card-container__actions">
          {showAddButton && !isEdit && (
            <button className="card-container__icon-btn" onClick={onAdd}>
              <PlusIcon className="card-container__plus-icon" />
            </button>
          )}
          {!showAddButton && (
            <button className="card-container__icon-btn" onClick={isEdit ? onSave : onToggleEdit}>
              {isEdit 
                ? <CheckIcon className="card-container__check-icon" /> 
                : <EditIcon className="card-container__edit-icon" />}
            </button>
          )}
        </div>
      </div>
      <div className="card-container__content">
        {children}
      </div>
    </div>
  );
}
