import { Component, computed, effect, signal } from '@angular/core';
import { PageBorrowedBookResponse } from '../../../services/models/page-borrowed-book-response';
import { NgIf, NgClass, NgFor} from '@angular/common';
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
  imports: [NgIf, FormsModule, RatingComponent, NgClass, NgFor],
  templateUrl: './borrow-books.component.html',
  styleUrl: './borrow-books.component.css'
})
export class BorrowBooksComponent {

  page = signal<number>(0);
  size = signal<number>(10);
  message = signal<string[]>([]);
  level = signal<string>('success');
  borrowedBooksResponse = signal<PageBorrowedBookResponse>({
    content: [],
    first: false,
    last: false,
    number: 0,
    size: 0,
    total_elements: 0,
    total_pages: 0
  });

  selectedBookResponse = signal<BorrowedBookResponse | undefined>(undefined);
  feedbackRequest = signal<FeedbackRequest>({
    book_id: 0,
    comment: '',
    note: 0
  });

  isLastPage = computed(() => {
    if (this.borrowedBooksResponse().total_elements === 0) {
      return true;
    } else {
      return this.page() === this.borrowedBooksResponse().total_pages as number - 1;
    }
  });

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
        this.message.set(this.errorHandlerService.handleError(error));
      }
    });
  }

  returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBookResponse.set(book);
    this.feedbackRequest.update(req => ({ ...req, book_id: book.id }));
  }

  goToPage(page: number) {
    if (this.borrowedBooksResponse()) {
      if (page < 0 || page > this.borrowedBooksResponse()!.total_pages) {
        this.page.set(0);
      } else {
        this.page.set(page);
      }

      this.getAllBorrowedBooks()
    }

  }

  goToLastPage() {
    let totalPages = this.borrowedBooksResponse()?.total_pages ?? 1;
    totalPages = (totalPages <= 0) ? 0 : totalPages - 1
    this.page.set(totalPages);
    this.getAllBorrowedBooks();
  }

  goToNextPage() {
    this.page.update(current => current + 1);
    this.getAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page.update(current => current - 1);
    this.getAllBorrowedBooks();
  }

  goToFirstPage() {
    this.page.set(0);
    this.getAllBorrowedBooks();
  }

  getAllBorrowedBooks() {
    this.bookService.getAllBorrowedBooks({
      page: this.page(),
      size: this.size()
    }).subscribe({
      next: (response: PageResponse) => {
        this.borrowedBooksResponse.set(response as PageBorrowedBookResponse);
      },
      error: (error) => {
        this.message.set(this.errorHandlerService.handleError(error));
      }
    })
  }

  private giveFeedback() {
    this.feedbackService.saveFeedback({
      body: this.feedbackRequest()
    }).subscribe({
      next: () => { },
      error: (error) => {
        this.message.set(this.errorHandlerService.handleError(error));
      }
    })
  }

}
