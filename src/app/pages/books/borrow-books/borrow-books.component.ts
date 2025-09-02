import { Component, OnInit } from '@angular/core';
import { PageBorrowedBookResponse } from '../../../services/models/page-borrowed-book-response';
import { NgFor, NgIf } from '@angular/common';
import { BorrowedBookResponse } from '../../../services/models/borrowed-book-response';
import { BookService, FeedbackService } from '../../../services/services';
import { JsonParserService } from '../../../services/json-parser.service';
import { ApiErrorResponse } from '../../../services/models/api-error-response';
import { FeedbackRequest, PageResponse } from '../../../services/models';
import { FormsModule } from "@angular/forms";
import { RatingComponent } from "../rating/rating.component";

@Component({
  selector: 'app-borrow-books',
  imports: [NgIf, NgFor, FormsModule, RatingComponent],
  templateUrl: './borrow-books.component.html',
  styleUrl: './borrow-books.component.css'
})
export class BorrowBooksComponent implements OnInit {

  borrowedBooksPage: PageBorrowedBookResponse = {
    content: [],
    first: false,
    last: false,
    number: 0,
    size: 0,
    total_elements: 0,
    total_pages: 0
  }
  feedbackRequest: FeedbackRequest = {
    book_id: 0,
    comment: '',
    note: 0
  };
  selectedBookResponse: BorrowedBookResponse | undefined = undefined;

  page: number = 0;
  size: number = 5;
  errorMsg: Array<string> = [];

  constructor(
    private bookService: BookService,
    private errorParserService: JsonParserService,
    private feedbackService: FeedbackService
  ){}

  ngOnInit(): void {
    this.getAllBorrowedBooks();
  }

  returnBook(withFeedback: boolean) {
    this.bookService.returnBorrowBook({
      "book-id": this.selectedBookResponse!.id
    }).subscribe({
      next: () => {
        if(withFeedback){
          this.giveFeedback();
        }
        this.selectedBookResponse = undefined;
        this.getAllBorrowedBooks();
      },
      error: (error) => this.handleError(error)
    })
  }

  returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBookResponse = book;
    this.feedbackRequest.book_id = book.id;
  }

  goToPage(page: number) {
    this.page = page;
    this.getAllBorrowedBooks();
  }

  goToLastPage() {
    this.page = this.borrowedBooksPage?.total_pages as number - 1;
    this.getAllBorrowedBooks();
  }

  goToNextPage() {
    this.page++;
    this.getAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.getAllBorrowedBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.getAllBorrowedBooks();
  }

  get isLastPage(): boolean {
    return this.page === this.borrowedBooksPage?.total_pages as number - 1;
  }

  private getAllBorrowedBooks(){
    this.bookService.getAllBorrowedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next:(response: PageResponse) => {
        this.borrowedBooksPage = response as PageBorrowedBookResponse;
      },
      error: (error) => {
        this.handleError(error);
      }
    })
  }

  private giveFeedback(){
    this.feedbackService.saveFeedback({
      body: this.feedbackRequest
    }).subscribe({
      next: () => {},
      error: (error) => {
        this.handleError(error);
      }
    })
  }

  private handleError(error: any) {
    
    console.log(error);
    const parsedError = this.errorParserService.parseErrorResponse(error.error);
    if (undefined === parsedError.timestamp) {
      this.errorMsg.push('Something went wrong');
      return;
    }
    if (parsedError.validationErrors && parsedError.validationErrors.length > 0) {
      this.errorMsg = parsedError.validationErrors;
      return;
    } else {
      this.errorMsg.push(parsedError.errorMessage);
      return;
    }
  }
  
  

}
