import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { _Position, FileType, PersonDocuments, DriverProfilesItem, DpsUser, Documents, DpsPerson } from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { PersonService } from '../../../shared/person.service';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-persondocument',
  templateUrl: './persondocument.component.html',
  styleUrls: ['./../person.component.css']
})
export class PersonDocumentComponent implements OnInit {
  @Input() SocialSecurityId: string;
  public maindatas = [];
  public dpsPersondata = [];
  public errorMsg;
  public loginuserdetails: DpsUser = JSON.parse(localStorage.getItem('dpsuser'));
  public VatNumber = this.loginuserdetails.customerVatNumber;
  PersonDocumentForm : FormGroup;
  
  public isConstructionSector: boolean;
  public isStudentAtWork : boolean;
  public isDriver : boolean;

  public medicchAttest: string;

  medicalAttestationFileToUpload: File = null;
  vcaAttestationFileToUpload: File = null;
  constructionCardsToUpload: File = null;
  studentAtWorkFileToUpload: File = null;
  otherDocumentsToUpload: File = null;
  driversFileToUpload: File = null;

  ddl_drivinglicenseSelected: string;
  public documents : Documents;
  public personDocuments : PersonDocuments;
  public driverProfilesItem : DriverProfilesItem
  public currentPerson : DpsPerson;

  public data: DpsPerson;
  constructor(private personService: PersonService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void { this.onPageInit(); }

  ngOnInit() { this.onPageInit(); }

  onPageInit() {
    this.getPersonBySSIDVatnumber(this.SocialSecurityId, this.VatNumber);
   
    this.PersonDocumentForm = new FormGroup({
      UploadMedicalAttestation: new FormControl(''),
      UploadVcaAttestation: new FormControl(''),
      UploadConstructionCards: new FormControl(''),
      UploadStudentAtWork: new FormControl(''),
      UploadDriversLicense: new FormControl(''),
      UploadOtherDocuments: new FormControl(''),
      ddl_drivinglicense: new FormControl(''),
      balance: new FormControl('',[Validators.required, Validators.pattern('^[ 0-9 ]+$')]),
      contingent: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      attestationDate: new FormControl('',[Validators.required]),
      file: new FormControl('')
    });
  }

  
  onConstructionSectorChange($event) {
    // this.currentPerson.constructionProfile. = $event;
    // console.log('after');
    // console.log(this.currentPerson);
  }

  onIsDriverChange($event) {
    // this.currentPerson.constructionProfile. = $event;
    // console.log('after');
    // console.log(this.currentPerson);
  }

  onisStudentAtWorkChange($event) {
    // this.currentPerson.constructionProfile. = $event;
    // console.log('after');
    // console.log(this.currentPerson);
  }



  getPersonBySSIDVatnumber(ssid: string, customervatnumber: string) {    
    this.personService.getPersonBySSIDVatnumber(ssid, customervatnumber).subscribe(response => {
    this.currentPerson = response.body;   
    console.log('this.currentPerson::: ',this.currentPerson);   
    this.ShowMessage('Person fetched successfully.', '');
    }, error => this.ShowMessage(error, 'error'));
  }

  
  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      console.log('Snackbar Action :: ' + Action);
    });
  }

  
  handleMedicalAttestationFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.medicalAttestationFileToUpload = files.item(0);

      this.currentPerson.medicalAttestation.name = files.item(0).name;
      this.currentPerson.medicalAttestation.location ="";

      this.personDocuments.customerVatNumber = this.VatNumber;
      this.personDocuments.fileName = files.item(0).name;
      this.personDocuments.file = files.item(0);
      this.personDocuments.fileType = FileType.Medical;
      this.personDocuments.personId = this.SocialSecurityId;
      }
    }
  }

  uploadMedicalAttestationFileToActivity() {
    this.personService.updateMedicalAttestationFile(this.medicalAttestationFileToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }

  deleteMedicalAttestation() {   
    //delete
  }

  downloadMedicalAttestation() {   
    saveAs( this.currentPerson.medicalAttestation.location, 'application/pdf;charset=utf-8');
  }

  handleVcaAttestationFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.vcaAttestationFileToUpload = files.item(0);

      this.currentPerson.vcaAttestation.name = files.item(0).name;
      this.currentPerson.vcaAttestation.location ="";

      this.personDocuments.customerVatNumber = this.VatNumber;
      this.personDocuments.fileName = files.item(0).name;
      this.personDocuments.file = files.item(0);
      this.personDocuments.fileType = files.item(0).name;
      this.personDocuments.personId = this.SocialSecurityId;
      }         
    }
  }

  uploadVcaAttestationFileToActivity() {
    this.personService.vcaAttestationFile(this.vcaAttestationFileToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }

  downloadVcaAttestationFile() {   
    saveAs( this.currentPerson.vcaAttestation.location, 'application/pdf;charset=utf-8');
  }

  deleteVcaAttestation() {   
    //delete
  }

  handleConstructionCardsFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.constructionCardsToUpload = files.item(0);

        this.documents = new Documents();
        this.documents.name = files.item(0).name;
        this.documents.location = "";
        this.currentPerson.constructionProfile.constructionCards.push(this.documents);
  
        this.personDocuments.customerVatNumber = this.VatNumber;
        this.personDocuments.fileName = files.item(0).name;
        this.personDocuments.file = files.item(0);
        this.personDocuments.fileType = FileType.ConstructionCard;
        this.personDocuments.personId = this.SocialSecurityId;
      } 
    }
  }

  uploadConstructionCardsFileToActivity() {
    this.personService.constructionCardsFile(this.constructionCardsToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }

  downloadConstructionCardFile() {  
    // download by selected index
    //saveAs( this.currentPerson.constructionProfile.constructionCards[0], 'application/pdf;charset=utf-8');
  }

  deleteConstructionCard() {  
    // delete 
  }
  

  handleStudentAtWorkFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.studentAtWorkFileToUpload = files.item(0);

      this.currentPerson.studentAtWorkProfile.attestation.name = files.item(0).name;   
      this.currentPerson.studentAtWorkProfile.attestation.location ="";
      this.currentPerson.studentAtWorkProfile.attestationDate = this.PersonDocumentForm.get('attestationDate').value;;
      this.currentPerson.studentAtWorkProfile.balance = this.PersonDocumentForm.get('balance').value;;
      this.currentPerson.studentAtWorkProfile.contingent = this.PersonDocumentForm.get('contingent').value;

      this.personDocuments.customerVatNumber = this.VatNumber;
      this.personDocuments.fileName = files.item(0).name;
      this.personDocuments.file = files.item(0);
      this.personDocuments.fileType = FileType.StudentAtWork;
      this.personDocuments.personId = this.SocialSecurityId;
      }
    }
  }

  uploadStudentAtWorkFileToActivity() {
    this.personService.constructionCardsFile(this.studentAtWorkFileToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }

  downloadStudentAtWorkAttestationFile() {   
    saveAs( this.currentPerson.studentAtWorkProfile.attestation.location, 'application/pdf;charset=utf-8');
  }

  



  handleDriversLicenseFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.driversFileToUpload = files.item(0);

      this.driverProfilesItem = new DriverProfilesItem ();
      this.driverProfilesItem.type =""
      this.driverProfilesItem.attestation.name =files.item(0).name;
      this.driverProfilesItem.attestation.location ="";
      this.driverProfilesItem.type = this.ddl_drivinglicenseSelected;
      this.currentPerson.driverProfiles.push(this.driverProfilesItem);

      this.personDocuments.customerVatNumber = this.VatNumber;
      this.personDocuments.fileName = files.item(0).name;
      this.personDocuments.file = files.item(0);
      this.personDocuments.fileType = this.ddl_drivinglicenseSelected;
      this.personDocuments.personId = this.SocialSecurityId;
      } 
    }
  }

  uploadDriversFileToActivity() {
    this.personService.constructionCardsFile(this.driversFileToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }

  downloadDriversLicenseFile() {  
    // download by selected index
    //saveAs( this.currentPerson.constructionProfile.constructionCards[0], 'application/pdf;charset=utf-8');
  }

  deleteDriversLicense() {  
    // delete
  }

  handleOtherDocumentsInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.otherDocumentsToUpload = files.item(0);
       
      this.documents = new Documents();
      this.documents.name = files.item(0).name;
      this.documents.location = "";
      this.currentPerson.otherDocuments.push(this.documents);

      this.personDocuments.customerVatNumber = this.VatNumber;
      this.personDocuments.fileName = files.item(0).name;
      this.personDocuments.file = files.item(0);
      this.personDocuments.fileType = files.item(0).name;
      this.personDocuments.personId = this.SocialSecurityId;  
    } 
    }
  }
  

  uploadOtherDocumentsToActivity() {
    this.personService.constructionCardsFile(this.otherDocumentsToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }

  
  downloadOtherDocumentsFile() {  
    // download by selected index
    //saveAs( this.currentPerson.constructionProfile.constructionCards[0], 'application/pdf;charset=utf-8');
  }

  deleteOtherDocuments() {  
    // delete
  }
  
  

  onStatusChange(event, i) {
    console.log('Position index : ' + i + ', Enabled : ' + event);
  }

  onClickPost(){
    //this.personService.medicalAttestation()
    
  }

}
