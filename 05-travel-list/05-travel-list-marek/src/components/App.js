import { useState } from "react";
import Logo from "./Logo";
import Form from "./Form";
import PackingList from "./PackingList";
import Stats from "./Stats";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
];

export default function App() {
  const [packingList, setPackingList] = useState(initialItems);
  const handleAddItem = function (item) {
    setPackingList((list) => [...list, item]);
  };
  const handleDeleteItem = function (item) {
    setPackingList((list) => list.filter((i) => i.id !== item.id));
  };
  const handleToggleItem = function (item) {
    setPackingList((list) =>
      list.map((i) => (i.id === item.id ? { ...i, packed: !i.packed } : i))
    );
  };
  const handleClearItems = function () {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (confirmed) setPackingList([]);
  };

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItem} />
      <PackingList
        packingList={packingList}
        onDeleteItems={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearItems={handleClearItems}
      />
      <Stats items={packingList} />
    </div>
  );
}
