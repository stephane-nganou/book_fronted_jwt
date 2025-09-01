import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { BorrowBooksComponent } from "./borrow-books.component"
import { BookService, FeedbackService } from "../../../services/services";
import { JsonParserService } from "../../../services/json-parser.service";
import { BorrowedBookResponse } from "../../../services/models/borrowed-book-response";
import { PageBorrowedBookResponse } from "../../../services/models/page-borrowed-book-response";
import { RatingComponent } from "../rating/rating.component";
import { FormsModule } from "@angular/forms";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";



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
        bookServiceSpy = jasmine.createSpyObj('BookService', ['getAllBorrowedBooks', 'returnBorrowBook']);
        jsonParserServiceSpy = jasmine.createSpyObj('JsonParserService', ['parseErrorResponse']);
        feedbackServceSpy = jasmine.createSpyObj('FeedbackService', ['saveFeedback']);

        await TestBed.configureTestingModule({
            imports: [FormsModule, BorrowBooksComponent, RatingComponent],
            providers: [
                {provide: BookService, useValue: bookServiceSpy},
                {provide: JsonParserService, useValue: jsonParserServiceSpy},
                {provide: FeedbackService, useValue: feedbackServceSpy}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BorrowBooksComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        bookServiceSpy.getAllBorrowedBooks.and.returnValue(of(mockPageResponse));
        fixture.detectChanges();
    });

    it('should create the component BorrowBooksComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with borrowed books on ngOnInit', fakeAsync(() => {
        component.ngOnInit();
        tick();
        expect(bookServiceSpy.getAllBorrowedBooks).toHaveBeenCalledWith({page: 0, size: 5});
        expect(component.borrowedBooksPage).toEqual(mockPageResponse);
    }));

    /*
    it('should display borrowed books in table when no book is selected', () => {
        const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));

        expect(tableRows.length).toBe(1);
    });*/

    it('should select a book for return when clicking return icon', () => {
        component.returnBorrowedBook(mockBorrowedBookResponse);
        expect(component.selectedBookResponse).toEqual(mockBorrowedBookResponse);
        expect(component.feedbackRequest.book_id).toEqual(mockBorrowedBookResponse.id);
    });

    it('should display book details and feedback form when a book is selected', () => {
        component.selectedBookResponse = mockBorrowedBookResponse;
        fixture.detectChanges();

        const bookDetails = fixture.debugElement.query(By.css('.d-flex.flex-column.col-6'));
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
        expect(bookServiceSpy.returnBorrowBook).toHaveBeenCalledWith({"book-id": mockBorrowedBookResponse.id});
        expect(component.borrowedBooksPage).toBe(mockPageResponse);
        expect(component.selectedBookResponse).toBeDefined();
        expect(feedbackServceSpy.saveFeedback).not.toHaveBeenCalled();

    }));
})