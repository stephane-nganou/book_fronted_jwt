import { Component, computed, input, output } from '@angular/core';
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

  share = output<BookResponse>();
  archive = output<BookResponse>();
  addToWaitingList = output<BookResponse>();
  borrow = output<BookResponse>();
  edit = output<BookResponse>();
  details = output<BookResponse>();

  book = input.required<BookResponse>();

  manage = input<boolean>(false);

  bookCover = computed(() => {
    const book = this.book();
    if (book.cover) {
      return 'data:image/jpg;base64,' + book.cover;
    }
    return '';
  });

  onArchive() {
    this.archive.emit(this.book());
  }

  onShare() {
    this.share.emit(this.book());
  }

  onEdit() {
    this.edit.emit(this.book());
  }

  onAddToWaitingList() {
    this.addToWaitingList.emit(this.book());
  }

  onBorrow() {
    this.borrow.emit(this.book());
  }

  onShowDetails() {
    this.details.emit(this.book());
  }

}
