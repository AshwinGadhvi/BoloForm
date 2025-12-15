import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PdfSidebar from "../../components/layout/Sidebar";
import PdfEditor from "../pdf/PdfEditor";
import { uploadPdf, getUserPdfs, deletePdf } from "../../api/pdfApi";

const Dashboard = () => {
  const [pdfs, setPdfs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadPdfs = async () => {
    try {
      setIsLoading(true);
      const { data } = await getUserPdfs();
      setPdfs(data);
    } catch (error) {
      console.error("Failed to load PDFs:", error);
      toast.error("Failed to load PDFs");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPdfs();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      toast.loading("Uploading PDF...");
      await uploadPdf(formData);
      toast.dismiss();
      toast.success("PDF uploaded successfully");
      
      await loadPdfs();
      
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (error) {
      toast.dismiss();
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload PDF");
    }
  };

  const handlePdfDeleted = async (pdfId) => {
    try {
      if (selectedPdf?._id === pdfId) {
        setSelectedPdf(null);
        toast("Closed editor - PDF was deleted", { icon: "🗑️" });
      }

      setPdfs(prevPdfs => prevPdfs.filter(pdf => pdf._id !== pdfId));
      
      setTimeout(() => {
        loadPdfs();
      }, 100);
      
    } catch (error) {
      console.error("Error in handlePdfDeleted:", error);
    }
  };

  const handlePdfClose = () => {
    setSelectedPdf(null);
    if (windowWidth < 768) {
      toast("Editor closed", { icon: "✖️" });
    }
  };

  const filtered = pdfs.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      sidebar={({ isMobileOpen, onCloseMobile }) => (
        <PdfSidebar
          pdfs={filtered}
          search={search}
          setSearch={setSearch}
          selectedId={selectedPdf?._id}
          onSelect={setSelectedPdf}
          onUploadClick={() => fileRef.current?.click()}
          onPdfDeleted={handlePdfDeleted}
          isMobileOpen={isMobileOpen}
          onCloseMobile={onCloseMobile}
        />
      )}
    >
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        hidden
        accept="application/pdf"
        onChange={handleUpload}
      />

      {/* Workspace */}
      <div className="h-full overflow-auto bg-[rgb(var(--bg))]">
        {!selectedPdf ? (
          <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
            <div className="text-center max-w-md w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 
                            bg-gradient-to-br from-blue-100 to-blue-50 
                            rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[rgb(var(--text))] mb-2 md:mb-3">
                Welcome to BoloForm
              </h2>
              <p className="text-sm md:text-base text-[rgb(var(--muted))] mb-4 md:mb-6 px-2">
                {isLoading 
                  ? "Loading your PDFs..." 
                  : "No PDF open for editing. Select a PDF from the sidebar or upload a new one to get started."}
              </p>
              {!isLoading && pdfs.length === 0 && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg 
                             hover:bg-blue-700 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:ring-offset-2 
                             transition-colors shadow-sm text-sm md:text-base"
                  >
                    Upload Your First PDF
                  </button>
                  {windowWidth < 768 && (
                    <button
                      onClick={() => document.querySelector('[aria-label="Toggle sidebar"]')?.click()}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg 
                               hover:bg-gray-200 border border-gray-300
                               transition-colors text-sm"
                    >
                      Open Sidebar
                    </button>
                  )}
                </div>
              )}
              {!isLoading && pdfs.length > 0 && windowWidth < 768 && (
                <button
                  onClick={() => document.querySelector('[aria-label="Toggle sidebar"]')?.click()}
                  className="px-5 py-2.5 mt-4 bg-gray-100 text-gray-700 rounded-lg 
                           hover:bg-gray-200 border border-gray-300
                           transition-colors text-sm"
                >
                  Browse PDFs
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full">
            {/* Mobile header for PDF editor */}
            {windowWidth < 768 && (
              <div className="sticky top-0 z-10 bg-[rgb(var(--panel))] border-b 
                            border-[rgb(var(--border))] p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePdfClose}
                    className="p-2 rounded-lg hover:bg-[rgb(var(--hover))]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="font-medium text-[rgb(var(--text))] truncate">
                    {selectedPdf.title || "Untitled PDF"}
                  </h3>
                </div>
                <button
                  onClick={() => document.querySelector('[aria-label="Toggle sidebar"]')?.click()}
                  className="p-2 rounded-lg hover:bg-[rgb(var(--hover))]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            )}
            <div className={windowWidth < 768 ? "h-[calc(100%-64px)]" : "h-full"}>
              <PdfEditor 
                pdfId={selectedPdf._id} 
                onClose={handlePdfClose}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;