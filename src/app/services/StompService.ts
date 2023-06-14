import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root',
})
export class StompService {
  private connecting: boolean = true;

  socket = new SockJS('http://localhost:8081/ws');
  stompClient = Stomp.over(this.socket);

  subscribe(topic: string, callback: any): void {
    const connected: boolean = this.stompClient.connected;
    if (connected) {
      this.connecting = false;
      this.subscribeToTopic(topic, callback);
      return;
    }
    this.connecting = true;
    this.stompClient.connect({}, (frame: any): any => {
      this.subscribeToTopic(topic, callback);
    });
  }

  private subscribeToTopic(topic: string, callback: any): void {
    this.stompClient.subscribe(topic, (response?:string): any => {
      callback(response);
    });
  }
}
