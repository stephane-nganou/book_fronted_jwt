import { BookResponse } from "./book-response";

export interface PageBookResponse {
  content: Array<BookResponse>;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  total_elements: number;
  total_pages: number;
}