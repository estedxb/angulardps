export const environment = {
  name: 'stag',
  production: false,
  dataFromAPI_JSON: true, // True = From Remote :: False = From JSON
  dpsAPI: 'https://dpsapistg.azurewebsites.net/api/',
  boemmAPI: 'https://boemmapistg.azurewebsites.net/api/',
  blobStorage: 'https://dpsstorageaccountstg.blob.core.windows.net',
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
  getDpsSchedules: '', // 'Schedule'
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
  //getPositionsDownloadTemplate: 'https://dpsstorageaccountstg.blob.core.windows.net/position/Position1.pdf',
  getPrintContractFileURL: 'Contract/Pdf',
  getApproveContractURL: 'Contract/Approve',
  getContractReasonURL: 'ContractReasons'
};
