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
    this.playerScore = 0;
    this.dealerScore = 0;
  }

  setStand():void{
    this.stand = !this.stand;
    this.endCurrentGame();
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
  }

  calculateScore():void {
    //Player Score
    let playerSumArray:number[] = [];
    let playerSum1:number = 0;
    let playerSum2:number = 0;
    let playerClosest:number[] = [];
    this.playerCards.forEach(card => {
      if(card.points.length===1){
        playerSum1+=card.points[0];
        playerSum2+=card.points[0];
      } else {
        let min:number = Math.min(...card.points);
        playerSum1+=min;
        let max:number = Math.max(...card.points);
        playerSum2+=max;
      }
    });
    playerSumArray.push(playerSum1, playerSum2);
    playerSumArray.forEach(sum => {
      playerClosest.push(Math.abs(21-sum));
    });
    let playerIndex:number = playerClosest.indexOf(Math.min(...playerClosest));
    this.playerScore = playerSumArray[playerIndex];

    //Dealer score
    let dealerSumArray:number[] = [];
    let dealerSum1:number = 0;
    let dealerSum2:number = 0;
    let dealerClosest:number[] = [];
    this.dealerCards.forEach(card => {
      if(card.points.length===1) {
        dealerSum1+=card.points[0];
        dealerSum2+=card.points[0];
      } else {
        let min:number = Math.min(...card.points);
        dealerSum1+=min;
        let max:number = Math.max(...card.points);
        dealerSum2+=max;
      }
    });
    dealerSumArray.push(dealerSum1,dealerSum2);
    dealerSumArray.forEach(sum => {
      dealerClosest.push(Math.abs(21-sum));
    });
    let dealerIndex:number = dealerClosest.indexOf(Math.min(...dealerClosest));
    this.dealerScore = dealerSumArray[dealerIndex];
  }
}
