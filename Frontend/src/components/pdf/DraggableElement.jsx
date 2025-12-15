import { useRef, useEffect } from "react";
import EditableText from "./EditableText";
import { percentFromEvent, clamp } from "../../utils/elementUtils";

const DraggableElement = ({
  element,
  pageRect,
  onUpdate,
  onDelete,
  onSelect,
  selected,
}) => {
  const actionRef = useRef(null);

  /* ---------------- MOUSE MOVE ---------------- */
  useEffect(() => {
    const onMove = (e) => {
      if (!pageRect || !actionRef.current) return;

      const { x, y } = percentFromEvent(e, pageRect);

      if (actionRef.current === "drag") {
        onUpdate({
          ...element,
          xPercent: clamp(x, 0, 1 - element.widthPercent),
          yPercent: clamp(y, 0, 1 - element.heightPercent),
        });
      }

      if (actionRef.current === "resize") {
        onUpdate({
          ...element,
          widthPercent: clamp(
            x - element.xPercent,
            0.05,
            1 - element.xPercent
          ),
          heightPercent: clamp(
            y - element.yPercent,
            0.04,
            1 - element.yPercent
          ),
        });
      }
    };

    const stop = () => (actionRef.current = null);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", stop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", stop);
    };
  }, [element, pageRect, onUpdate]);

  /* ---------------- RENDER ---------------- */
  return (
    <div
      className={`absolute z-30 cursor-move
        ${selected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        left: `${element.xPercent * 100}%`,
        top: `${element.yPercent * 100}%`,
        width: `${element.widthPercent * 100}%`,
        height: `${element.heightPercent * 100}%`,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(element.id);
        actionRef.current = "drag";
      }}
    >
      {/* 🔹 TRANSPARENT CONTAINER */}
      <div className="relative w-full h-full bg-transparent overflow-visible">

        {/* ✍ TEXT / DATE */}
        {(element.type === "text" || element.type === "date") && (
          <EditableText
            value={element.value}
            color={element.color}
            onChange={(v) =>
              onUpdate({ ...element, value: v })
            }
          />
        )}

        {/* ✍ SIGNATURE */}
        {element.type === "signature" && (
          <img
            src={element.image}
            alt="Signature"
            className="w-full h-full object-contain pointer-events-none"
          />
        )}

        {/* 🖼 IMAGE */}
        {element.type === "image" && (
          <img
            src={element.image}
            alt="Uploaded"
            className="w-full h-full object-contain pointer-events-none"
          />
        )}

        {/* ☑ CHECKBOX */}
        {element.type === "checkbox" && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onUpdate({
                ...element,
                checked: !element.checked,
              });
            }}
            className={`
              w-full h-full border border-black
              flex items-center justify-center text-lg
              cursor-pointer select-none
              ${element.checked ? "text-black" : ""}
            `}
          >
            {element.checked ? "✓" : ""}
          </div>
        )}

        {/* 🎨 COLOR PICKER (FLOATING, ALWAYS VISIBLE WHEN SELECTED) */}
        {selected &&
          (element.type === "text" || element.type === "date") && (
            <div
              className="absolute -top-12 left-1/2 -translate-x-1/2
                         bg-white border shadow-xl rounded-md
                         px-2 py-1 flex items-center gap-2
                         z-[9999]"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <input
                type="color"
                value={element.color}
                onChange={(e) =>
                  onUpdate({
                    ...element,
                    color: e.target.value,
                  })
                }
                className="w-7 h-7 cursor-pointer border"
                title="Text Color"
              />
            </div>
          )}

        {/* ❌ DELETE */}
        {selected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute -top-2 -right-2
                       w-5 h-5 bg-red-500 text-white
                       rounded-full text-xs z-50"
          >
            ×
          </button>
        )}

        {/* ↘ RESIZE HANDLE */}
        {selected && (
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              actionRef.current = "resize";
            }}
            className="absolute bottom-0 right-0
                       w-3 h-3 bg-blue-600
                       cursor-se-resize z-50"
          />
        )}
      </div>
    </div>
  );
};

export default DraggableElement;
