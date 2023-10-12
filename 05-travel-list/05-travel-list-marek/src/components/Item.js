export default function Item({ item, onDeleteItems, onToggleItem }) {
  // useEffect(() => {
  //   console.log(item);
  // });
  return (
    <li>
      <input
        type="checkbox"
        value={item.isPacked}
        onChange={() => onToggleItem(item)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item)}>❌</button>
    </li>
  );
}
