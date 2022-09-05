import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICard } from './game-card';
import { GameService } from './game-card.service';

@Component({
  selector: 'bj-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public pageTitle: string = "Game";
  imageWidth: number = 50;
  imageMargin: number = 2;
  cards:ICard[] = [];
  shuffledCards:ICard[] = [];
  errorMessage:string = '';
  sub!:Subscription;
  
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.sub = this.gameService.getCards().subscribe({
      next: cards => {
        this.cards = cards;
        this.shuffledCards = this.performShuffle(this.cards);
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy():void {
    this.sub.unsubscribe();
  }

  performShuffle(cards:ICard[]):ICard[] {
    let currentIndex:number = cards.length;
    let randomIndex!:number;

    while(currentIndex !=0) {
      randomIndex = Math.floor(Math.random()*currentIndex);
      currentIndex--;

      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex], cards[currentIndex]];
    }
    return cards;
  }
}
