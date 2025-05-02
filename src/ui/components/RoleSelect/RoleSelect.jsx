import { useState, useRef, useEffect } from "react";
import DropdownIcon from "../../../assets/icons/Dropdown.svg?react";
import "./RoleSelect.css";

export default function RoleSelect({ 
  options,
  value,
  onChange
}) {
  const [isOpen, setIsOpen] = useState(false);
  const roleSelectRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (roleSelectRef.current && !roleSelectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(open => !open);
  const handleSelect = opt => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div
      className="role-select"
      ref={roleSelectRef}
    >
      <button
        type="button"
        className={`role-select__control${isOpen ? " role-select__control--open" : ""}`}
        onClick={handleToggle}
      >
        <span className="role-select__value">{value}</span>
        <DropdownIcon className= {`dropdown-icon ${isOpen ? "open" : ""}`} />
      </button>
      {isOpen && (
        <ul className="role-select__list">
          {options.map(opt => (
            <li
              key={opt}
              className={`role-select__item${opt === value ? " role-select__item--selected" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
