import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  error(message: string) {
    console.error(`loggerService.error: ${message}`);
  }
}
