export const environment = {
  name: 'stg',
  production: false,
  dataFromAPI_JSON: true, // True = From Remote :: False = From JSON
  dpsAPI: 'https://dpsapistg.azurewebsites.net/api/',
  boemmAPI: 'https://boemmapistg.azurewebsites.net/api/',
  blobStorage: 'https://dpsstorageaccountstg.blob.core.windows.net',
  aadurl: 'https://login.microsoftonline.com', // 'https://digitalpayrollservices.b2clogin.com', // 
  tenantid: 'digitalpayrollservices.onmicrosoft.com',
  clientId: '4beb27ea-cf5b-4a8c-ae57-91a087e0ff60',
  webUrl: 'https://dpsselfserviceportalstg.azurewebsites.net/',
  logInRedirectURL: 'login',
  logOutRedirectURL: 'logout',
  logInSuccessURL: 'dashboard',
  B2CSuccess: 'validate',
  B2C: '',
  DPSVATNumber: '987654321000',
  MorningStart: 6,
  EveningingEnd: 22,
  DimonaCostMinium: 0.3300,
  DimonaCostMaximum: 0.3510,
  StatuteCoefficientMax: 3.5,
  grossHoulyWageMinimum: 5,
  logInSuccessNoCustomerURL: 'customer/add',
  signInPolicy: 'B2C_1_SelfServiceSignUpSignIn',
  signUpPolicy: 'B2C_1_SelfServiceSignUpSignIn',
  forgotPasswordPolicy: 'B2C_1_SelfServicePasswordChange',
  B2CTodoAccessTokenKey: 'dpsuseraccesstoken',
  getAssetsDataPath: '../../assets/data/',
  getPositionFileUploads: 'position/',
  getPositionsDownloadTemplate: 'position/Position1.pdf',
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
  getPersonBySSIDBoemm: 'Person',
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
  isLoggingRequired: true
};

