import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bj-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public pageTitle: string = "Game";
  constructor() { }

  ngOnInit(): void {
  }

}
