import { useState } from "react";
import CardContainer from "../../components/CardContainer/CardContainer";
import EditableField from "../../components/EditableField/EditableField";
import PasswordSection from "../../components/PasswordSection/PasswordSection";
import StaffList from "../../components/StaffList/StaffList";

import "./Profile.css";

export default function Profile() {
  // режимы: 'view' или 'edit' для каждого блока
  const [userMode, setUserMode] = useState("view");
  const [passMode, setPassMode] = useState("view");
  const [staff, setStaff] = useState([
    { id: 1, name: "Иванов И.И.", title: "Менеджер", email: "ivanov@mail.ru", role: "Редактор" },
    { id: 2, name: "Петров П.П.", title: "Аналитик", email: "petrov@mail.ru", role: "Читатель" },
  ]);

  // данные пользователя
  const [userData, setUserData] = useState({
    name: "Имя Фамилия Отчество",
    title: "Должность",
    email: "user@mail.ru"
  });

  // пароль
  const [passwords, setPasswords] = useState({ pass: "", confirm: "" });

  return (
    <div className="profile-container">
      <CardContainer
        title="Ваши данные"
        mode={userMode}
        onToggleEdit={() => setUserMode(prev => (prev === "view" ? "edit" : "view"))}
        onSave={() => setUserMode("view")}
      >
        <EditableField
          label="Имя Фамилия Отчество"
          value={userData.name}
          onChange={val => setUserData(d => ({ ...d, name: val }))}
          mode={userMode}
        />
        <EditableField
          label="Должность"
          value={userData.title}
          onChange={val => setUserData(d => ({ ...d, title: val }))}
          mode={userMode}
        />
        <EditableField
          label="Почта"
          value={userData.email}
          onChange={val => setUserData(d => ({ ...d, email: val }))}
          mode={userMode}
        />
      </CardContainer>

      <CardContainer
        title="Редактировать пароль"
        mode={passMode}
        onToggleEdit={() => setPassMode(prev => (prev === "view" ? "edit" : "view"))}
        onSave={() => setPassMode("view")}
      >
        {passMode === "edit" && <PasswordSection
          mode={passMode}
          values={passwords}
          onChange={setPasswords}
        />}
      </CardContainer>

      <CardContainer
        title="Сотрудники"
        mode="view"
        showAddButton={true}
        onAdd={() => console.log("add new staff")}
      >
        <StaffList
          staff={staff}
          roles={["Редактор", "Читатель", "Владелец"]}
          onUpdate={updated => setStaff(list => list.map(u => u.id === updated.id ? updated : u))}
        />
      </CardContainer>
    </div>
  );
}