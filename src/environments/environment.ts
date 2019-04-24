// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dataFromAPI_JSON: true, // True = From Remote :: False = From JSON
  dpsAPI: 'https://dpsapisdev.azurewebsites.net/api/',
  boemmAPI: 'https://boemmapidev.azurewebsites.net/api/',
  getCustomers: 'Customer',
  getCustomerLists: 'Customer/GetAllCustomersPreviewJson',
  getCustomerByVatNumber: 'Customer/GetCustomerByVatNumber',
  getCustomerByVatNumberEdit:'Customer/',
  createCustomer: 'Customer',
  getUsers: 'User',
  getUserByUsername: 'User/User',
  createUser: 'User/Create',
  getLegalForm: '',
  getCounteries: '',
  getParitairCommitee: 'ParitairCommitee',
  getStatute: '',
  getCodes: 'code',
  getLanguages: '',
  getWorkSchedule: 'User/{CustomerVatNumber}',
  getPosition: 'User/{CustomerVatNumber}',
  getLocations: 'Location',
  createLocation: 'Location',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
