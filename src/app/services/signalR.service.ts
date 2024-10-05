// import { Injectable } from '@angular/core';
// import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
// import { CardService } from './CardService/card.service';
// import { BehaviorSubject } from 'rxjs';
// @Injectable({
//   providedIn: 'root'
// })

// export class SignalRService {
//   progressSubject = new BehaviorSubject<any>(null);
//   progressValue$ = this.progressSubject.asObservable()
//   constructor(private cardService:CardService) { }
//   private hubConnection: HubConnection;

//   startConnection(): void {

//     console.log('starting connection');
//     this.hubConnection = new HubConnectionBuilder()
//       .withUrl(`${this.cardService.baseUrl}ProgressHub`)
//       .build();

//     this.hubConnection.on('ShowPercentage', (percent: number) => {
//       //this.progress = percent;
//       console.log("percent===>", percent)
//       this.progressSubject.next(percent)
//     });

//     this.hubConnection.start()
//       .then(() => console.log('SignalR connection established.'))
//       .catch(err => console.error(err));
//   }


// }
