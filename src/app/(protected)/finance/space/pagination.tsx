"use client";

import { PaginationResult } from "@/lib/utils/pagination";
import classNames from "classnames";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

export type PaginationProps = {
  pagination: PaginationResult;
};

function paginationHelper(totalPages: number, currentPage: number) {
  const MAX_PAGES = 6;
  let pagesArray = [];
  let hasMore = false;

  // Calculate the start and end page index based on the current page
  const halfMaxPages = Math.floor(MAX_PAGES / 2);
  let startPage = Math.max(currentPage - halfMaxPages, 1);
  let endPage = Math.min(startPage + MAX_PAGES - 1, totalPages);

  // Adjust the start and end page index if necessary
  if (endPage - startPage < MAX_PAGES - 1) {
    startPage = Math.max(endPage - MAX_PAGES + 1, 1);
  }

  // Populate the pagesArray with page indexes
  for (let i = startPage; i <= endPage; i++) {
    pagesArray.push(i);
  }

  return pagesArray;
}

const Pagination: React.FC<PaginationProps> = ({ pagination }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams() as ReadonlyURLSearchParams & {
    size: number;
  };

  const entries = paginationHelper(pagination.pages, pagination.page);

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    push(`${pathname}?${params.toString()}`);
  };

  const from = pagination.offset || 1;
  let to = pagination.offset + pagination.perPage;
  if (to > pagination.count) {
    to = pagination.count;
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{from}</span> to{" "}
            <span className="font-medium">{to}</span> of{" "}
            <span className="font-medium">{pagination.count}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {pagination.hasPrevious && (
              <button
                className="px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 rounded-l-md"
                onClick={() => goTo(pagination.page - 1)}
              >
                <span>❮</span>
              </button>
            )}
            {entries.map((idx, pos) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={classNames(
                  "px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0",
                  {
                    "rounded-l-md": idx === 1 && !pagination.hasPrevious,
                    "rounded-r-md":
                      pos === entries.length - 1 && !pagination.hasNext,
                    "bg-violet-600 ring-violet-600 hover:bg-violet-600 text-white":
                      pagination.page === idx,
                  }
                )}
              >
                <span>{idx}</span>
              </button>
            ))}
            {pagination.hasNext && (
              <button
                className="px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 rounded-r-md"
                onClick={() => goTo(pagination.page + 1)}
              >
                <span>❯</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
