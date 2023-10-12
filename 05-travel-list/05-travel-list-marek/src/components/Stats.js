export default function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to your packing list</em>
      </p>
    );
  }
  const numItems = items.length;
  const numPackedItems = items.filter((i) => i.packed).length;
  const packedPercentage = Math.trunc((numPackedItems / numItems) * 100);
  return (
    <footer>
      <em>
        You have {numItems} items on yout list, and you already packed{" "}
        {numPackedItems} ({packedPercentage}%)
      </em>
    </footer>
  );
}
