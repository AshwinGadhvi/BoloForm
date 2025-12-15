import { useRef, useEffect, useState } from "react";

const EditableText = ({ value, color, onChange }) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  return (
    <div
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={() => setEditing(true)}
      onBlur={() => {
        setEditing(false);
        onChange(ref.current.innerText);
      }}
      style={{ color }}
      className="
        w-full h-full bg-transparent
        outline-none cursor-text
        flex items-center justify-center
        text-xs font-semibold
        select-text
      "
    >
      {value || "Text"}
    </div>
  );
};

export default EditableText;
