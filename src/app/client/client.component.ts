import { Component, OnInit } from '@angular/core';
import{ ClientService} from './client.service'
import { FormGroup, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { MenuItem } from 'primeng/api';
import Swal from "sweetalert2";

declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
 
export class ClientComponent implements OnInit {

  addClientForm = new FormGroup({
    PID: new FormControl(''),
    name: new FormControl(''),
    phone: new FormControl(''),
    initDebitAmount: new FormControl(''),
    isClient : new FormControl(1)
  })
  isOpened = 0;
  private clients:any;
  
  private static selectedRowData;
  private static selectedClientID;
  editedClientData = {};
  private globalClientDT;
  items: MenuItem[];
  editFlag = false;
  typeSubmit = 'إضافة';
  

  constructor(private clientServ:ClientService,public snackBar: MatSnackBar) { }
  
  ngOnInit() {
    this.getAllClients();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  togglePanel(index:number) {
    this.isOpened = index;
  }
  collapse() {
    this.isOpened=0;
    this.addClientForm.reset();
    this.editFlag = false;
    this.typeSubmit = 'إضافة';
  }
  // displayTable(){
  //   setTimeout(function () {$(function () {$('#clientTable').DataTable();});}, 10);  
  // }
  addNewClient(){
    if(this.editFlag == false){
      this.clientServ.addNewClient(this.addClientForm.value).subscribe(
        Response=>{
          this.openSnackBar(this.addClientForm.value['name'], "إضافة ناجحة");
          /* START- collapse accordion and rest form values */
          // this.isOpened=0;
          this.addClientForm.reset();
          this.collapse();
          /* END- collapse accordion and rest form values */
              this.globalClientDT.ajax.reload(null, false);
              // this.getAllClients();
      },
      error=>{
        alert("error");
      });
    } else{
      this.clientServ.editClient(this.addClientForm.value).subscribe(
        Response=>{
          this.openSnackBar(this.addClientForm.value['name'], "تعديلات ناجحة");
          /* START- collapse accordion and rest form values */
          // this.isOpened=0;
          this.addClientForm.reset();
          this.collapse();
          this.editFlag = true;
          // this.typeSubmit = 'إضافة';
          /* END- collapse accordion and rest form values */
              this.globalClientDT.ajax.reload(null, false);
              // this.getAllClients();
      },
      error=>{
        alert("error");
      });
    }
  }
  getAllClients(){
     var subscriberDataTable = $('#clientsDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: false,
      fixedHeader: false,
      select: {
        style: "single"
      },
      searching: true,
      lengthMenu: [[50, 100, 150], [50, 100, 150]],
      ajax: {
        type: "get",
        url: "http://localhost/eSafe-gasoline_station/src/assets/api/dataTables/personDataTable.php",
        data: {'type': 1},
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "PID", title: "ID" },
        { data: "full_name", title: "الإسم الكامل" },
        { data: "phone_number", title: "رقم الهاتف" },
        { data: "debitAmount", title: "الدين" , render: $.fn.dataTable.render.number(',', '.', 0, 'ل.ل ') }

      ],
      language: {
        sProcessing: " جارٍ التحميل... ",
        sLengthMenu: " أظهر _MENU_ مدخلات ",
        sZeroRecords: " لم يعثر على أية سجلات ",
        sInfo: " إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل ",
        sInfoEmpty: " يعرض 0 إلى 0 من أصل 0 سجل ",
        sInfoFiltered: "( منتقاة من مجموع _MAX_ مُدخل )",
        sInfoPostFix: "",
        sSearch: " ابحث: ",
        sUrl: "",
        oPaginate: {
          sFirst: " الأول ",
          sPrevious: " السابق ",
          sNext: " التالي ",
          sLast: " الأخير "
        },
        select: {
          rows: {
            _: "||  %d أسطر محدد  ",
            0: "||  انقر فوق صف لتحديده ",
            1: "||  صف واحد محدد  "
          }
        }
      }
    });

    this.items = [
      {
        label: 'تعديل',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editClientBtn') as HTMLElement;
          element.click();
        }

      },{
        label: "حذف",
        icon: "pi pi-fw pi-times",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "deleteBtn"
          ) as HTMLElement;
          element.click();
        }
      },
    ];
    this.globalClientDT = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        ClientComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        var ID = subscriberDataTable.row(indexes).data()['PID'];
        var name = subscriberDataTable.row(indexes).data()['full_name'];
        ClientComponent.selectedClientID = ID;
        // ClientComponent.selectedClientName = name;
      }
      else if (type === 'column') {
        ClientComponent.selectedClientID = -1;
      }
    });

    $('#clientsDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $('#clientsDT').on('key-focus.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#clientsDT').on('key-blur.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
    });

  }
  openClientModal() {
      this.isOpened=1;
      this.typeSubmit = "تعديل";
      this.addClientForm.get('PID').setValue(ClientComponent.selectedClientID);
      this.addClientForm.get('name').setValue(ClientComponent.selectedRowData["full_name"]);
      this.addClientForm.get('phone').setValue(ClientComponent.selectedRowData["phone_number"]);
      this.addClientForm.get('initDebitAmount').setValue(ClientComponent.selectedRowData["debitAmount"]);
  }
  deleteClient() {
 
    console.log(ClientComponent.selectedClientID)
    Swal({
      title: "حذف",
      text: "هل حقا تريد حذفها؟",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم!",
      cancelButtonText: "كلا"
    }).then(result => {
      
      if (result.value) {
        this.clientServ
          .deleteClient(ClientComponent.selectedClientID)
          .subscribe(
            response => {
              debugger;
              this.globalClientDT.ajax.reload(null, false);
              Swal({
                type: "success",
                title: "نجاح الحذف",
                showConfirmButton: false,
                timer: 1000
              });
            },
            error => {
              debugger;
              Swal({
                type: "error",
                title: "تحذير",
                text: "هذا الزبون موجود في الفواتير",
                confirmButtonText: "نعم",
              });
            }
          );
      }
    });
  }
}
