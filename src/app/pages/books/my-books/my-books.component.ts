import { Component, computed, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../services/services';
import { JsonParserService } from '../../../services/json-parser.service';
import { Router } from '@angular/router';
import { PageBookResponse } from '../../../services/models/page-book-response';
import { BookResponse, PageResponse } from '../../../services/models';
import { ApiErrorResponse } from '../../../services/models/api-error-response';
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

  /*
  page: number = 0;
  size: number = 10;
  message: string = '';
  level: string = 'success';
  bookResponse?: PageBookResponse;
  */

  page = signal<number>(0);
  size = signal<number>(10);
  message = signal<string[]>([]);
  level = signal<string>('success');

  bookResponse = signal<PageBookResponse | undefined>(undefined);

  isLastPage = computed(() => {
    const response = this.bookResponse();
    if(!response){
      return true;
    }else{
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
  };

  /*
  ngOnInit(): void {
    this.findAllBooks();
  } */

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
    this.page.set(page);
    //this.findAllBooks();
  }

  goToLastPage() {
    //this.page = this.bookResponse?.total_pages as number - 1;
    //this.findAllBooks();
    const totalPages = this.bookResponse()?.total_pages ?? 0;
    this.page.set(totalPages - 1);
  }

  goToNextPage() {
    //this.page++;
    //this.findAllBooks();
    this.page.update((current) => current + 1);
  }

  goToPreviousPage() {
    //this.page--;
    //this.findAllBooks();
    this.page.update((current) => current - 1);
  }

  goToFirstPage() {
    //this.page = 0;
    //this.findAllBooks();
    this.page.set(0);
  }

  /*
  isLastPage(): boolean {
    if (this.bookResponse === undefined || this.bookResponse === null) {
      return true;
    } else {
      return this.page === this.bookResponse?.total_pages as number - 1;
    }
  }
  */

  private findAllBooks() {
    this.bookService
      .getAllBooksByOwner({
        page: this.page(),
        size: this.size(),
      })
      .subscribe({
        next: (books: PageResponse) => {
          this.bookResponse.set(books as PageBookResponse);
        },
        error: (error) => {
          this.level.set('error');
          this.message.set(this.errorHandlerService.handleError(error));
        }
      });
  }

}
