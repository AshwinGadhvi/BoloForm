import { useState } from "react";

const PdfCanvas = ({ pdfData, activeTool, onElementAdd }) => {
  const [elements, setElements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pdfData?.totalPages || 2;

  // Handle clicking on PDF to add elements
  const handleCanvasClick = (e, pageNumber) => {
    if (!activeTool) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    const newElement = {
      id: Date.now(),
      page: pageNumber,
      type: activeTool,
      xPercent,
      yPercent,
      widthPercent: 0.25,
      heightPercent: 0.06,
      value: activeTool === "date" ? new Date().toLocaleDateString() : "",
    };

    setElements(prev => [...prev, newElement]);
    if (onElementAdd) onElementAdd(newElement);
  };

  // Remove element
  const handleElementRemove = (elementId) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
  };

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-10 
                     bg-gradient-to-br from-[rgb(var(--bg))] to-[rgb(var(--panel))]/30">
      <div className="max-w-5xl mx-auto">
        {/* Page Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-[rgb(var(--border))]
                         bg-[rgb(var(--panel))] text-[rgb(var(--text))]
                         hover:bg-[rgb(var(--bg))] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         font-medium text-sm"
            >
              ← Previous
            </button>
            
            <span className="px-4 py-2 rounded-lg bg-[rgb(var(--panel))] 
                           border border-[rgb(var(--border))]
                           text-[rgb(var(--text))] font-medium text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-[rgb(var(--border))]
                         bg-[rgb(var(--panel))] text-[rgb(var(--text))]
                         hover:bg-[rgb(var(--bg))] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         font-medium text-sm"
            >
              Next →
            </button>
          </div>
        )}

        {/* PDF Page Display */}
        <div className="space-y-8">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isVisible = pageNumber === currentPage || totalPages === 1;

            if (!isVisible) return null;

            return (
              <div
                key={pageNumber}
                className="relative mx-auto w-full max-w-[850px]
                           bg-white shadow-2xl rounded-lg overflow-hidden
                           border border-[rgb(var(--border))]
                           transition-all hover:shadow-[rgb(var(--accent))]/20"
              >
                {/* Page Number Badge */}
                <div className="absolute top-4 right-4 z-20
                              bg-[rgb(var(--accent))] text-white 
                              px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  Page {pageNumber}
                </div>

                {/* PDF Page Content */}
                <div 
                  className="relative aspect-[8.5/11] bg-white"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 35px,
                      rgba(0,0,0,0.03) 35px,
                      rgba(0,0,0,0.03) 36px
                    )`
                  }}
                >
                  {/* Sample content */}
                  <div className="absolute inset-0 p-12">
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-900 w-2/3 rounded" />
                      <div className="h-3 bg-gray-300 w-full rounded" />
                      <div className="h-3 bg-gray-300 w-5/6 rounded" />
                      <div className="h-3 bg-gray-300 w-4/6 rounded" />
                      <div className="mt-8 h-4 bg-gray-400 w-1/3 rounded" />
                      <div className="h-3 bg-gray-200 w-full rounded" />
                      <div className="h-3 bg-gray-200 w-full rounded" />
                      <div className="h-3 bg-gray-200 w-3/4 rounded" />
                    </div>
                  </div>

                  {/* Click Overlay for Adding Elements */}
                  <div
                    className={`absolute inset-0 z-10 ${
                      activeTool 
                        ? "cursor-crosshair bg-[rgb(var(--accent))]/5 backdrop-blur-[0.5px]" 
                        : ""
                    }`}
                    onClick={(e) => handleCanvasClick(e, pageNumber)}
                  >
                    {activeTool && (
                      <div className="absolute top-2 left-2 
                                    bg-[rgb(var(--accent))] text-white 
                                    px-3 py-1 rounded-full text-xs font-medium shadow-lg
                                    animate-pulse">
                        Click to add {activeTool}
                      </div>
                    )}
                  </div>

                  {/* Render Added Elements */}
                  {elements
                    .filter((el) => el.page === pageNumber)
                    .map((el) => (
                      <div
                        key={el.id}
                        className="absolute z-20 group"
                        style={{
                          left: `${el.xPercent * 100}%`,
                          top: `${el.yPercent * 100}%`,
                          width: `${el.widthPercent * 100}%`,
                          height: `${el.heightPercent * 100}%`,
                        }}
                      >
                        <div className="relative w-full h-full 
                                      border-2 border-[rgb(var(--accent))]
                                      bg-gradient-to-br from-[rgb(var(--accent))]/10 to-[rgb(var(--accent))]/20
                                      rounded-lg shadow-lg backdrop-blur-sm
                                      text-xs font-semibold text-[rgb(var(--accent))]
                                      flex items-center justify-center
                                      transition-all hover:shadow-xl">
                          <span>{el.type.toUpperCase()}</span>
                          
                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleElementRemove(el.id);
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 
                                     bg-red-500 text-white rounded-full
                                     flex items-center justify-center
                                     opacity-0 group-hover:opacity-100
                                     transition-opacity shadow-lg
                                     hover:bg-red-600 text-xs"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!pdfData && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-[rgb(var(--text))] mb-2">
              No PDF Loaded
            </h3>
            <p className="text-[rgb(var(--muted))]">
              Select a PDF from the sidebar to start editing
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default PdfCanvas;