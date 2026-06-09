export default function TablePagination({ page = 1, totalPages = 1, onNext, onPrev }) {
  const btnBase = "inline-flex items-center px-4 py-2 text-sm font-medium transition-all border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed shadow-sm";
  const btnActive = "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300";

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-900">{page}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button 
          onClick={onPrev} 
          disabled={page === 1} 
          className={`${btnBase} ${btnActive}`}
        >
          Previous
        </button>
        <button 
          onClick={onNext} 
          disabled={page === totalPages} 
          className={`${btnBase} ${btnActive}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}