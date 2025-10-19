import { Component, computed, signal, effect } from '@angular/core';
import { BookService } from '../../services/services';
import { Router } from '@angular/router';
import { BookResponse, PageResponse } from '../../services/models';
import { NgFor } from '@angular/common';
import { PageBookResponse } from '../../services/models/page-book-response';
import { BookCardComponent } from './book-card/book-card.component';
import { DefaulErrorHandlerService } from '../../services/error/default-error-handler.service';

/**
 * @fileoverview BooksComponent, purpose of managing the whole books structure
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-books',
  imports: [NgFor, BookCardComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent {

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
      return this.page() === response.total_pages as number - 1;
    }
  });

  constructor(
    private bookService: BookService,
    private errorHandlerService: DefaulErrorHandlerService,
    private router: Router) {
    effect(() => {
      this.findAllBooks();
    });
  }


  borrowBook(book: BookResponse) {
    this.message.set([]);
    this.bookService.borrowBook({
      "book-id": book.id as number
    }).subscribe({
      next: (bookId) => {
        this.level.set('success');
        this.message.set([`Book nr: ${bookId} successfully borrowed`])
      },
      error: (error) => {
        this.level.set('error');
        this.message.set(this.errorHandlerService.handleError(error));
      },
    })
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
      .getAllBooks({
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
