import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/services';
import { Router } from '@angular/router';
import { PageResponse } from '../../services/models';
import { NgFor } from '@angular/common';
import { PageBookResponse } from '../../services/models/page-book-response';
import { BookCardComponent } from "./book-card/book-card.component";

@Component({
  selector: 'app-books',
  imports: [NgFor, BookCardComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit{
  page: number = 0;
  size: number = 10;
  bookResponse?: PageBookResponse;

  constructor(
    private bookService: BookService,
    private router: Router
  ){}
  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks(){
    this.bookService.getAllBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (books: PageResponse) =>{
        this.bookResponse = books as PageBookResponse;
      }
    })
  }
}
