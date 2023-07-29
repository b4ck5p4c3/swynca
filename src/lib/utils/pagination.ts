export type PaginationResult = {
  page: number;
  offset: number;
  perPage: number;
  count: number;
};

export function getPagination(
  page: number | string = 0,
  perPage: number = 10,
  count: number
): PaginationResult {
  const parsedPage = Number(page as string);

  if (Number.isNaN(parsedPage)) {
    return { page: 0, offset: 0, perPage: 10, count };
  }

  return {
    count,
    page: parsedPage,
    perPage,
    offset: perPage * parsedPage,
  };
}
