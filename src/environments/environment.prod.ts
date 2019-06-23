export const environment = {
  name: 'prod',
  production: true,
  dataFromAPI_JSON: false, // True = From Remote :: False = From JSON
  dpsAPI: 'https://dpsapisdev.azurewebsites.net/api/',
  boemmAPI: 'https://boemmapidev.azurewebsites.net/api/',
  blobStorage: 'https://dpsstorageaccountdev.blob.core.windows.net',
  aadurl: 'https://digitalpayrollservices.b2clogin.com',
  tenantid: 'digitalpayrollservices.onmicrosoft.com',
  clientId: '4beb27ea-cf5b-4a8c-ae57-91a087e0ff60',
  webUrl: 'https://dpsselfserviceportalprod.azurewebsites.net/',
  logInRedirectURL: 'login',
  logOutRedirectURL: 'logout',
  logInSuccessURL: 'dashboard',
  logInSuccessNoCustomerURL: 'customer/add',
  signInPolicy: 'B2C_1_SelfServiceSignUpSignIn',
  signUpPolicy: 'B2C_1_SelfServiceSignUpSignIn',
  forgotPasswordPolicy: 'B2C_1_SelfServicePasswordReset',
  B2CTodoAccessTokenKey: 'b2c.access.token',
  getAssetsDataPath: '../../assets/data/',
  getPositionFileUploads: 'postion/',
  getPositionsDownloadTemplate: 'postion/Position1.pdf',
  getCustomerByVatNumber: 'Customer/GetCustomerByVatNumber',
  getCustomerByVatNumberEdit: 'Customer/',
  createCustomer: 'Customer',
  CreatePerson: 'Person',
  getUsers: 'User',
  getUserByUsername: 'User/User',
  createUser: 'User/Create',
  verifylogin: '',
  getLegalForm: '',
  getCounteries: 'countries',
  getParitairCommitee: 'ParitairCommitee',
  getStatute: 'Statute',
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
  getSummaryURL: 'ToDo/ForCustomer',
  getPersonBySSIDNVatNumber: 'Person',
  getPersonById: 'Person',
  getUser: 'User',
  getLocation: 'Location',
  getWorkSchedule: 'WorkSchedule',
  getPosition: 'Position',
  getPositionUpdate: 'Position/uploadDocument',
  getPerson: 'Person',
  getSummary: 'ToDo',
  postPersonDocuments: 'Person/UpladDocuments',
  getWorkscheduleEmpty: 'workschedules_empty.json',
  getFileUploads: '',
  getContract: 'Contract',
  getDpsSchedules: 'Schedule',
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
  getPrintContractFileURL: 'Contract/Pdf',
  getApproveContractURL: 'Contract/Approve',
  getContractReasonURL: 'ContractReasons',
  isLoggingRequired: false
};
