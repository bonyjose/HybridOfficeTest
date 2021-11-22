import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor() {

   }


   private seatBookedSource = new BehaviorSubject<any[]>(null);

   seatBooked = this.seatBookedSource.asObservable();


   public bookSeat(data :any[])
   {
     debugger;
     this.seatBookedSource.next(data);
  }

}
