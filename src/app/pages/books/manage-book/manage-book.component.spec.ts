import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ManageBookComponent } from './manage-book.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/services';
import { JsonParserService } from '../../../services/json-parser.service';
import { of, throwError, timestamp } from 'rxjs';
import { BookRequest, BookResponse } from '../../../services/models';
import { By } from '@angular/platform-browser';
import { ApiErrorResponse } from '../../../services/models/api-error-response';

describe('ManageBookComponent', () => {
  let component: ManageBookComponent;
  let fixture: ComponentFixture<ManageBookComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let jsonParserServiceSpy: jasmine.SpyObj<JsonParserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: { snapshot: { params: { bookId?: string } } };

  
  const mockBookResponse: BookResponse = {
      id: 1,
      title: 'Test Book',
      author_name: 'Test Author',
      isbn: '1234567890',
      synopsis: 'Test Synopsis',
      shareable: true,
      cover: 'test-cover-base64',
      archived: false,
      owner: '',
      rate: 0
  };

  const mockBookRequest: BookRequest = {
      author_name: 'Test Author',
      isbn: '1234567890',
      shareable: false,
      synopsis: 'Test Synopsis',
      title: 'Test Book'
  };
  
  const mockApiErrorResponse: ApiErrorResponse = {
      timestamp: '2025-08-31T18:11:00Z',
      errorMessage: 'Test error',
      validationErrors: ['Validation error 1', 'Validation error 2'],
      details: ''
  };

  beforeEach(async () => {
    bookServiceSpy = jasmine.createSpyObj('BookService', ['findBookById', 'saveBook', 'uploadBookCoverPicture']);
    jsonParserServiceSpy = jasmine.createSpyObj('JsonParserService', ['parseErrorResponse']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = {
      snapshot: {
        params: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ManageBookComponent],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: JsonParserService, useValue: jsonParserServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageBookComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize with empty bookRequest when no bookId is provided', () => {
        fixture.detectChanges();
        expect(component.bookRequest).toEqual({
            author_name: '',
            isbn: '',
            shareable: false,
            synopsis: '',
            title: ''
        });
        expect(bookServiceSpy.findBookById).not.toHaveBeenCalled();
    });

    it('should load book data when bookId is provided', () => {
        activatedRouteSpy.snapshot.params = {bookId: '1'};
        bookServiceSpy.findBookById.and.returnValue(of(mockBookResponse));
        fixture.detectChanges();

        //expect(bookServiceSpy.findBookById).toHaveBeenCalledWith({'book-id': 1});
        expect(component.bookRequest).toEqual({
            id: mockBookResponse.id,
            title: mockBookResponse.title,
            author_name: mockBookResponse.author_name,
            isbn: mockBookResponse.isbn,
            synopsis: mockBookResponse.synopsis,
            shareable: mockBookResponse.shareable,
        });
        expect(component.selectedPicture).toBe(`data:image/jpg;base64,${mockBookResponse.cover}`);
    });
  });

  describe('onFileSelected', () => {
    it('should set selectedBookCover and selectedPicture when file is selected', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const event = { target: { files: [file] } };
      const readerResult = 'data:image/jpeg;base64,test-data';
      const mockFileReader = {
        result: null as string | null,
        onload: null as (() => void) | null,
        readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(() => {
          mockFileReader.result = readerResult;
          if (mockFileReader.onload) {
            mockFileReader.onload();
          }
        })
      };
      spyOn(window, 'FileReader').and.returnValue(mockFileReader as any);

      component.onFileSelected(event);

      expect(component.selectedBookCover).toBe(file);
      expect(window.FileReader).toHaveBeenCalled();
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
      expect(component.selectedPicture).toBe(readerResult);
    });

    it('should not set selectedPicture when no file is selected', () => {
        const event = {target: {files: []}};
        component.onFileSelected(event);
        expect(component.selectedBookCover).toBeUndefined();
        expect(component.selectedPicture).toBeUndefined();
    });

  });

  describe('saveBook', () => {
    it('should save book and upload cover picture when successful', () => {
        bookServiceSpy.saveBook.and.returnValue(of(1));
        bookServiceSpy.uploadBookCoverPicture.and.returnValue(of());
        component.selectedBookCover = new File([''], 'test.jpg');
        component.bookRequest = mockBookRequest;

        component.saveBook();

        expect(bookServiceSpy.saveBook).toHaveBeenCalledWith({body: component.bookRequest});
        expect(bookServiceSpy.uploadBookCoverPicture).toHaveBeenCalledWith({
            'book-id': 1,
            body: {file: component.selectedBookCover}
        });
        expect(component.errorMsg).toEqual([]);
    });

    it('should handle save book error with validation errors', () => {
        bookServiceSpy.saveBook.and.returnValue(throwError(() => ({
            error: mockApiErrorResponse
        })));
        jsonParserServiceSpy.parseErrorResponse.and.returnValue(mockApiErrorResponse);

        component.saveBook();

        expect(bookServiceSpy.saveBook).toHaveBeenCalled();
        expect(component.errorMsg).toEqual(mockApiErrorResponse.validationErrors);
    });
  });

  describe('template', () => {
    it('should display error messages when errorMsg is not empty', () => {
        component.errorMsg = ['Error 1', 'Error 2'];
        fixture.detectChanges();

        const errorElements = fixture.debugElement.queryAll(By.css('.alert-danger p'));
        expect(errorElements.length).toBe(2);
        expect(errorElements[0].nativeElement.textContent).toBe('Error 1');
        expect(errorElements[1].nativeElement.textContent).toBe('Error 2');
    });

    
    it('should bind from inputs to bookRequest properties', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const titleInput = fixture.debugElement.query(By.css('#title')).nativeElement;
        const authorInput = fixture.debugElement.query(By.css('#author_name')).nativeElement;
        const isbnInput = fixture.debugElement.query(By.css('#isbn')).nativeElement;
        const synopsisInput = fixture.debugElement.query(By.css('#synopsis')).nativeElement;
        const shareableInput = fixture.debugElement.query(By.css('#shareable')).nativeElement;

        titleInput.value = mockBookRequest.title;
        titleInput.dispatchEvent(new Event('input'));
        authorInput.value = mockBookRequest.author_name;
        authorInput.dispatchEvent(new Event('input'));
        isbnInput.value = mockBookRequest.isbn;
        isbnInput.dispatchEvent(new Event('input'));
        synopsisInput.value = mockBookRequest.synopsis;
        synopsisInput.dispatchEvent(new Event('input'));
        shareableInput.value = mockBookRequest.shareable;
        shareableInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.bookRequest.title).toBe(mockBookRequest.title);
        expect(component.bookRequest.author_name).toBe(mockBookRequest.author_name);
        expect(component.bookRequest.isbn).toBe(mockBookRequest.isbn);
        expect(component.bookRequest.synopsis).toBe(mockBookRequest.synopsis);
        expect(component.bookRequest.shareable).toBe(mockBookRequest.shareable);
    });

    it('should call saveBook when save button is clicked', () => {
        spyOn(component, 'saveBook');
        fixture.detectChanges();

        const saveButton = fixture.debugElement.query(By.css('.btn-outline-primary')).nativeElement;
        saveButton.click();

        expect(component.saveBook).toHaveBeenCalled();
    });
  });

  



  
});