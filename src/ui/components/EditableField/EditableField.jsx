import "./EditableField.css";

export default function EditableField({ 
  label,
  value,
  placeHolder,
  error,
  onChange,
  mode
}) {
  return (
    <div className="editable-field">
      {mode === "view" ? (
        <div className="editable-field__value">{value}</div>
      ) : (
        <div className="editable-field__edit-zone">
          {label && <label className="editable-field__label">{label}</label>}
          <input
            type="text"
            className="editable-field__input"
            value={value}
            placeholder={placeHolder}
            onChange={e => onChange(e.target.value)}
          />
          {error && <label className="editable-field__error">{error}</label>}
        </div>
      )}
    </div>
  );
}
