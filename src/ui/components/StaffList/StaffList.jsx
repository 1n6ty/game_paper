import { useState } from "react";
import ListTable from "../ListTable/ListTable";
import RoleSelect from "../RoleSelect/RoleSelect";
import "./StaffList.css";

export default function StaffList({ 
  staff,
  roles,
  onUpdate
}) {
  const [editingId, setEditingId] = useState(null);
  const [localRole, setLocalRole] = useState("");

  const columns = [
    { key: "name", header: "Фамилия И.О." },
    { key: "title", header: "Должность" },
    { key: "email", header: "Почта" },
    { key: "role", header: "Роль", render: item => {
      if (item.id === editingId) {
        return (
          <RoleSelect
            options={roles}
            value={localRole}
            onChange={val => setLocalRole(val)}
          />
        );
      }

      return item.role;
    }
    }
  ];

  return (
    <ListTable
      title=""
      columns={columns}
      items={staff}
      canEdit={true}
      onEditClick={item => {
        if (editingId === item.id) {
          onUpdate({ ...item, role: localRole });
          setEditingId(null);
        } else {
          setEditingId(item.id);
          setLocalRole(item.role);
        }
      }}
    />
  );
}