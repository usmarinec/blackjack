import { Component, OnInit } from '@angular/core';
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
  
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

}
