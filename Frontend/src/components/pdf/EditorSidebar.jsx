// EditorSidebar.jsx
// Purpose: Left vertical toolbar with PDF editing tools (Signature, Text, Date)
// This appears on the left side of the PDF editor workspace

const tools = [
  { id: "signature", label: "Signature", icon: "✍️" },
  { id: "text", label: "Text", icon: "🔤" },
  { id: "date", label: "Date", icon: "📅" },
  { id: "checkbox", label: "Checkbox", icon: "☑️" },
  { id: "image", label: "Image", icon: "🖼️" },
];

const EditorSidebar = ({ activeTool, setActiveTool }) => {
  return (
    <aside className="w-20 bg-gradient-to-b from-[rgb(var(--editor-sidebar))] to-[rgb(var(--panel))]
                      border-r border-[rgb(var(--border))]
                      flex flex-col items-center py-6 gap-3 shadow-lg">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id === activeTool ? null : tool.id)}
          className={`
            relative w-14 h-14 rounded-xl flex items-center justify-center
            transition-all duration-200 group
            ${
              activeTool === tool.id
                ? "bg-[rgb(var(--accent))] text-white shadow-lg shadow-[rgb(var(--accent))]/30 scale-105"
                : "bg-[rgb(var(--panel))] text-[rgb(var(--text))] hover:bg-[rgb(var(--bg))] hover:scale-105"
            }
          `}
          title={tool.label}
        >
          <span className="text-2xl">{tool.icon}</span>
          
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-3 py-1.5 
                         bg-[rgb(var(--tooltip-bg))] text-[rgb(var(--tooltip-text))]
                         text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                         transition-opacity pointer-events-none shadow-xl border border-[rgb(var(--border))]
                         z-10">
            {tool.label}
          </span>
        </button>
      ))}

      {/* Divider */}
      <div className="w-10 h-px bg-[rgb(var(--border))] my-2"></div>

      {/* Reset/Clear button */}
      <button
        onClick={() => setActiveTool(null)}
        className="w-14 h-14 rounded-xl flex items-center justify-center
                   transition-all duration-200 group
                   bg-[rgb(var(--panel))] text-[rgb(var(--text))]
                   hover:bg-red-500/10 hover:text-red-500 hover:scale-105
                   border border-[rgb(var(--border))]"
        title="Clear Selection"
      >
        <span className="text-xl">🗑️</span>
        
        <span className="absolute left-full ml-3 px-3 py-1.5 
                       bg-[rgb(var(--tooltip-bg))] text-[rgb(var(--tooltip-text))]
                       text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                       transition-opacity pointer-events-none shadow-xl border border-[rgb(var(--border))]
                       z-10">
          Clear Selection
        </span>
      </button>
    </aside>
  );
};

export default EditorSidebar;