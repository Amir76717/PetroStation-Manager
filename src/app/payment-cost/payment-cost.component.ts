import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentCostService } from './payment-cost.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-payment-cost',
  templateUrl: './payment-cost.component.html',
  styleUrls: ['./payment-cost.component.scss']
})
export class PaymentCostComponent implements OnInit {
  public paymentCostForm: FormGroup;
  empID;shiftID;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private paymentCostServ:PaymentCostService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.empID=localStorage.getItem('userID');
    this.shiftID=localStorage.getItem('shiftID');

    this.paymentCostForm = this.fb.group({
      empID : this.empID,
      shiftID : this.shiftID,
      amount: ['',[Validators.required, Validators.min(1)]],
      comment: ['']
    });
  }
  postPaymentCost(){
    this.paymentCostServ.addPaymentCostInvoice(this.paymentCostForm.value).subscribe(
      Response=>{
        this.openSnackBar(this.paymentCostForm.get('amount').value, "دفع");
        setTimeout(()=>this.router.navigate(['/operations']),1000);
        // this.getLubricant(this.itemPerPage,this.offset);
        this.paymentCostForm.reset();
        // console.log(this.paymentCostForm.value)
      },
      error=>{
        alert("error");
      });
  }
  /* show feed back message when sell succeed */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
