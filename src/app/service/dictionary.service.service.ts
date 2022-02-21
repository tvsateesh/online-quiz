import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Dictionary.ServiceService {

  constructor(private http: HttpClient) {

  }

  getWords(){
    return this.http.get<any>('assets/dictionary.json');
  }

}
