import React, { useContext } from 'react';
import List from '../../components/List/List';
import Separator from '../../components/Separator/Separator';
import ControlPanel from '../../components/ControlPanel/ControlPanel';
import { UserContext } from '../../contexts/UserContext';
import './Settings.css';

export default function Settings() {
  const { canEdit } = useContext(UserContext);

  const codes = [
    { name: 'Название товара', gtin: '00000000000000', amount: 30 },
    { name: 'Название товара', gtin: '00000000000000', amount: 30 },
    { name: 'Название товара', gtin: '00000000000000', amount: 30 },
    { name: 'Название товара', gtin: '00000000000000', amount: 30 },
    { name: 'Название товара', gtin: '00000000000000', amount: 30 },
    { name: 'Название товара', gtin: '00000000000000', amount: 30 },
    { name: 'Название товара', gtin: '00000000000000', amount: 30 },
  ];

  const games = [
    { name: 'Милкифлай', reward: 20 },
    { name: 'Трекер', reward: 100 },
  ];

  const others = [
    { label: 'Ламбиксы за вход', value: 20 },
    { label: 'Ламбиксы за билет', value: 100 },
  ];

  const codesColumns = [
    { key: 'name', header: 'Название товара' },
    { key: 'gtin', header: 'GTIN-код' },
    { key: 'amount', header: 'Кол-во ламбиксов' },
  ];

  const gamesColumns = [
    { key: 'name', header: 'Название игры' },
    { key: 'reward', header: 'Ламбиксов за победу' },
  ];

  const othersColumns = [
    { key: 'label', header: '' },
    { key: 'value', header: '' },
  ];

  return (
    <div className="settings-container">
      <ControlPanel logoSrc="/icons/logo.svg" title="Панель управления" />
      <div className="settings-page">
        <List
          className="edit-codes-list"
          title="Редактирование кодов"
          columns={codesColumns}
          items={codes}
          canEdit={canEdit}
          onEditClick={item => console.log('edit code', item)}
          renderRow={item => [
            <div key="name">{item.name}</div>,
            <div key="gtin">{item.gtin}</div>,
            <div key="amount">{item.amount}</div>
          ]}
        />
        <Separator />
        <List
          className="edit-games-list"
          title="Редактирование игр"
          columns={gamesColumns}
          items={games}
          canEdit={canEdit}
          onEditClick={item => console.log('edit game', item)}
          renderRow={item => [
            <div key="name">{item.name}</div>,
            <div key="reward">{item.reward}</div>
          ]}
        />
        <Separator />
        <List
          className="other-list"
          title="Другие настройки"
          columns={othersColumns}
          items={others}
          canEdit={canEdit}
          onEditClick={item => console.log('edit other', item)}
          renderRow={item => [
            <div key="label">{item.label}</div>,
            <div key="value">{item.value}</div>
          ]}
        />
      </div>
    </div>
  );
}