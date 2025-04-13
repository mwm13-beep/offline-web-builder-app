// Sidebar.tsx
const elements = ["div", "img", "p"];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Elements</h2>
      {elements.map((el) => (
        <div
          key={el}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", el)}
          style={{ border: "1px solid #888", margin: "5px", padding: "4px" }}
        >
          {el}
        </div>
      ))}
    </div>
  );
}
