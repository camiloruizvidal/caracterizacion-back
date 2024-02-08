export interface ISearchPagination {
  page: number;
  perPage: number;
}

export interface IPaginationResult {
  data: any;
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
