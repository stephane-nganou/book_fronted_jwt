import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/services';
import { JsonParserService } from '../../../services/json-parser.service';
import { Router } from '@angular/router';
import { PageBookResponse } from '../../../services/models/page-book-response';
import { BookResponse, PageResponse } from '../../../services/models';
import { ApiErrorResponse } from '../../../services/models/api-error-response';
import { BookCardComponent } from "../book-card/book-card.component";
import { NgFor } from '@angular/common';

/**
 * @fileoverview MyBooksComponent, purpose of displaying own published books
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-my-books',
  imports: [BookCardComponent, NgFor],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.css'
})
export class MyBooksComponent implements OnInit {

  page: number = 0;
  size: number = 10;
  message: string = '';
  level: string = 'success';

  bookResponse?: PageBookResponse;


  constructor(
    private bookService: BookService,
    private errorParserService: JsonParserService,
    private router: Router) {}

  ngOnInit(): void {
    this.findAllBooks();
  }

  archiveBook(book: BookResponse) {
    this.message = '';
    this.bookService.updateArchiveStatus({
      "book-id": book.id as number
    }).subscribe({
      next: () => {
        book.archived = !book.archived;
        this.level = 'success';
        this.message = "successful update"
      },
      error: (error) => {
        this.level = 'error';
        this.handleError(error);
        },
    })
  }

  shareBook(book: BookResponse) {
    this.bookService.updateShareableStatus({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        book.shareable = !book.shareable;
        this.level = 'success';
        this.message = "successful update"
      },
      error: (error) => {
        this.handleError(error);
      }
      
    })
  }

  editBook(book: BookResponse) {
    this.router.navigate(['books', 'manage', book.id]);
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

  isLastPage(): boolean {
    if (this.bookResponse === undefined || this.bookResponse === null) {
      return true;
    } else {
      return this.page === this.bookResponse?.total_pages as number - 1;
    }
  }

  private findAllBooks() {
    this.bookService
      .getAllBooksByOwner({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (books: PageResponse) => {
          this.bookResponse = books as PageBookResponse;
        },
        error: (error) => {
          this.level = 'error';
          this.handleError(error);
        }
      });
  }

  private handleError(error: any) {
    const parsedError: ApiErrorResponse = this.errorParserService.parseErrorResponse(error.error);
    this.message = parsedError.errorMessage;
    console.log(error);
  }
}
