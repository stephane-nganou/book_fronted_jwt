
export interface BorrowedBookResponse {
  id: number;
  title: string;
  author_name: string;
  isbn: string;
  rate: number;
  returned: boolean;
  return_approval: boolean;
}
