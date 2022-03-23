import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel,FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName: string = '';
  password: string = '';
  errorMsg: string = '';
  constructor(private router: Router) { }


  ngOnInit(): void {
  }

  loginUser(){
      if( this.userName == 'admin' && this.password == 'admin') {
        console.log("Welcome");
        this.router.navigate(['games']);
      }else {
        this.errorMsg = 'Invalid Login Details';
      }
  }

}
