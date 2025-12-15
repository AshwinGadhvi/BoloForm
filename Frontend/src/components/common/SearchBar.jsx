const SearchBar = ({ value, onChange }) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder="Search PDFs..."
      className="px-4 py-2 rounded-lg
                 bg-[rgb(var(--panel))]
                 border border-[rgb(var(--border))]
                 focus:outline-none"
    />
  );
};

export default SearchBar;
