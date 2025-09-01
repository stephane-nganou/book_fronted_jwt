import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BorrowBooksComponent } from "./borrow-books.component"
import { BookService, FeedbackService } from "../../../services/services";
import { JsonParserService } from "../../../services/json-parser.service";
import { BorrowedBookResponse } from "../../../services/models/borrowed-book-response";
import { PageBorrowedBookResponse } from "../../../services/models/page-borrowed-book-response";
import { RatingComponent } from "../rating/rating.component";
import { FormsModule } from "@angular/forms";
import { of } from "rxjs";



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
})