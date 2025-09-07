import { Component, OnInit } from '@angular/core';
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
export class BooksComponent implements OnInit {

  page: number = 0;
  size: number = 10;
  message: Array<string> = [];
  level: string = 'success';

  bookResponse?: PageBookResponse;


  constructor(
    private bookService: BookService,
    private errorHandlerService: DefaulErrorHandlerService,
    private router: Router) {}

  ngOnInit(): void {
    this.findAllBooks();
  }

  borrowBook(book: BookResponse) {
    this.message = [];
    this.bookService.borrowBook({
      "book-id": book.id as number
    }).subscribe({
      next: (bookId) => {
        this.level = 'success';
        this.message.push(`Book nr: ${bookId} successfully borrowed`);
      },
      error: (error) => {
        this.level = 'error';
        this.message = this.errorHandlerService.handleError(error);
        },
    })
  }

  goToPage(page: number) {
    this.page = page;
    this.findAllBooks();
  }

  goToLastPage() {
    this.page = this.bookResponse?.total_pages as number - 1;
    this.findAllBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBooks();
  }

  get isLastPage(): boolean {
    return this.page === this.bookResponse?.total_pages as number - 1;
  }

  private findAllBooks() {
    this.bookService
      .getAllBooks({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (books: PageResponse) => {
          this.level = 'success';
          this.bookResponse = books as PageBookResponse;
        },
        error: (error) => {
          this.level = 'error';
          this.message = this.errorHandlerService.handleError(error);
        }
      });
  }

}
