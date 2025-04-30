import { useContext } from "react";
import ListTable from "../../components/ListTable/ListTable";
import Separator from "../../components/Separator/Separator";
import { UserContext } from "../../contexts/UserContext";
import "./Settings.css";

export default function Settings() {
  const { canEditSettings } = useContext(UserContext);

  const codes = [
    { name: "Название товара", gtin: "00000000000000", amount: 30 },
    { name: "Название товара", gtin: "00000000000000", amount: 100 },
    { name: "Название товара", gtin: "00000000000000", amount: 30 },
    { name: "Название товара", gtin: "00000000000000", amount: 30 },
    /* ... */
  ];

  const games = [
    { name: "Милкифлай", reward: 20 },
    /* ... */
  ];

  const others = [
    { label: "Ламбиксы за вход", value: 20 },
    /* ... */
  ];

  const codesColumns = [
    { key: "name", header: "Название товара" },
    { key: "gtin", header: "GTIN-код" },
    { key: "amount", header: "Кол-во ламбиксов" },
  ];

  const gamesColumns = [
    { key: "name", header: "Название игры" },
    { key: "reward", header: "Ламбиксов за победу" },
  ];

  const othersColumns = [
    { key: "label", header: "" },
    { key: "value", header: "" },
  ];

  return (
    <div className="settings-container">
      <ListTable
        title="Редактирование кодов"
        columns={codesColumns}
        items={codes}
        canEdit={canEditSettings}
        onEditClick={item => console.log("edit code", item)}
      />
      <Separator />
      <ListTable
        title="Редактирование игр"
        columns={gamesColumns}
        items={games}
        canEdit={canEditSettings}
        onEditClick={item => console.log("edit game", item)}
      />
      <Separator />
      <ListTable
        title="Другие настройки"
        columns={othersColumns}
        items={others}
        canEdit={canEditSettings}
        onEditClick={item => console.log("edit other", item)}
      />
    </div>
  );
}