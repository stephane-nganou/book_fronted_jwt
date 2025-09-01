import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { BorrowBooksComponent } from "./borrow-books.component"
import { BookService, FeedbackService } from "../../../services/services";
import { JsonParserService } from "../../../services/json-parser.service";
import { BorrowedBookResponse } from "../../../services/models/borrowed-book-response";
import { PageBorrowedBookResponse } from "../../../services/models/page-borrowed-book-response";
import { RatingComponent } from "../rating/rating.component";
import { FormsModule } from "@angular/forms";
import { of, throwError } from "rxjs";
import { By } from "@angular/platform-browser";
import { ApiErrorResponse } from "../../../services/models/api-error-response";



describe('BorrowBooksComponent', () => {
    let component: BorrowBooksComponent;
    let fixture: ComponentFixture<BorrowBooksComponent>;
    let bookServiceSpy: jasmine.SpyObj<BookService>;
    let feedbackServceSpy: jasmine.SpyObj<FeedbackService>;
    let jsonParserServiceSpy: jasmine.SpyObj<JsonParserService>;

    const mockBorrowedBookResponse: BorrowedBookResponse = {
        id: 1,
        title: "Test Book",
        author_name: "Test Author",
        isbn: "1234567890",
        rate: 4.5,
        returned: false,
        return_approval: false
    };

    const mockPageResponse: PageBorrowedBookResponse = {
        content: [mockBorrowedBookResponse],
        first: true,
        last: false,
        number: 0,
        size: 5,
        total_elements: 1,
        total_pages: 1
    };

    beforeEach(async () => {
        // prepare
        bookServiceSpy = jasmine.createSpyObj('BookService', ['getAllBorrowedBooks', 'returnBorrowBook']);
        jsonParserServiceSpy = jasmine.createSpyObj('JsonParserService', ['parseErrorResponse']);
        feedbackServceSpy = jasmine.createSpyObj('FeedbackService', ['saveFeedback']);

        await TestBed.configureTestingModule({
            imports: [FormsModule, BorrowBooksComponent, RatingComponent],
            providers: [
                { provide: BookService, useValue: bookServiceSpy },
                { provide: JsonParserService, useValue: jsonParserServiceSpy },
                { provide: FeedbackService, useValue: feedbackServceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BorrowBooksComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        // prepare
        bookServiceSpy.getAllBorrowedBooks.and.returnValue(of(mockPageResponse));
        fixture.detectChanges();
    });

    it('should create the component BorrowBooksComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with borrowed books on ngOnInit', fakeAsync(() => {
        // test
        component.ngOnInit();
        tick();

        // verify
        expect(bookServiceSpy.getAllBorrowedBooks).toHaveBeenCalledWith({ page: 0, size: 5 });
        expect(component.borrowedBooksPage).toEqual(mockPageResponse);
    }));

    
    it('should display borrowed books in table when no book is selected', () => {
        // test
        const tableRows = fixture.debugElement.queryAll(By.css('table tbody'));

        // verify
        expect(tableRows.length).toBe(1);
    });

    it('should select a book for return when clicking return icon', () => {
        // test
        component.returnBorrowedBook(mockBorrowedBookResponse);

        // verify
        expect(component.selectedBookResponse).toEqual(mockBorrowedBookResponse);
        expect(component.feedbackRequest.book_id).toEqual(mockBorrowedBookResponse.id);
    });

    it('should display book details and feedback form when a book is selected', () => {
        // test
        component.selectedBookResponse = mockBorrowedBookResponse;
        fixture.detectChanges();
        const bookDetails = fixture.debugElement.query(By.css('.d-flex.flex-column.col-6'));

        // verify
        expect(bookDetails).toBeTruthy();
        expect(bookDetails.query(By.css('.col-11')).nativeElement.textContent).toContain('Test Book');
        expect(bookDetails.nativeElement.textContent).toContain('Test Author');


        const feedbackForm = fixture.debugElement.query(By.css('form'));
        expect(feedbackForm).toBeTruthy();

        const table = fixture.debugElement.query(By.css('table'));
        expect(table).toBeDefined();
    });

    it('should call returnBook service when returning a book without feedback', fakeAsync(() => {
        // prepare
        component.selectedBookResponse = mockBorrowedBookResponse;
        bookServiceSpy.returnBorrowBook.and.returnValue(of());

        // test
        component.returnBook(false);
        tick();

        // verify
        expect(bookServiceSpy.returnBorrowBook).toHaveBeenCalledWith({ "book-id": mockBorrowedBookResponse.id });
        expect(component.borrowedBooksPage).toBe(mockPageResponse);
        expect(component.selectedBookResponse).toBeDefined();
        expect(feedbackServceSpy.saveFeedback).not.toHaveBeenCalled();
    }));

    it('should call returnBook and saveFeedback services when returning a book with feedback',
        fakeAsync(() => {
            // prepare
            component.selectedBookResponse = mockBorrowedBookResponse;
            component.feedbackRequest = {
                book_id: mockBorrowedBookResponse.id,
                comment: 'Great Book',
                note: 4
            };
            bookServiceSpy.returnBorrowBook.and.returnValue(of(mockBorrowedBookResponse.id));
            feedbackServceSpy.saveFeedback.and.returnValue(of());

            // test
            component.returnBook(true);
            tick();

            // verify
            expect(bookServiceSpy.returnBorrowBook).toHaveBeenCalledWith({"book-id": mockBorrowedBookResponse.id});
            expect(feedbackServceSpy.saveFeedback).toHaveBeenCalled();
            expect(component.selectedBookResponse).toBeUndefined();
            expect(component.selectedBookResponse).toBeUndefined();
            expect(bookServiceSpy.getAllBorrowedBooks).toHaveBeenCalledWith({page: 0, size: 5});
        })
    );

    it('should handle pagination correctly',
        fakeAsync(() => {
            component.goToNextPage();
            tick();
            expect(component.page).toBe(1);
            expect(bookServiceSpy.getAllBorrowedBooks).toHaveBeenCalledWith({page: 1, size: 5});

            component.goToPreviousPage();
            tick();
            expect(component.page).toBe(0);
            expect(bookServiceSpy.getAllBorrowedBooks).toHaveBeenCalledWith({page: 0, size: 5});

            component.goToLastPage();
            tick();
            expect(component.page).toBe(0);
            expect(bookServiceSpy.getAllBorrowedBooks).toHaveBeenCalledWith({page: 0, size: 5});

            component.goToFirstPage();
            tick();
            expect(component.page).toBe(0);
            expect(bookServiceSpy.getAllBorrowedBooks).toHaveBeenCalledWith({page: 0, size: 5});

            component.goToPage(2);
            tick();
            expect(component.page).toBe(2);
            expect(bookServiceSpy.getAllBorrowedBooks).toHaveBeenCalledWith({page: 2, size: 5});

        }
        )
    );

    
    it('should disable next page button when on last page', () => {
        // prepare
        component.borrowedBooksPage = { ...mockPageResponse, last: true };
        component.page = 0;

        // test
        fixture.detectChanges();
        const nextButton = fixture.debugElement.query(By.css('.page-item:nth-last-child(2) .page-link'));

        // expect
        expect(nextButton.classes['disabled']).toBeTruthy();
    });
    

    it('should handle error response correctly', 
        fakeAsync(() => {
            // prepare
            const errorResponse: ApiErrorResponse = {
                timestamp: new Date().toISOString(),
                validationErrors: ['Error 1', 'Error 2'],
                errorMessage: 'Validation failed',
                details: 'Validation error'
            };
            jsonParserServiceSpy.parseErrorResponse.and.returnValue(errorResponse);
            bookServiceSpy.returnBorrowBook.and.returnValue(throwError(() => ({error: errorResponse})));
            component.selectedBookResponse = mockBorrowedBookResponse;

            // test
            component.returnBook(true);
            tick();
            fixture.detectChanges();

            // verify
            expect(jsonParserServiceSpy.parseErrorResponse).toHaveBeenCalled();
            expect(component.errorMsg).toEqual(['Error 1', 'Error 2']);
            const errorDiv = fixture.debugElement.query(By.css('.alert.alert-danger'));
            expect(errorDiv).toBeTruthy();
            expect(errorDiv.queryAll(By.css('p')).length).toBe(2);
        })
    );

    it('should handle generic error when no validation errors', 
        fakeAsync(() => {
            // prepare
            const errorResponse: ApiErrorResponse = {
                timestamp: '',
                errorMessage: 'Server error',
                validationErrors: [],
                details: ''
            };
            jsonParserServiceSpy.parseErrorResponse.and.returnValue(errorResponse);
            bookServiceSpy.returnBorrowBook.and.returnValue(throwError(() => ({error: errorResponse})));
            component.selectedBookResponse = mockBorrowedBookResponse;

            // test
            component.returnBook(true);
            tick();
            fixture.detectChanges();

            // verify
            expect(component.errorMsg).toEqual(['Server error']);
        })
    );

    it('should cancel book selection', () => {
        // prepare
        component.selectedBookResponse = mockBorrowedBookResponse;
        component.feedbackRequest = {book_id: mockBorrowedBookResponse.id, comment: 'Test', note: 3};
        fixture.detectChanges();

        // test
        const cancelButton = fixture.debugElement.query(By.css('.btn.btn-link.text-danger')).nativeElement;
        cancelButton.click();

        // verify
        expect(component.selectedBookResponse).toBeUndefined();
    })
})