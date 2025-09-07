import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';


/**
 * @fileoverview RatingComponent, purpose of displaying the rating of books.
 * @author Stephane Nganou <stephane.nganou.w@snganou.de>
 * @version 1.0.0
 * @date 2025-09-07
 */
@Component({
  selector: 'app-rating',
  imports: [NgFor],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {

  @Input() rating: number = 0;
  maxRating: number = 5;

  get fullStars(): number {
    return Math.floor(this.rating);
  }

  get hasHalfStar(): boolean {
    return this.rating % 1 !== 0;
  }

  get emptyStars(): number {
    return this.maxRating - Math.ceil(this.rating);
  }

}
