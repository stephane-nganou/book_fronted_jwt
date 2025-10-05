import { Component, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookRequest, BookResponse } from '../../../services/models';
import { FormsModule } from "@angular/forms";
import { BookService } from '../../../services/services';
import { DefaulErrorHandlerService } from '../../../services/error/default-error-handler.service';


/**
 * @fileoverview ManageBookComponent, purpose of editing books and 
 *  adding new one
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-manage-book',
  imports: [FormsModule, RouterLink],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.css'
})
export class ManageBookComponent {
  /*
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
  */

  bookRequest = signal<BookRequest>({
    author_name: '',
    isbn: '',
    shareable: false,
    synopsis: '',
    title: ''
  });

  errorMsg = signal<string[]>([]);
  selectedBookCover = signal<File | null>(null);
  selectedPicture = signal<string | undefined>(undefined);


  constructor(
    private bookService: BookService,
    private errorHandler: DefaulErrorHandlerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    effect(() => {
      const bookId = this.activatedRoute.snapshot.params['bookId'];
      if (bookId) {
        this.bookService.findBookById({
          'book-id': bookId as number
        }).subscribe({
          next: (bookResponse: BookResponse) => {
            this.bookRequest.set({
              id: bookResponse.id,
              title: bookResponse.title as string,
              author_name: bookResponse.author_name as string,
              isbn: bookResponse.isbn as string,
              synopsis: bookResponse.synopsis as string,
              shareable: bookResponse.shareable
            });
            if (bookResponse.cover) {
              this.selectedPicture.set(`data:image/jpg;base64,${bookResponse.cover}`)
            }
          },
          error: (error) => {
            this.errorMsg.set(errorHandler.handleError(error));
          }
        })
      }
    }, { allowSignalWrites: true });
  }

  /*
  ngOnIeffecteffenit(): void {
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

    if (this.selectedBookCover) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  } */

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedBookCover.set(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  saveBook() {
    this.errorMsg.set([]);

    this.bookService.saveBook({
      body: this.bookRequest()
    }).subscribe({
      next: (bookId: number) => {
        this.saveCoverPicture(bookId);
      },
      error: (error) => {
        this.errorMsg.set(this.errorHandler.handleError(error));
      }
    })
  }

  private saveCoverPicture(bookId: number) {
    const cover = this.selectedBookCover();
    if (!cover) {
      this.router.navigate(['/books/my-books']);
      return;

    }

    this.bookService.uploadBookCoverPicture({
        "book-id": bookId,
        body: {
          file: cover
        }
      }).subscribe({
        next: () => {
          this.router.navigate(['/books/my-books']);
          return;
        },
        error: (error) => {
          this.errorMsg.set(this.errorHandler.handleError(error));
        }
      });

  }

}

