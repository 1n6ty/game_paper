import "./EditableField.css";

export default function EditableField({ 
  label,
  value,
  onChange,
  mode
}) {
  return (
    <div className="editable-field">
      {mode === "view" ? (
        <div className="editable-field-value">{value}</div>
      ) : (
        <div className="editable-field-edit-zone">
          <label className="editable-field-label">{label}</label>
          <input
            type="text"
            className="editable-field-input"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}