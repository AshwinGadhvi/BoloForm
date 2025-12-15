const PdfCard = ({ title }) => {
  return (
    <div
      className="bg-[rgb(var(--panel))]
                 border border-[rgb(var(--border))]
                 rounded-xl p-5
                 hover:shadow-xl transition">

      <h3 className="font-semibold mb-1">
        {title}
      </h3>

      <p className="text-sm text-[rgb(var(--muted))] mb-4">
        Status: Draft
      </p>

      <div className="flex justify-between text-sm">
        <span className="text-[rgb(var(--muted))]">
          Updated today
        </span>

        <span className="text-[rgb(var(--accent))] font-medium">
          Open →
        </span>
      </div>
    </div>
  );
};

export default PdfCard;
