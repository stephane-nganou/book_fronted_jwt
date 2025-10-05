import { BorrowedBookResponse } from "./borrowed-book-response";

export interface PageBorrowedBookResponse {
  content: Array<BorrowedBookResponse>;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  total_elements: number;
  total_pages: number;
}