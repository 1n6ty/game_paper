import EditIcon from "../../../assets/icons/Edit.svg?react";
import "./EditButton.css";

export default function EditButton({
  onClick,
  disabled
}) {
  return (
    <button
      className="edit-button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? "Нет прав на редактирование" : "Редактировать"}
    >
      <EditIcon className="edit-icon" />
    </button>
  );
}