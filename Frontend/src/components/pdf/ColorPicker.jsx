const COLORS = [
  "#000000",
  "#2563EB",
  "#DC2626",
  "#16A34A",
  "#CA8A04",
  "#9333EA",
];

const ColorPicker = ({ color, onChange }) => {
  return (
    <div className="flex gap-2 p-2 bg-white border rounded shadow">
      {COLORS.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`w-5 h-5 rounded-full border ${
            c === color ? "ring-2 ring-blue-500" : ""
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
