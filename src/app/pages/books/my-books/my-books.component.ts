import { Component, computed, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/services';
import { Router } from '@angular/router';
import { PageBookResponse } from '../../../services/models/page-book-response';
import { BookResponse, PageResponse } from '../../../services/models';
import { BookCardComponent } from "../book-card/book-card.component";
import { NgFor } from '@angular/common';
import { DefaulErrorHandlerService } from '../../../services/error/default-error-handler.service';

/**
 * @fileoverview MyBooksComponent, purpose of displaying own published books
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-my-books',
  imports: [BookCardComponent, NgFor, RouterLink],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.css'
})
export class MyBooksComponent {

  page = signal<number>(0);
  size = signal<number>(10);
  message = signal<string[]>([]);
  level = signal<string>('success');

  bookResponse = signal<PageBookResponse | undefined>(undefined);

  isLastPage = computed(() => {
    const response = this.bookResponse();
    if (!response) {
      return true;
    } else {
      return this.page() === response.total_pages as number;
    }
  });


  constructor(
    private bookService: BookService,
    private errorHandlerService: DefaulErrorHandlerService,
    private router: Router) {
    effect(() => {
      this.findAllBooks();
    });
  };

  archiveBook(book: BookResponse) {
    this.message.set([]);
    this.bookService.updateArchiveStatus({
      "book-id": book.id as number
    }).subscribe({
      next: () => {
        book.archived = !book.archived;
        this.level.set('success');
        this.message.set(["successful updated"]);
      },
      error: (error) => {
        this.level.set('error');
        this.message.set(this.errorHandlerService.handleError(error));
      },
    })
  }

  shareBook(book: BookResponse) {
    this.message.set([]);
    this.bookService.updateShareableStatus({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        book.shareable = !book.shareable;
        this.level.set('success');
        this.message.set(['successful update']);
      },
      error: (error) => {
        this.message.set(this.errorHandlerService.handleError(error));
      }

    })
  }

  editBook(book: BookResponse) {
    this.router.navigate(['books', 'manage', book.id]);
  }

  goToPage(page: number) {
    if (this.bookResponse()) {
      if (page < 0 || page > this.bookResponse()!.total_pages) {
        this.page.set(0);
      } else {
        this.page.set(0);
      }

      this.findAllBooks()
    }

  }

  goToLastPage() {
    const totalPages = this.bookResponse()?.total_pages ?? 0;
    this.page.set(totalPages);
    this.findAllBooks();
  }

  goToNextPage() {
    this.page.update((current) => current + 1);
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page.update((current) => current - 1);
    this.findAllBooks();
  }

  goToFirstPage() {
    this.page.set(0);
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService
      .getAllBooksByOwner({
        page: this.page(),
        size: this.size(),
      })
      .subscribe({
        next: (books: PageResponse) => {
          this.level.set('success');
          this.bookResponse.set(books as PageBookResponse);
        },
        error: (error) => {
          this.level.set('error');
          this.message.set(this.errorHandlerService.handleError(error));
        }
      });
  }

}
