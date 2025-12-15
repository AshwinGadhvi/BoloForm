const EditorToolbar = ({
  pdfTitle,
  zoom,
  setZoom,
  onSave,
  onDownload,
  onClose,
  onDelete,
  selectedElement,
  onColorChange,
}) => {
  const handleZoomIn = () => {
    if (zoom < 200) setZoom((z) => z + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom((z) => z - 10);
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sm:px-6
                 bg-[rgb(var(--panel))]
                 border-b border-[rgb(var(--border))]
                 shadow-sm"
    >
      {/* LEFT – PDF TITLE */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="text-xl">📄</span>
        <div className="min-w-0">
          <h2 className="font-semibold text-[rgb(var(--text))] truncate">
            {pdfTitle || "PDF Editor"}
          </h2>
          <p className="text-xs text-[rgb(var(--muted))]">
            Click tools to edit
          </p>
        </div>
      </div>

      {/* CENTER – ZOOM */}
      <div className="hidden md:flex items-center gap-3 
                      px-4 py-2 rounded-lg 
                      bg-[rgb(var(--bg))]
                      border border-[rgb(var(--border))]">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="w-8 h-8 rounded-md border
                     hover:bg-[rgb(var(--panel))]
                     disabled:opacity-50"
        >
          −
        </button>

        <button
          onClick={handleZoomReset}
          className="min-w-[60px] text-sm font-medium"
        >
          {zoom}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          className="w-8 h-8 rounded-md border
                     hover:bg-[rgb(var(--panel))]
                     disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* RIGHT – ACTIONS */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* 🎨 COLOR PICKER */}
        {selectedElement &&
          ["text", "date", "signature"].includes(selectedElement.type) && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg
                            bg-[rgb(var(--bg))]
                            border border-[rgb(var(--border))]">
              <span className="text-xs text-[rgb(var(--muted))]">
                Color
              </span>
              <input
                type="color"
                value={selectedElement.color || "#000000"}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-7 h-7 cursor-pointer bg-transparent"
              />
            </div>
          )}

        {/* DELETE PDF */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-3 py-2 rounded-lg
                       border border-red-500 text-red-500
                       hover:bg-red-50"
          >
            🗑️ <span className="hidden sm:inline">Delete</span>
          </button>
        )}

        {/* SAVE */}
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 rounded-lg
                     border border-[rgb(var(--border))]
                     hover:bg-[rgb(var(--bg))]"
        >
          💾 <span className="hidden sm:inline">Save</span>
        </button>

        {/* DOWNLOAD */}
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-2 rounded-lg
                     bg-[rgb(var(--accent))] text-white
                     hover:opacity-90"
        >
          📤 <span className="hidden sm:inline">Download</span>
        </button>

        {/* CLOSE (RIGHT END) */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-md flex items-center justify-center
                       border border-[rgb(var(--border))]
                       hover:bg-[rgb(var(--bg))]"
            title="Close Editor"
          >
            ✕
          </button>
        )}
      </div>
    </header>
  );
};

export default EditorToolbar;
