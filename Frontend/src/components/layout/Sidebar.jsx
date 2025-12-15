import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2, FileText, Calendar, Upload, Search, X } from "lucide-react";

const PdfSidebar = ({ 
  pdfs, 
  search, 
  setSearch, 
  selectedId, 
  onSelect,
  onUploadClick,
  onPdfDeleted,
  isMobileOpen,
  onCloseMobile
}) => {
  const [hoveredPdf, setHoveredPdf] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleDeletePdf = async (pdfId, pdfTitle, e) => {
    e.stopPropagation();
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${pdfTitle}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const loadingToast = toast.loading("Deleting PDF...");
      
      const response = await fetch(`/api/pdfs/${pdfId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error('Failed to delete PDF');
      }

      toast.success("PDF deleted successfully");

      if (onPdfDeleted) {
        onPdfDeleted(pdfId);
      }

    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete PDF");
    }
  };

  // Handle PDF selection on mobile
  const handlePdfSelect = (pdf) => {
    onSelect(pdf);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div className={`
      fixed md:relative inset-y-0 left-0 z-40
      h-full w-full md:w-80
      flex flex-col
      bg-[rgb(var(--panel))]
      border-r border-[rgb(var(--border))]
      transform transition-transform duration-300 ease-in-out
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      md:translate-x-0
    `}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[rgb(var(--border))]">
        <h2 className="text-lg font-semibold text-[rgb(var(--text))]">
          Your PDFs
        </h2>
        <button
          onClick={onCloseMobile}
          className="p-2 rounded-lg hover:bg-[rgb(var(--hover))]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-[rgb(var(--border))]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search PDFs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full px-4 py-2.5 pl-10 pr-10
                       bg-[rgb(var(--bg))] 
                       border border-[rgb(var(--border))] 
                       rounded-lg 
                       text-[rgb(var(--text))] 
                       placeholder-[rgb(var(--muted))]
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent transition-all
                       text-sm md:text-base"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 text-[rgb(var(--muted))]" />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-[rgb(var(--muted))]" />
            </button>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="p-4 border-b border-[rgb(var(--border))]">
        <button
          onClick={onUploadClick}
          className="w-full flex items-center justify-center gap-2 
                     px-4 py-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2 
                     transition-colors shadow-sm text-sm md:text-base"
        >
          <Upload className="w-4 h-4 md:w-5 md:h-5" />
          <span className="font-medium">Upload PDF</span>
        </button>
      </div>

      {/* PDF List */}
      <div className="flex-1 overflow-y-auto">
        {pdfs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <FileText className="w-10 h-10 md:w-12 md:h-12 text-[rgb(var(--muted))] mb-4" />
            <p className="text-[rgb(var(--muted))] text-sm md:text-base mb-2 px-4">
              {search ? "No matching PDFs found" : "No PDFs uploaded yet"}
            </p>
            {!search && (
              <button
                onClick={onUploadClick}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 
                           hover:underline"
              >
                Upload your first PDF
              </button>
            )}
          </div>
        ) : (
          <ul className="py-2">
            {pdfs.map((pdf) => (
              <li
                key={pdf._id}
                onMouseEnter={() => setHoveredPdf(pdf._id)}
                onMouseLeave={() => setHoveredPdf(null)}
                onClick={() => handlePdfSelect(pdf)}
                className={`px-4 py-3 cursor-pointer transition-all
                           border-b border-[rgb(var(--border))] last:border-b-0
                           ${selectedId === pdf._id
                             ? "bg-blue-50 border-l-4 border-blue-500"
                             : "hover:bg-[rgb(var(--hover))]"
                           }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <h3 className="font-medium text-[rgb(var(--text))] truncate text-sm md:text-base">
                        {pdf.title || "Untitled PDF"}
                      </h3>
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-[rgb(var(--muted))]">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(pdf.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {pdf.pageCount && (
                        <>
                          <span className="mx-2">•</span>
                          <span>
                            {pdf.pageCount} page{pdf.pageCount !== 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeletePdf(pdf._id, pdf.title || "Untitled PDF", e)}
                    className="ml-2 p-1.5 text-red-600 hover:bg-red-50 
                               rounded-md transition-colors flex-shrink-0"
                    title="Delete PDF"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="text-xs md:text-sm text-[rgb(var(--muted))]">
          <div className="flex justify-between items-center">
            <span>Total PDFs:</span>
            <span className="font-medium text-[rgb(var(--text))] px-2 py-1 
                             bg-[rgb(var(--panel))] rounded-md">
              {pdfs.length}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onCloseMobile}
        />
      )}
    </div>
  );
};

export default PdfSidebar;