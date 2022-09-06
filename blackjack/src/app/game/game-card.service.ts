import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ICard } from "./game-card";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private cardUrl = 'api/cards/cards.json';
    constructor(private http: HttpClient) {}

    getCards(): Observable<ICard[]>{
        return this.http.get<ICard[]>(this.cardUrl).pipe(
            tap(data => console.log('All', JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occured: ${err.error.message}`;
        } else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }

        console.error(errorMessage);
        return throwError(()=>errorMessage);
    }
}