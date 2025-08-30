import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookRequest, BookResponse } from '../../../services/models';
import { FormsModule } from "@angular/forms";
import { BookService } from '../../../services/services';
import { JsonParserService } from '../../../services/json-parser.service';
import { ApiErrorResponse } from '../../../services/models/api-error-response';

@Component({
  selector: 'app-manage-book',
  imports: [FormsModule],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.css'
})
export class ManageBookComponent implements OnInit{

  constructor(
    private bookService: BookService,
    private errorParserService: JsonParserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){}

  errorMsg: Array<string> = [];
  bookRequest: BookRequest = {
    author_name: '',
    isbn: '',
    shareable: false,
    synopsis: '',
    title: ''
  };
  selectedBookCover: any;
  selectedPicture?: string;

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];
    if(bookId){
      this.bookService.findBookById({
        'book-id': bookId as number
      }).subscribe({
        next: (bookResponse: BookResponse) => {
          this.bookRequest = {
            id: bookResponse.id,
            title: bookResponse.title as string,
            author_name: bookResponse.author_name as string,
            isbn: bookResponse.isbn as string,
            synopsis: bookResponse.synopsis as string,
            shareable: bookResponse.shareable
          }
          if(bookResponse.cover){
            this.selectedPicture = `data:image/jpg;base64,` + bookResponse.cover;
          }
        }
      })
    }
  }

  onFileSelected(event: any) {
    this.selectedBookCover = event.target.files[0];
    console.log(this.selectedBookCover);

    if(this.selectedBookCover){
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  saveBook(){
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next: (bookId: number) => {
        this.saveCoverPicture(bookId);
      },
      error: (error) => {
        this.handleError(error);
      }
    })
  }

  private saveCoverPicture(bookId: number){
    this.bookService.uploadBookCoverPicture({
      "book-id": bookId,
      body: {
        file: this.selectedBookCover
      }
    }).subscribe({
      next: () =>{
        this.router.navigate(['/books/my-books']);
      },
      error: (error) => {
        this.handleError(error);
      }
    })
  }

  private handleError(error: any) {
    //
    const parsedError: ApiErrorResponse = this.errorParserService.parseErrorResponse(error.error);
    if (null === parsedError.timestamp) {
      this.errorMsg.push('Something went wrong');
      return;
    }
    if (parsedError.validationErrors && parsedError.validationErrors.length > 0) {
      this.errorMsg = parsedError.validationErrors;
    } else {
      this.errorMsg.push(parsedError.errorMessage);
    }
    console.log(error);
  }

}

