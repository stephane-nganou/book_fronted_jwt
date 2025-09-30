import { Component, computed, effect, signal } from '@angular/core';
import { PageBorrowedBookResponse } from '../../../services/models/page-borrowed-book-response';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { BorrowedBookResponse } from '../../../services/models/borrowed-book-response';
import { BookService, FeedbackService } from '../../../services/services';
import { FeedbackRequest, PageResponse } from '../../../services/models';
import { FormsModule } from "@angular/forms";
import { RatingComponent } from "../rating/rating.component";
import { DefaulErrorHandlerService } from '../../../services/error/default-error-handler.service';

/**
 * @fileoverview BorrowBooksComponent, purpose of displaying book that
 *  have been borrowed by the authenticated user
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-borrow-books',
  imports: [NgIf, NgFor, FormsModule, RatingComponent, NgClass],
  templateUrl: './borrow-books.component.html',
  styleUrl: './borrow-books.component.css'
})
export class BorrowBooksComponent {

  borrowedBooksPage = signal<PageBorrowedBookResponse>({
    content: [],
    first: false,
    last: false,
    number: 0,
    size: 0,
    total_elements: 0,
    total_pages: 0
  });

  feedbackRequest = signal<FeedbackRequest>({
    book_id: 0,
    comment: '',
    note: 0
  });

  selectedBookResponse = signal<BorrowedBookResponse | undefined>(undefined);

  page = signal<number>(0);
  size = signal<number>(5);
  errorMsg = signal<string[]>([]);

  isLastPage = computed(() => this.borrowedBooksPage().total_pages - 1);
  pageNumbers = computed(() => Array.from({length: this.borrowedBooksPage().total_pages }, (_, i) => i))

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService,
    private errorHandlerService: DefaulErrorHandlerService
  ) {
    effect(() => {
      this.getAllBorrowedBooks();
    });
  }

  returnBook(withFeedback: boolean) {
    if (!this.selectedBookResponse()) return;
    this.bookService.returnBorrowBook({
      "book-id": this.selectedBookResponse()!.id
    }).subscribe({
      next: () => {
        if (withFeedback) {
          this.giveFeedback();
        }
        this.selectedBookResponse.set(undefined);
        this.getAllBorrowedBooks();
      },
      error: (error) => {
        this.errorMsg.set(this.errorHandlerService.handleError(error));
      }
    });
  }

  returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBookResponse.set(book);
    this.feedbackRequest.update(req => ({ ...req, book_id: book.id }));
  }

  goToPage(page: number) {
    this.page.set(page);
    this.getAllBorrowedBooks();
  }

  goToLastPage() {
    this.page.set(this.borrowedBooksPage().total_pages - 1);
    this.getAllBorrowedBooks(); // will be triggered automatically
  }

  goToNextPage() {
    this.page.set(this.page() + 1);
    this.getAllBorrowedBooks(); // will be triggered automatically
  }

  goToPreviousPage() {
    this.page.update(current => current - 1);
    this.getAllBorrowedBooks(); // will be triggered automatically
  }

  goToFirstPage() {
    this.page.set(0);
  }

  getAllBorrowedBooks() {
    this.bookService.getAllBorrowedBooks({
      page: this.page(),
      size: this.size()
    }).subscribe({
      next: (response: PageResponse) => {
        this.borrowedBooksPage.set(response as PageBorrowedBookResponse);
      },
      error: (error) => {
        this.errorMsg.set(this.errorHandlerService.handleError(error));
      }
    })
  }

  private giveFeedback() {
    this.feedbackService.saveFeedback({
      body: this.feedbackRequest()
    }).subscribe({
      next: () => { },
      error: (error) => {
        this.errorMsg.set(this.errorHandlerService.handleError(error));
      }
    })
  }

}
