import { NgFor } from '@angular/common';
import { Component, computed, input } from '@angular/core';


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

  rating = input.required<number>();
  maxRating = 5;

  fullStars = computed(() => Math.floor(this.rating()));

  hasHalfStar = computed(() => this.rating() % 1 !== 0);

  emptyStars = computed(() => this.maxRating - Math.ceil(this.rating()));

}
