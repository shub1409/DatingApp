import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor( private accountServive: AccountService,private toastr:ToastrService, 
              private fb:FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.InitializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  InitializeForm() {
    // this.registerForm = new FormGroup({
    //   username: new FormControl('',Validators.required),
    //   password: new FormControl('',[Validators.required,Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    // })

    this.registerForm = this.fb.group({
      username: ['',Validators.required],
      gender: ['male'],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })

    // this.registerForm.controls.password.valueChanges.subscribe(() => {
    //   this.registerForm.controls.confirmPassword.updateValueAndValidity();
    // })
  }

  matchValues(matchTo:string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = control?.parent?.controls as any;
      return (forbidden) 
        ? (control?.value === forbidden[matchTo]?.value) ? null : {isMatching: true}
        : null;
    }
  }

  register(){
    this.accountServive.register(this.registerForm.value).subscribe(response =>{
      this.router.navigateByUrl('/members');
      // this.cancel();
    }, error =>{
      this.validationErrors= error;
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
