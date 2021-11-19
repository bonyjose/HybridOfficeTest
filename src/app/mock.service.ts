import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor() {

   }

   public seatBooked = [];

   public bookSeat(data :any)
   {
     debugger;
     this.seatBooked = data;
  }

}
