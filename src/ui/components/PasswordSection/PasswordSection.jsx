import EditableField from "../EditableField/EditableField";
import "./PasswordSection.css";

export default function PasswordSection({ 
  mode,
  values,
  onChange
}) {
  return (
    <div className="password-section">
      <EditableField
        label="Введите новый пароль"
        value={values.pass}
        onChange={val => onChange({ ...values, pass: val })}
        mode={mode}
        placeHolder={"Новый пароль"}
      />

      <EditableField
        label="Повторите новый пароль"
        value={values.confirm}
        onChange={val => onChange({ ...values, confirm: val })}
        mode={mode}
        placeHolder={"Новый пароль"}
      />
    </div>
  );
}