import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SessionService} from "../services/session.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: string | null = "";
  logInProgress: boolean = false;
  redirectUrl:string = "";

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private sessionService: SessionService,
              private activatedRoute: ActivatedRoute,
              private router: Router,) {
    activatedRoute.queryParams.subscribe((params) => {
      if (params["url"] !== undefined)
        this.redirectUrl = params["url"]
      console.log("redirect after login to " + this.redirectUrl);
    })
  }

  ngOnInit(): void {
    this.sessionService.logout();
  }

  onSubmit() {
    if (this.form.valid) {
      this.logInProgress = true;
      console.log(this.form.value);
      this.sessionService.login(this.form.value.password)
        .subscribe(() => {
          console.log("auth succeeded");
          this.error = "";
          this.logInProgress = false
          this.router.navigate(['/' + this.redirectUrl]).then();
        }, (error) => {
          if (error.status == 400 || error.status == 401) {
            console.log("auth failed, try again");
            this.error = "auth failed, try again " + error.message;
          } else {
            console.log("auth failed go to error page " + error.message);
            this.error = "internal System Error : " + error.message;
          }
          this.logInProgress = false
        }, () => this.logInProgress = false);
    }
  }
}
