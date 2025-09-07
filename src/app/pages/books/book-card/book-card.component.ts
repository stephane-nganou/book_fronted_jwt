import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookResponse } from '../../../services/models';
import { NgIf } from '@angular/common';
import { RatingComponent } from "../rating/rating.component";

/**
 * @fileoverview BookCardComponent, purpose of displaying book elements as Cards
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */

@Component({
  selector: 'app-book-card',
  imports: [NgIf, RatingComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css',
})
export class BookCardComponent {

  @Output() private share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();

  private _book: BookResponse = {
    archived: false,
    author_name: '',
    id: 0,
    isbn: '',
    owner: '',
    rate: 0,
    shareable: false,
    synopsis: '',
    title: ''
  };
  
  private _bookCover?: string | undefined;
  private _manage = false;

  public get manage() {
    return this._manage;
  }

  @Input()
  public set manage(value) {
    this._manage = value;
  }

  public get bookCover(): string | undefined {
    if (this._book.cover) {
      return 'data:image/jpg;base64, ' + this._book.cover;
    }

    // default picture
    return '';
  }

  public set bookCover(value: string | undefined) {
    this._bookCover = value;
  }

  public get book(): BookResponse {
    return this._book;
  }

  @Input()
  public set book(value: BookResponse) {
    this._book = value;
  }

  onArchive() {
    this.archive.emit(this._book);
  }
  onShare() {
    this.share.emit(this._book);
  }
  onEdit() {
    this.edit.emit(this._book);
  }
  onAddToWaitingList() {
    this.addToWaitingList.emit(this._book);
  }
  onBorrow() {
    this.borrow.emit(this._book);
  }
  onShowDetails() {
    this.details.emit(this._book);
  }
}
