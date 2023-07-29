export type PaginationResult = {
  page: number;
  offset: number;
  perPage: number;
  count: number;
  hasPrevious: boolean;
  hasNext: boolean;
  pages: number;
};

export function getPagination(
  page: number | string = 1,
  perPage: number = 10,
  count: number
): PaginationResult {
  let parsedPage = Number(page as string);
  if (parsedPage < 1) {
    parsedPage = 1;
  }

  const offset = perPage * (parsedPage - 1);
  const hasNext = offset + perPage < count;
  const hasPrevious = parsedPage > 1;

  return {
    count,
    page: parsedPage,
    perPage,
    pages: Math.ceil(count / perPage),
    offset,
    hasNext,
    hasPrevious,
  };
}
