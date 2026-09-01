// components/Pagination.tsx
import { usePaginationRange } from "./PaginationRange";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Paginator({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const range = usePaginationRange({ currentPage, totalPages });

  return (
    <nav className="flex items-center justify-center gap-1">
      {/* Seta esquerda */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          flex size-10 md:size-11 
          items-center justify-center rounded-md border border-gray-300
          text-white transition 
          hover:bg-gray-100 hover:text-gray-600
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        &#8592;
      </button>

      {range.map((item, idx) =>
        item === "..." ? (
          <span key={`dots-${idx}`} className="flex size-10 md:size-11  items-center justify-center text-white">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`flex size-9 md:size-10 items-center justify-center rounded-md text-sm transition
              ${item === currentPage
                ? "bg-blue-600 text-white font-bold"
                : "border border-gray-300 text-white hover:bg-gray-100 hover:text-gray-600 font-semibold"
              }`}
          >
            {item}
          </button>
        )
      )}

      {/* Seta direita */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          flex h-9 w-9 items-center justify-center rounded-md border border-gray-300
          text-white transition 
          hover:bg-gray-100 hover:text-gray-600
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        &#8594;
      </button>
    </nav>
  );
}