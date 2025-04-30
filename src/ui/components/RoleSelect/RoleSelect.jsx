import "./RoleSelect.css";

export default function RoleSelect({ 
  options,
  value,
  onChange
}) {
  return (
    <ul className="role-select">
      {options.map(opt => (
        <li
          key={opt}
          className={opt === value ? "selected" : ""}
          onClick={() => onChange(opt)}
        >
          {opt}
        </li>
      ))}
    </ul>
  );
}