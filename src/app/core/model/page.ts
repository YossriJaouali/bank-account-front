export interface Page<T> {
  page: number;
  total: number;
  numberOfPages: number;
  pageSize: number;
  content: T[];
}
