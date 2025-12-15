import PdfCard from "./PdfCard";

const PdfGrid = ({ pdfs, onOpen }) => {
  if (!pdfs.length) {
    return (
      <div className="text-center text-[rgb(var(--muted))] mt-24">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pdfs.map((pdf) => (
        <div key={pdf._id} onClick={() => onOpen(pdf._id)}>
          <PdfCard title={pdf.title} />
        </div>
      ))}
    </div>
  );
};

export default PdfGrid;
