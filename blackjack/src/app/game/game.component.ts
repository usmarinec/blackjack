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
  imageWidth: number = 100;
  imageHeight: number = 150;
  imageMargin: number = 2;
  cards:ICard[] = [];
  shuffledCards:ICard[] = [];
  playerCards!:ICard[];
  dealerCards!:ICard[];
  cardsDealt!:boolean;
  stand!:boolean;
  nextCardIndex!:number;
  nextCard!:ICard;
  errorMessage:string = '';
  sub!:Subscription;
  gamePlay!:boolean;
  playerScore!:number;
  dealerScore!:number;
  
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.sub = this.gameService.getCards().subscribe({
      next: cards => {
        this.cards = cards;
        this.shuffledCards = this.performShuffle(this.cards);
      },
      error: err => this.errorMessage = err
    });

    this.gamePlay = false;
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

  startNewGame():void {
    this.gamePlay = true;
    this.nextCardIndex = 0;
    this.getNextCard();
    this.performShuffle(this.shuffledCards);
    console.log(this.gamePlay);
    this.dealerCards = [];
    this.playerCards = [];
    this.cardsDealt = false;
  }

  endCurrentGame():void {
    this.gamePlay = false;
    console.log(this.gamePlay);
  }

  getNextCard():void {
    this.nextCard = this.shuffledCards[this.nextCardIndex];
    this.nextCardIndex++;
  }

  dealCards():void {
    this.cardsDealt = true;
    this.stand = false;
    this.getNextCard();
    this.dealerCards.push(this.nextCard);
    this.getNextCard();
    this.playerCards.push(this.nextCard);
    this.getNextCard();
    this.dealerCards.push(this.nextCard);
    this.getNextCard();
    this.playerCards.push(this.nextCard);

    this.calculateScore();

    console.log(this.playerScore, this.dealerScore);
  }

  calculateScore():void {
    this.playerCards.forEach(card => {
      let playerSumArray:number[] = [];
      let sumMin:number = 0;
      let sumMax:number = 0;
      let playerClosest!:number[];
      if(card.points.length===1) {
        sumMin+=card.points[0];
        sumMax+=card.points[0];
      } else {
        sumMin+=Math.min.apply(null, card.points);
        sumMax+=Math.max.apply(null, card.points);
      }
      playerSumArray.push(sumMin);
      playerSumArray.push(sumMax);

      playerSumArray.forEach(sum => {
        playerClosest.push(Math.abs(21-sum))
      });

      this.playerScore = playerSumArray.indexOf(Math.min.apply(null, playerClosest));
    });
    
    this.dealerCards.forEach(card => {
      let dealerSumArray:number[] = [];
      let sumMin:number =0;
      let sumMax:number = 0;
      let dealerClosest!:number[];
      if(card.points.length===1) {
        sumMin+=card.points[0];
        sumMax+=card.points[0];
      } else {
        sumMin+=Math.min.apply(null, card.points);
        sumMax+=Math.max.apply(null, card.points);
      }
      dealerSumArray.push(sumMin);
      dealerSumArray.push(sumMax);

      dealerSumArray.forEach(sum => {
        dealerClosest.push(Math.abs(21-sum))
      });

      this.dealerScore = dealerSumArray.indexOf(Math.min.apply(null, dealerClosest));      
    });
  }
}
