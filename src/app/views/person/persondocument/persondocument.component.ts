import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, Form, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarConfig, MatDialogRef, MatSnackBarRef } from '@angular/material';
import {
  _Position, FileType, PersonDocuments, DriverProfilesItem, DpsUser, Documents, DpsPerson, LoginToken
} from '../../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { PersonService } from '../../../shared/person.service';
import { environment } from '../../../../environments/environment';;
import { LoggingService } from '../../../shared/logging.service';


@Component({
  selector: 'app-persondocument',
  templateUrl: './persondocument.component.html',
  styleUrls: ['./../person.component.css']
})
export class PersonDocumentComponent implements OnInit {
  @Input() SocialSecurityId: string;
  public maindatas = [];
  public dpsPersondata = [];
  public vehiclesForLicense = [];
  public errorMsg;
  public dpsLoginToken: LoginToken = JSON.parse(localStorage.getItem('dpsLoginToken'));
  public VatNumber = this.dpsLoginToken.customerVatNumber;
  PersonDocumentForm: FormGroup;

  public isConstructionSector: boolean;
  public isStudentAtWork: boolean;
  public isDriver: boolean;

  public medicalAttestationDocumentName: string;
  public vcaAttestationDocumentName: string;
  public constructionCardsDocumentName: string;
  public drivingLicenseDocumentName: string;
  public otherDocumentName: string;

  medicalAttestationFileToUpload: File = null;
  vcaAttestationFileToUpload: File = null;
  constructionCardsToUpload: File = null;
  studentAtWorkFileToUpload: File = null;
  otherDocumentsToUpload: File = null;
  driversFileToUpload: File = null;

  selectedOption: any;
  public documents: Documents;
  public personDocuments: PersonDocuments;
  public driverProfilesItem: DriverProfilesItem
  public currentPerson: DpsPerson;

  public data: DpsPerson;
  constructor(private personService: PersonService, private dialog: MatDialog, private snackBar: MatSnackBar, private logger: LoggingService) { }

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
      balance: new FormControl('', [Validators.required, Validators.pattern('^[ 0-9 ]+$')]),
      contingent: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]+$')]),
      attestationDate: new FormControl('', [Validators.required]),
      file: new FormControl('')
    });

  }

  onOptionSelected(event) {
    this.logger.log(event); //option value will be sent as event
  }


  onConstructionSectorChange($event) {
    // this.currentPerson.constructionProfile. = $event;
    // this.logger.log('after');
    // this.logger.log(this.currentPerson);
  }

  onIsDriverChange($event) {
    // this.currentPerson.constructionProfile. = $event;
    // this.logger.log('after');
    // this.logger.log(this.currentPerson);
  }

  onisStudentAtWorkChange($event) {
    // this.currentPerson.constructionProfile. = $event;
    // this.logger.log('after');
    // this.logger.log(this.currentPerson);
  }


  getVehiclesForLicense() {
    this.personService.getVehiclesForLicense().subscribe(response => {
      this.vehiclesForLicense = response;
      this.logger.log('this.vehiclesForLicense::: ', this.vehiclesForLicense);
      this.ShowMessage('vehicles fetched successfully.', '');
      // Remove the  Vehicles with License in this.currentPerson
      //this.vehiclesForLicense = this.vehiclesForLicense.filter( function( el ) {
      //return !this.currentPerson.driverProfiles.includes( el );
      this.vehiclesForLicense = this.vehiclesForLicense.filter((el) => !this.currentPerson.driverProfiles.includes(el));
    }, error => this.ShowMessage(error, 'error'));

  }
  getPersonBySSIDVatnumber(ssid: string, customervatnumber: string) {
    this.personService.getPersonBySSIDVatnumber(ssid, customervatnumber).subscribe(response => {
      this.currentPerson = response.body;
      this.logger.log('this.currentPerson::: ', this.currentPerson);
      this.ShowMessage('Person fetched successfully.', '');
      this.getVehiclesForLicense();
    }, error => this.ShowMessage(error, 'error'));
  }


  ShowMessage(MSG, Action) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    snackBarConfig.horizontalPosition = 'center';
    snackBarConfig.verticalPosition = 'top';
    const snackbarRef = this.snackBar.open(MSG, Action, snackBarConfig);
    snackbarRef.onAction().subscribe(() => {
      this.logger.log('Snackbar Action :: ' + Action);
    });
  }


  handleMedicalAttestationFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.medicalAttestationFileToUpload = files.item(0);

        this.currentPerson.medicalAttestation.name = files.item(0).name;
        this.currentPerson.medicalAttestation.location = "";
        this.logger.log('this.VatNumber :: ', this.VatNumber);
        this.personDocuments = new PersonDocuments();
        this.personDocuments.customerVatNumber = this.VatNumber;
        this.personDocuments.fileName = files.item(0).name;
        this.personDocuments.file = files.item(0);
        this.personDocuments.fileType = FileType.MedicalAttestation;
        this.personDocuments.personId = this.SocialSecurityId;
        this.uploadMedicalAttestationFileToActivity();

      }
    }
  }

  uploadMedicalAttestationFileToActivity() {
    this.personService.updateMedicalAttestationFile(this.medicalAttestationFileToUpload, this.VatNumber, this.currentPerson.person.socialSecurityNumber.number, FileType.MedicalAttestation, this.currentPerson.medicalAttestation.name).subscribe(data => {
      // do something, if upload success

    }, error => {
      this.logger.log(error);
    });
  }

  deleteMedicalAttestation() {
    this.currentPerson.medicalAttestation.name = '';
    this.currentPerson.medicalAttestation.location = '';
    this.updatePerson();
  }

  downloadMedicalAttestationFile() {
    let url = environment.blobStorage + '' + this.currentPerson.medicalAttestation.location;
    this.logger.log('downloadMedicalAttestationFile() :: ', url);
    saveAs(url, this.currentPerson.medicalAttestation.name);
  }

  handleVcaAttestationFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.vcaAttestationFileToUpload = files.item(0);

        this.currentPerson.vcaAttestation.name = files.item(0).name;
        this.currentPerson.vcaAttestation.location = "";
        this.personDocuments = new PersonDocuments();
        this.personDocuments.customerVatNumber = this.VatNumber;
        this.personDocuments.fileName = files.item(0).name;
        this.personDocuments.file = files.item(0);
        this.personDocuments.fileType = files.item(0).name;
        this.personDocuments.personId = this.SocialSecurityId;

        this.uploadVcaAttestationFileToActivity();

      }
    }
  }

  uploadVcaAttestationFileToActivity() {
    this.personService.vcaAttestationFile(this.vcaAttestationFileToUpload, this.VatNumber, this.currentPerson.person.socialSecurityNumber.number, FileType.VcaAttestation, this.currentPerson.vcaAttestation.name).subscribe(data => {
      // do something, if upload success
    }, error => {
      this.logger.log(error);
    });
  }

  downloadVcaAttestationFile() {
    let url = environment.blobStorage + '' + this.currentPerson.vcaAttestation.location;
    this.logger.log('downloadVcaAttestationFile() :: ', url);
    saveAs(url, this.currentPerson.vcaAttestation.name);
  }

  deleteVcaAttestation() {
    this.currentPerson.vcaAttestation.name = '';
    this.currentPerson.vcaAttestation.location = '';
    this.updatePerson();
  }

  handleConstructionCardsFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.constructionCardsToUpload = files.item(0);

        this.documents = new Documents();
        this.documents.name = files.item(0).name;
        this.documents.location = "";
        this.currentPerson.constructionCards.push(this.documents);
        this.personDocuments = new PersonDocuments();
        this.personDocuments.customerVatNumber = this.VatNumber;
        this.personDocuments.fileName = files.item(0).name;
        this.personDocuments.file = files.item(0);
        this.personDocuments.fileType = FileType.ConstructionCards;
        this.personDocuments.personId = this.SocialSecurityId;

        this.uploadConstructionCardsFileToActivity();

      }
    }
  }

  uploadConstructionCardsFileToActivity() {
    this.personService.constructionCardsFile(this.constructionCardsToUpload, this.VatNumber, this.currentPerson.person.socialSecurityNumber.number, FileType.ConstructionCards, this.documents.name).subscribe(data => {
      // do something, if upload success
    }, error => {
      this.logger.log(error);
    });
  }

  downloadConstructionCardFile(index: number) {
    this.logger.log('index :: ', index);
    saveAs(environment.blobStorage + '' + this.currentPerson.constructionCards[index].location, this.currentPerson.constructionCards[index].name);
  }

  deleteConstructionCard(index: number) {
    this.logger.log('index :: ', index);
    if (index > -1) {
      this.currentPerson.constructionCards.splice(index, 1);
    }
    this.updatePerson();
  }


  handleStudentAtWorkFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.studentAtWorkFileToUpload = files.item(0);

        this.currentPerson.studentAtWorkProfile.attestation.name = files.item(0).name;
        this.currentPerson.studentAtWorkProfile.attestation.location = "";
        this.currentPerson.studentAtWorkProfile.attestationDate = this.PersonDocumentForm.get('attestationDate').value;;
        this.currentPerson.studentAtWorkProfile.balance = this.PersonDocumentForm.get('balance').value;;
        this.currentPerson.studentAtWorkProfile.contingent = this.PersonDocumentForm.get('contingent').value;
        this.personDocuments = new PersonDocuments();
        this.personDocuments.customerVatNumber = this.VatNumber;
        this.personDocuments.fileName = files.item(0).name;
        this.personDocuments.file = files.item(0);
        this.personDocuments.fileType = FileType.StudentAtWork;
        this.personDocuments.personId = this.SocialSecurityId;

        this.uploadStudentAtWorkFileToActivity();

      }
    }
  }

  uploadStudentAtWorkFileToActivity() {
    this.personService.constructionCardsFile(this.studentAtWorkFileToUpload, this.VatNumber, this.currentPerson.person.socialSecurityNumber.number, FileType.StudentAtWork, this.currentPerson.studentAtWorkProfile.attestation.name).subscribe(data => {
      // do something, if upload success
    }, error => {
      this.logger.log(error);
    });
  }

  downloadStudentAtWorkAttestationFile() {
    saveAs(environment.blobStorage + '' + this.currentPerson.studentAtWorkProfile.attestation.location, this.currentPerson.studentAtWorkProfile.attestation.name);
  }



  handleDriversLicenseFileInput(files: FileList) {
    if (files.length > 0) {
      if (files.item(0).type === 'application/pdf' || files.item(0).type === 'image/jpg' || files.item(0).type === 'image/jpeg'
        || files.item(0).type === 'image/png') {
        this.driversFileToUpload = files.item(0);


        this.driverProfilesItem = new DriverProfilesItem();
        this.documents = new Documents();
        this.documents.name = files.item(0).name;
        this.documents.location = '';
        this.driverProfilesItem.attestation = this.documents;
        this.driverProfilesItem.type = this.selectedOption;

        this.currentPerson.driverProfiles.push(this.driverProfilesItem);
        this.personDocuments = new PersonDocuments();
        this.personDocuments.customerVatNumber = this.VatNumber;
        this.personDocuments.fileName = files.item(0).name;
        this.personDocuments.file = files.item(0);
        this.personDocuments.fileType = this.selectedOption;
        this.personDocuments.personId = this.SocialSecurityId;

        this.logger.log('this.selectedOption; :: ', this.selectedOption);

        this.uploadDriversFileToActivity();

      }
    }
  }


  selectOption(value: string) {
    this.logger.log(value);
  }

  uploadDriversFileToActivity() {
    this.personService.constructionCardsFile(this.driversFileToUpload, this.VatNumber, this.currentPerson.person.socialSecurityNumber.number, FileType.DriversLicense, this.driverProfilesItem.attestation.name).subscribe(data => {
      // do something, if upload success
    }, error => {
      this.logger.log(error);
    });
  }

  downloadDriversLicenseFile(index: number) {
    this.logger.log('index :: ', index);
    saveAs(environment.blobStorage + '' + this.currentPerson.driverProfiles[index].attestation.location, this.currentPerson.driverProfiles[index].attestation.name);
  }

  deleteDriversLicense(index: number) {
    this.logger.log('index :: ', index);
    if (index > -1) {
      this.currentPerson.driverProfiles.splice(index, 1);
    }
    this.updatePerson();
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
        this.personDocuments = new PersonDocuments();
        this.personDocuments.customerVatNumber = this.VatNumber;
        this.personDocuments.fileName = files.item(0).name;
        this.personDocuments.file = files.item(0);
        this.personDocuments.fileType = FileType.OtherDocuments;
        this.personDocuments.personId = this.SocialSecurityId;

        this.uploadOtherDocumentsToActivity();

      }
    }
  }

  updatePerson() {
    this.personService.updatePosition(this.currentPerson).subscribe(res => {
      this.logger.log("response=" + res);
      this.logger.log(":::::::::::::::current person updated");
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.logger.log("Error occured=" + err.error.message);
        }
        else {
          this.logger.log("response code=" + err.status);
          this.logger.log("response body=" + err.error);
        }
      }
    );
  }


  uploadOtherDocumentsToActivity() {
    this.personService.constructionCardsFile(this.otherDocumentsToUpload, this.VatNumber, this.currentPerson.person.socialSecurityNumber.number, FileType.OtherDocuments, this.documents.name).subscribe(data => {
      // do something, if upload success
    }, error => {
      this.logger.log(error);
    });
  }


  downloadOtherDocumentsFile(index: number) {
    this.logger.log('index :: ', index);
    saveAs(environment.blobStorage + '' + this.currentPerson.otherDocuments[index].location, this.currentPerson.otherDocuments[index].name);
  }

  deleteOtherDocuments(index: number) {
    this.logger.log('index :: ', index);
    if (index > -1) {
      this.currentPerson.otherDocuments.splice(index, 1);
    }
    this.updatePerson();
  }



  onStatusChange(event, i) {
    this.logger.log('Position index : ' + i + ', Enabled : ' + event);
  }

  onClickPost() {
    //this.personService.medicalAttestation()

  }

}
