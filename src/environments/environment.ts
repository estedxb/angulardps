// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dataFromAPI_JSON: true, // True = From Remote :: False = From JSON
  dpsAPI: 'https://dpsapisdev.azurewebsites.net/api/',
  boemmAPI: 'https://boemmapidev.azurewebsites.net/api/',
  getCustomerByVatNumber: 'Customer/GetCustomerByVatNumber',
  getCustomerByVatNumberEdit: 'Customer/',
  createCustomer: 'Customer',
  CreatePerson: 'Person',
  getUsers: 'User',
  getUserByUsername: 'User/User',
  createUser: 'User/Create',
  verifylogin: '',
  getLegalForm: '',
  getCounteries: '',
  getParitairCommitee: 'ParitairCommitee',
  getStatute: '',
  getCodes: 'code',
  getLanguages: '',
  getCustomers: 'Customer',
  getCustomerLists: 'Customer/GetAllCustomersPreviewJson',
  getCustomersByVatNumber: 'Customer/GetCustomerByVatNumber',
  getUsersByVatNumber: 'User/ForCustomer',
  getLocationsByVatNumber: 'Location/ForCustomer',
  getWorkSchedulesByVatNumber: 'WorkSchedule/ForCustomer',
  getPositionsByVatNumber: 'Position/ForCustomer',
  getPersonsByVatNumber: 'Person/ForCustomer',
  getPersonBySSIDNVatNumber: 'Person',
  getPersonById: 'Person',
  getUser: 'User',
  getLocation: 'Location',
  getWorkSchedule: 'WorkSchedule',
  getPosition: 'Position',
  getPerson: 'Person',
  getWorkscheduleEmpty: '../../assets/data/workschedules_empty.json',
  getFileUploads: '',
  getPositionFileUploads: 'https://dpsstorageaccountdev.blob.core.windows.net/postion/',
  getContract: 'Contract',
  getPersonsContracts: '',
  getSummaryURL: '',
  actionURL_1: 'customer/edit',
  actionURL_2: 'customer/position',
  actionURL_3: 'customer/user',
  actionURL_4: 'customer/location',
  actionURL_5: 'customer/work',
  actionURL_6: 'person/$id$/',
  actionURL_7: 'person/$id$/position',
  actionURL_8: 'person/$id$/document',
  actionURL_9: 'dashboard/contract/$id$',
  getVehicles: '',
  getPositionsDownloadTemplate : 'https://dpsstorageaccountdev.blob.core.windows.net/postion/Position1.pdf'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
