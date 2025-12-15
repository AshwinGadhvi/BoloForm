import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import toast from "react-hot-toast";

import {
  getPdfById,
  savePdfElements,
  downloadPdf,
  deletePdf
} from "../../api/pdfApi";

import EditorSidebar from "../../components/pdf/EditorSidebar";
import EditorToolbar from "../../components/pdf/EditorToolbar";
import DraggableElement from "../../components/pdf/DraggableElement";
import SignaturePad from "../../components/pdf/SignaturePad";


import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const MAX_PDF_WIDTH = 900;

// UPDATE: Add onClose and onDelete callbacks as props
const PdfEditor = ({ pdfId, onClose, onDelete }) => {
  const workspaceRef = useRef(null);
  const pageRefs = useRef({});
  const imageInputRef = useRef(null);

  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [activeTool, setActiveTool] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [pageWidth, setPageWidth] = useState(700);
  const [loading, setLoading] = useState(true);

  // Signature
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [pendingSignature, setPendingSignature] = useState(null);

  // Image
  const [pendingImage, setPendingImage] = useState(null);

  /* ---------------- CLOSE PDF ---------------- */
  const handleClose = () => {
    // Clear local state
    setPdf(null);
    setElements([]);
    setSelectedElementId(null);
    setActiveTool(null);
    setNumPages(0);
    
    // Call parent callback if provided
    if (onClose) {
      onClose();
    } else {
      // Fallback: Show message and let parent handle navigation
      toast.success("PDF editor closed");
      console.log("No onClose callback provided. Parent component should handle navigation.");
    }
  };

  /* ---------------- LOAD PDF ---------------- */
  useEffect(() => {
    if (!pdfId) return;

    const loadPdf = async () => {
      try {
        setLoading(true);
        const { data } = await getPdfById(pdfId);

        setPdf(data);

        // ✅ LOAD SAVED ELEMENTS FROM BACKEND
        setElements(data.elements || []);

        setSelectedElementId(null);
      } catch (err) {
        toast.error("Failed to load PDF");
        console.error(err);
        // If PDF doesn't exist, notify parent
        if (err.response?.status === 404 && onDelete) {
          onDelete(pdfId);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfId]);

  /* --------- PAGE WIDTH --------- */
  useEffect(() => {
    if (!workspaceRef.current) return;

    const updateWidth = () => {
      const available = workspaceRef.current.offsetWidth - 64;
      setPageWidth(Math.min(available, MAX_PDF_WIDTH) * (zoom / 100));
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(workspaceRef.current);
    return () => ro.disconnect();
  }, [zoom]);

  /* ---------------- ELEMENT OPS ---------------- */
  const updateElement = (updated) => {
    setElements((prev) =>
      prev.map((el) => (el.id === updated.id ? updated : el))
    );
  };

  const removeElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (id === selectedElementId) setSelectedElementId(null);
  };

  /* ---------------- SIGNATURE SAVE ---------------- */
  const handleSignatureSave = (image) => {
    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        page: pendingSignature.page,
        type: "signature",
        image,
        xPercent: pendingSignature.xPercent,
        yPercent: pendingSignature.yPercent,
        widthPercent: 0.3,
        heightPercent: 0.15,
      },
    ]);

    setShowSignaturePad(false);
    setPendingSignature(null);
  };

  /* ---------------- IMAGE SAVE ---------------- */
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setElements((prev) => [
        ...prev,
        {
          id: Date.now(),
          page: pendingImage.page,
          type: "image",
          image: reader.result,
          xPercent: pendingImage.xPercent,
          yPercent: pendingImage.yPercent,
          widthPercent: 0.3,
          heightPercent: 0.2,
        },
      ]);
    };
    reader.readAsDataURL(file);
    setPendingImage(null);
  };

  /* ---------------- SAVE PDF (⭐ CORE) ---------------- */
  const handleSave = async () => {
    try {
      toast.loading("Saving PDF...");

      await savePdfElements(pdf._id, elements);

      toast.dismiss();
      toast.success("PDF saved successfully");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to save PDF");
      console.error(err);
    }
  };

  /* ---------------- DOWNLOAD PDF (⭐ CORE) ---------------- */
  const handleDownload = async () => {
    console.log("🖱️ Download button clicked");
    console.log("📄 Current PDF:", pdf);
    console.log("📋 PDF ID:", pdf?._id);
    
    if (!pdf?._id) {
      toast.error("No PDF loaded");
      return;
    }
    
    try {
      // Show loading toast
      const loadingToast = toast.loading("Preparing download...");
      
      console.log(`🌐 Calling API: /pdf/${pdf._id}/download`);
      const res = await downloadPdf(pdf._id);
      
      console.log("✅ API Response received:", {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        dataType: typeof res.data,
        dataSize: res.data?.size || 'unknown',
        dataBlob: res.data instanceof Blob ? 'Is Blob' : 'Not Blob'
      });
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Check if response is valid
      if (res.status !== 200) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      
      // Check if data exists and is a Blob
      if (!res.data || !(res.data instanceof Blob)) {
        console.error("Invalid response data:", res.data);
        throw new Error("Invalid PDF data received from server");
      }
      
      // Create blob URL
      const blobUrl = window.URL.createObjectURL(res.data);
      console.log("🔗 Created blob URL:", blobUrl);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = `${pdf.title || 'document'}-signed.pdf`;
      downloadLink.style.display = 'none';
      
      // Add to document and trigger click
      document.body.appendChild(downloadLink);
      console.log("📥 Triggering download...");
      downloadLink.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(blobUrl);
        console.log("🧹 Cleaned up download resources");
      }, 100);
      
      // Show success message
      toast.success("Download started! Check your downloads folder.");
      
    } catch (err) {
      console.error("💥 Frontend download error:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        config: err.config
      });
      
      // Handle specific error cases
      if (err.response?.status === 404) {
        toast.error("PDF file not found on server");
      } else if (err.response?.status === 401) {
        toast.error("Please log in to download files");
      } else if (err.response?.status === 500) {
        toast.error("Server error while generating PDF");
      } else if (err.message?.includes("Network Error")) {
        toast.error("Cannot connect to server. Check your connection.");
      } else if (err.message?.includes("Invalid PDF data")) {
        toast.error("Received invalid file data from server");
      } else {
        toast.error(`Download failed: ${err.message || "Unknown error"}`);
      }
    }
  };

  /*----------------------Delete PDF-----------------------*/
  const handleDelete = async () => {
    if (!pdf?._id) {
      toast.error("No PDF to delete");
      return;
    }

    // Confirm before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete "${pdf.title || 'this PDF'}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const loadingToast = toast.loading("Deleting PDF...");

      await deletePdf(pdf._id);

      toast.dismiss(loadingToast);
      toast.success("PDF deleted successfully");

      // Clear local state first
      handleClose();
      
      // Notify parent about deletion
      if (onDelete) {
        onDelete(pdf._id);
      } else {
        console.log("No onDelete callback provided. Parent should refresh PDF list.");
      }
      
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete PDF");
    }
  };

  const selectedElement = elements.find(
    (el) => el.id === selectedElementId
  );

  /* ---------------- STATES ---------------- */
  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        Loading PDF…
      </div>
    );

  if (!pdf)
    return (
      <div className="h-full flex items-center justify-center">
        No PDF
      </div>
    );

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <EditorToolbar
        pdfTitle={pdf.title}
        zoom={zoom}
        setZoom={setZoom}
        onSave={handleSave}
        onDownload={handleDownload}
        onClose={handleClose}
        onDelete={handleDelete}
        selectedElement={selectedElement}
        onColorChange={(color) =>
          selectedElement &&
          updateElement({ ...selectedElement, color })
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />

        <div
          ref={workspaceRef}
          className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedElementId(null);
            }
          }}
        >
          <Document
            file={`http://localhost:5000${pdf.filePath}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from({ length: numPages }, (_, i) => {
              const pageNumber = i + 1;

              return (
                <div
                  key={pageNumber}
                  ref={(el) => (pageRefs.current[pageNumber] = el)}
                  className="relative mb-16 bg-white shadow-lg"
                  style={{ width: pageWidth }}
                >
                  <Page pageNumber={pageNumber} width={pageWidth} />

                  {/* ADD ELEMENT */}
                  <div
                    className="absolute inset-0 z-10 cursor-crosshair"
                    onClick={(e) => {
                      if (!activeTool) return;
                      e.stopPropagation();

                      const rect =
                        e.currentTarget.getBoundingClientRect();
                      const x =
                        (e.clientX - rect.left) / rect.width;
                      const y =
                        (e.clientY - rect.top) / rect.height;

                      if (activeTool === "signature") {
                        setPendingSignature({
                          page: pageNumber,
                          xPercent: x,
                          yPercent: y,
                        });
                        setShowSignaturePad(true);
                        return;
                      }

                      if (activeTool === "image") {
                        setPendingImage({
                          page: pageNumber,
                          xPercent: x,
                          yPercent: y,
                        });
                        imageInputRef.current.click();
                        return;
                      }

                      setElements((p) => [
                        ...p,
                        {
                          id: Date.now(),
                          page: pageNumber,
                          type: activeTool,
                          xPercent: x,
                          yPercent: y,
                          widthPercent: 0.25,
                          heightPercent: 0.06,
                          value:
                            activeTool === "date"
                              ? new Date()
                                  .toISOString()
                                  .slice(0, 10)
                              : "",
                          color: "#000000",
                        },
                      ]);
                    }}
                  />

                  {elements
                    .filter((el) => el.page === pageNumber)
                    .map((el) => (
                      <DraggableElement
                        key={el.id}
                        element={el}
                        pageRect={pageRefs.current[
                          pageNumber
                        ]?.getBoundingClientRect()}
                        onUpdate={updateElement}
                        onDelete={removeElement}
                        onSelect={setSelectedElementId}
                        selected={el.id === selectedElementId}
                      />
                    ))}
                </div>
              );
            })}
          </Document>
        </div>
      </div>

      {showSignaturePad && (
        <SignaturePad
          onSave={handleSignatureSave}
          onClose={() => setShowSignaturePad(false)}
        />
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) =>
          handleImageUpload(e.target.files[0])
        }
      />
    </div>
  );
};

export default PdfEditor;