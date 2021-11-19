import { Component } from '@angular/core';
import{MockService} from '../mock.service'
@Component({
  selector: 'app-seatBook',
  templateUrl: './seatBooking.component.html',
  styleUrls: ['./seatBooking.component.scss']
})
export class SeatBookingComponent {

  constructor(private mockService : MockService ) {}


  public seatConfig: any = null;
  public seatmap = [];
  public seatChartConfig = {
    showRowsLabel : true,
    showRowWisePricing : true,
    newSeatNoForRow : true
  }
  public cart = {
    selectedSeats : [],
    seatstoStore : [],
    totalamount : 0,
    cartId : "",
    eventId : 0
  };
  

  title = 'seat-chart-generator';


  ngOnInit(): void {
    //Process a simple bus layout
    this.seatConfig = [
  {
    "seat_price":'' ,
    "seat_map": [
      {
        "seat_label": "N",
        "layout": "_aaaaaaaa____aaaaaaaaaaa_________"
      },
      {
        "seat_label": "M",
        "layout": "___________________"
      },
      {
        "seat_label": "L",
        "layout": "_aa___aaa_aaaaa__aaaaaa_aaa________"
      },
      {
        "seat_label": "K",
        "layout": "_aa___aaa_aaaaa__aaaaaa_aaa________"
      },
      {
        "seat_label": "J",
        "layout":  "__________________"
      },
      {
        "seat_label": "I",
        "layout": "_aaaaaaaa_aaaaaaaaa__aaa_aa"
      },
      {
        "seat_label": "H",
        "layout": "_aaaaaaaa_aaaaaaaaa__aaa_aa"
      },
      {
        "seat_label": " ",
        "layout": "_______________________"
      }
    ]
  },
  {
    seat_price: 500,
        seat_map: [
          {
            seat_label: "G",
            layout: "_cccccccccc__cc__cc__cccccccccccc",
          },
          {
            seat_label: "F",
            layout: "_cccccccccc__cc__cc__cccccccccccc",
          },
          {
            seat_label: "E",
            layout: "_____________cc__cc______________",
          },
          {
            seat_label: "D",
            layout: "_____________cc__cc______________",
          },
          {
            seat_label: "C",
            layout: "_____________cc__cc______________",
          },
          {
            seat_label: "B",
            layout: "_cccccccccc__cc__cc__cccccccccccc",
          },
          {
            seat_label: "A",
            layout: "_cccccccccc__cc__cc__cccccccccccc__________",
          },
          {
            seat_label: " ",
            layout: "_____________________________________________",
          },
        ],
      },
    ];
    this.processSeatChart(this.seatConfig);
  }

  public processSeatChart ( map_data : any[] )
  {
    debugger;
      if( map_data.length > 0 )
      {
        var seatNoCounter = 1;
        for (let __counter = 0; __counter < map_data.length; __counter++) {
          var row_label = "";
          var item_map = map_data[__counter].seat_map;

          //Get the label name and price
          row_label = "Room  : "+item_map[0].seat_label + " - ";
          if( item_map[ item_map.length - 1].seat_label != " " )
          {
            row_label += item_map[ item_map.length - 1].seat_label;
          }
          else
          {
            row_label += item_map[ item_map.length - 2].seat_label;
          }
          //row_label += " : Rs. " + map_data[__counter].seat_price;
          
          item_map.forEach(map_element => {
            var mapObj = {
              "seatRowLabel" : map_element.seat_label,
              "seats" : [],
              "seatPricingInformation" : row_label
            };
            row_label = "";
            var seatValArr = map_element.layout.split('');
            if( this.seatChartConfig.newSeatNoForRow )
            {
              seatNoCounter = 1; //Reset the seat label counter for new row
            }
            var totalItemCounter = 1;
            seatValArr.forEach(item => {
              var seatObj = {
                "key" : map_element.seat_label+"_"+totalItemCounter,
                "price" : map_data[__counter]["seat_price"],
                "status" : "available"
              };
               
              if( item != '_')
              {
                seatObj["seatLabel"] = map_element.seat_label+" "+seatNoCounter;
                if(seatNoCounter < 10)
                { seatObj["seatNo"] = "0"+seatNoCounter; }
                else { seatObj["seatNo"] = ""+seatNoCounter; }
                
                seatNoCounter++;
              }
              else
              {
                seatObj["seatLabel"] = "";
              }
              totalItemCounter++;
              mapObj["seats"].push(seatObj);
            });
            console.log(" \n\n\n Seat Objects " , mapObj);
            this.seatmap.push( mapObj );

          });
        }

      }
  }

  public selectSeat( seatObject : any )
  {
    debugger;
    console.log( "Seat to block: " , seatObject );
    
    if(seatObject.status == "available")
    {
      seatObject.status = "booked";
      this.cart.selectedSeats.push(seatObject.seatLabel);
      this.cart.seatstoStore.push(seatObject.key);
      this.cart.totalamount += seatObject.price;
    }
    else if( seatObject.status = "booked" )
    {
      seatObject.status = "available";
      var seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatLabel);
      if( seatIndex > -1)
      {
        this.cart.selectedSeats.splice(seatIndex , 1);
        this.cart.seatstoStore.splice(seatIndex , 1);
        this.cart.totalamount -= seatObject.price;
      }
      
    }
  }

  public blockSeats(seatsToBlock : string)
  {
    if(seatsToBlock != "")
    {
      var seatsToBlockArr = seatsToBlock.split(',');
      for (let index = 0; index < seatsToBlockArr.length; index++) {
        var seat =  seatsToBlockArr[index]+"";
        var seatSplitArr = seat.split("_");
        console.log("Split seat: " , seatSplitArr);
        for (let index2 = 0; index2 < this.seatmap.length; index2++) {
          const element = this.seatmap[index2];
          if(element.seatRowLabel == seatSplitArr[0])
          {
            var seatObj = element.seats[parseInt(seatSplitArr[1]) - 1];
            if(seatObj)
            {
              console.log("\n\n\nFount Seat to block: " , seatObj);
              seatObj["status"] = "unavailable";
              this.seatmap[index2]["seats"][parseInt(seatSplitArr[1]) - 1] = seatObj;
              console.log("\n\n\nSeat Obj" , seatObj);
              console.log(this.seatmap[index2]["seats"][parseInt(seatSplitArr[1]) - 1]);
              break;
            }
             
          }
        }
       
      }
    }
    
  }




  public processBooking()
  {
    debugger;
    this.mockService.bookSeat(1);
  }

}
