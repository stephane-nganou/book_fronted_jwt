import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ManageBookComponent } from './manage-book.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/services';
import { of, throwError } from 'rxjs';
import { DefaulErrorHandlerService } from '../../../services/error/default-error-handler.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BookResponse } from '../../../services/models';

/*
Tests used when no signal are used

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
    // prepare
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

  it('should create ManageBookComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('ManageBookComponent ngOnInit', () => {
    it('should initialize with empty bookRequest when no bookId is provided', () => {
      // test
      fixture.detectChanges();

      // verify
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
      // prepare
      activatedRouteSpy.snapshot.params = { bookId: '1' };
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
      // prepare
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const event = { target: { files: [file] } };
      const readerResult = 'data:image/jpeg;base64,test-data';
      const mockFileReader = {
        result: undefined as string | undefined,
        onload: undefined as (() => void) | undefined,
        readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(() => {
          mockFileReader.result = readerResult;
          if (mockFileReader.onload) {
            mockFileReader.onload();
          }
        })
      };
      spyOn(window, 'FileReader').and.returnValue(mockFileReader as any);

      // test
      component.onFileSelected(event);

      // verify
      expect(component.selectedBookCover).toBe(file);
      expect(window.FileReader).toHaveBeenCalled();
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
      expect(component.selectedPicture).toBe(readerResult);
    });

    it('should not set selectedPicture when no file is selected', () => {
      // prepare
      const event = { target: { files: [] } };

      // test
      component.onFileSelected(event);

      // verify
      expect(component.selectedBookCover).toBeUndefined();
      expect(component.selectedPicture).toBeUndefined();
    });

  });

  describe('saveBook', () => {
    it('should save book and upload cover picture when successful', () => {
      // prepare
      bookServiceSpy.saveBook.and.returnValue(of(1));
      bookServiceSpy.uploadBookCoverPicture.and.returnValue(of());
      component.selectedBookCover = new File([''], 'test.jpg');
      component.bookRequest = mockBookRequest;

      // test
      component.saveBook();

      // verify
      expect(bookServiceSpy.saveBook).toHaveBeenCalledWith({ body: component.bookRequest });
      expect(bookServiceSpy.uploadBookCoverPicture).toHaveBeenCalledWith({
        'book-id': 1,
        body: { file: component.selectedBookCover }
      });
      expect(component.errorMsg).toEqual([]);
    });

    it('should handle save book error with validation errors', () => {
      // prepare
      bookServiceSpy.saveBook.and.returnValue(throwError(() => ({
        error: mockApiErrorResponse
      })));
      jsonParserServiceSpy.parseErrorResponse.and.returnValue(mockApiErrorResponse);

      // test
      component.saveBook();

      // verify
      expect(bookServiceSpy.saveBook).toHaveBeenCalled();
      expect(component.errorMsg).toEqual(mockApiErrorResponse.validationErrors);
    });
  });

  describe('template', () => {
    it('should display error messages when errorMsg is not empty', () => {
      // test
      component.errorMsg = ['Error 1', 'Error 2'];

      fixture.detectChanges();
      const errorElements = fixture.debugElement.queryAll(By.css('.alert-danger p'));

      // verify
      expect(errorElements.length).toBe(2);
      expect(errorElements[0].nativeElement.textContent).toBe('Error 1');
      expect(errorElements[1].nativeElement.textContent).toBe('Error 2');
    });


    it('should bind from inputs to bookRequest properties', async () => {
      // prepare
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

      // test
      fixture.detectChanges();
      await fixture.whenStable();

      // verify
      expect(component.bookRequest.title).toBe(mockBookRequest.title);
      expect(component.bookRequest.author_name).toBe(mockBookRequest.author_name);
      expect(component.bookRequest.isbn).toBe(mockBookRequest.isbn);
      expect(component.bookRequest.synopsis).toBe(mockBookRequest.synopsis);
      expect(component.bookRequest.shareable).toBe(mockBookRequest.shareable);
    });

    it('should call saveBook when save button is clicked', () => {
      // prepare
      spyOn(component, 'saveBook');
      fixture.detectChanges();
      const saveButton = fixture.debugElement.query(By.css('.btn-outline-primary')).nativeElement;

      // test
      saveButton.click();

      // verify
      expect(component.saveBook).toHaveBeenCalled();
    });
  });


}); */

describe('ManageBookComponent', () => {
  let fixture: ComponentFixture<ManageBookComponent>;
  let component: ManageBookComponent;

  let bookService: jasmine.SpyObj<BookService>;
  let errorHandler: jasmine.SpyObj<DefaulErrorHandlerService>;
  let router: Router;
  let activatedRouteStub: ActivatedRoute;

  const mockBook = (overrides: Partial<BookResponse> = {}) => ({
    id: 123,
    title: 'My Title',
    author_name: 'Author',
    isbn: 'ISBN-123',
    synopsis: 'Synopsis',
    shareable: true,
    cover: 'BASE64COVER',
    archived: false,
    owner: 'Greatness Sr.',
    rate: 3,
    ...overrides,
  });

  beforeEach(async () => {
    bookService = jasmine.createSpyObj<BookService>('BookService', [
      'findBookById',
      'saveBook',
      'uploadBookCoverPicture',
    ]);
    errorHandler = jasmine.createSpyObj<DefaulErrorHandlerService>(
      'DefaulErrorHandlerService',
      ['handleError']
    );

    // Provide a mutable stub for ActivatedRoute once
    activatedRouteStub = {
      snapshot: { params: {} },
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [ManageBookComponent, RouterTestingModule],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: DefaulErrorHandlerService, useValue: errorHandler },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  function createComponentWithParams(params: Record<string, any>) {
    // Mutate the stub before component creation
    (activatedRouteStub.snapshot as any).params = params;
    fixture = TestBed.createComponent(ManageBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create the component', () => {
    createComponentWithParams({});
    expect(component).toBeTruthy();
  });

  it('should fetch book by id and populate state when bookId param is present', () => {
    const response = mockBook();
    bookService.findBookById.and.returnValue(of(response));

    createComponentWithParams({ bookId: 123 });

    expect(bookService.findBookById).toHaveBeenCalledWith({ 'book-id': 123 });
    expect(component.bookRequest()).toEqual({
      id: response.id,
      title: response.title,
      author_name: response.author_name,
      isbn: response.isbn,
      synopsis: response.synopsis,
      shareable: response.shareable,
    });
    expect(component.selectedPicture()).toBe(
      `data:image/jpg;base64,${response.cover}`
    );
    expect(component.errorMsg()).toEqual([]);
  });

  it('should not call findBookById when no bookId param is present', () => {
    createComponentWithParams({});
    expect(bookService.findBookById).not.toHaveBeenCalled();
  });

  it('should set selectedPicture only when cover exists', () => {
    const response = mockBook({ cover: '' });
    bookService.findBookById.and.returnValue(of(response));

    createComponentWithParams({ bookId: 123 });

    expect(component.selectedPicture()).toBeUndefined();
  });

  it('should set error messages when saveBook fails', () => {
    createComponentWithParams({});
    const err = new Error('save failed');
    bookService.saveBook.and.returnValue(throwError(() => err));
    errorHandler.handleError.and.returnValue(['failed to save']);

    component.saveBook();

    expect(errorHandler.handleError).toHaveBeenCalledWith(err as unknown);
    expect(component.errorMsg()).toEqual(['failed to save']);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate after saving when no cover is selected', () => {
    createComponentWithParams({});
    bookService.saveBook.and.returnValue(of(42));

    component.saveBook();

    expect(bookService.saveBook).toHaveBeenCalledWith({
      body: component.bookRequest(),
    });
    expect(bookService.uploadBookCoverPicture).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/books/my-books']);
    expect(component.errorMsg()).toEqual([]);
  });

  it('should upload cover and navigate when a cover is selected', () => {
    createComponentWithParams({});
    const file = new File(['x'], 'cover.jpg', { type: 'image/jpeg' });
    component.selectedBookCover.set(file);

    bookService.saveBook.and.returnValue(of(77));
    bookService.uploadBookCoverPicture.and.returnValue(of(void 0));

    component.saveBook();

    expect(bookService.saveBook).toHaveBeenCalledWith({
      body: component.bookRequest(),
    });
    expect(bookService.uploadBookCoverPicture).toHaveBeenCalledWith({
      'book-id': 77,
      body: { file },
    });
    expect(router.navigate).toHaveBeenCalledWith(['/books/my-books']);
    expect(component.errorMsg()).toEqual([]);
  });

  describe('onFileSelected', () => {
    beforeEach(() => {
      spyOn(window as any, 'FileReader').and.callFake(function () {
        const reader = {
          result: null as string | ArrayBuffer | null,
          onload: null as
            | ((this: FileReader, ev: ProgressEvent<FileReader>) => any)
            | null,
          readAsDataURL: function (this: FileReader, _file: Blob) {
            (this as any).result = 'data:image/png;base64,FAKE';
            setTimeout(() => {
              // Cast ProgressEvent to the expected generic and ensure correct this
              const ev = new ProgressEvent(
                'load'
              ) as unknown as ProgressEvent<FileReader>;
              (this.onload as any)?.call(this, ev);
            }, 0);
          },
        } as unknown as FileReader;

        return reader;
      });
    });
    /*beforeEach(() => {
      // Stub the global FileReader constructor with a minimal object
      spyOn(window as any, 'FileReader').and.callFake(() => {
        const mock = {
          result: null as string | ArrayBuffer | null,
          onload: null as
            | ((this: FileReader, ev: ProgressEvent<FileReader>) => any)
            | null,
          readAsDataURL(_file: Blob) {
            // use any to avoid "this" context typing issues
            (mock as any).result = 'data:image/png;base64,FAKE';
            setTimeout(
              () => (mock as any).onload?.(new ProgressEvent('load')),
              0
            );
          },
        };
        return mock as unknown as FileReader;
      });
    });*/

    it('should store selected file and preview data URL', fakeAsync(() => {
      createComponentWithParams({});
      const file = new File(['content'], 'cover.png', { type: 'image/png' });
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileSelected(event);
      tick();

      expect(component.selectedBookCover()).toBe(file);
      expect(component.selectedPicture()).toBe('data:image/png;base64,FAKE');
    }));
    
    it('should ignore when no file is selected', () => {
      createComponentWithParams({});
      const event = { target: { files: [] } } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedBookCover()).toBeNull();
      expect(component.selectedPicture()).toBeUndefined();
    });
    
 

  it('should render and allow Save button click to trigger saveBook', () => {
    createComponentWithParams({});
    spyOn(component, 'saveBook').and.callThrough();

    const button: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button).not.toBeNull();

    button!.click();
    expect(component.saveBook).toHaveBeenCalled();
  });
/*
  it('should render error messages when present', () => {
    createComponentWithParams({});
    component.errorMsg.set(['e1', 'e2']);
    fixture.detectChanges();

    const alerts = fixture.nativeElement.querySelectorAll(
      '.alert.alert-danger p'
    );
    expect(alerts.length).toBe(2);
    expect(alerts[0].textContent.trim()).toBe('e1');
    expect(alerts[1].textContent.trim()).toBe('e2');
  });
  */
  });
});
