export function getErrorMessageFrom(error: any) : string {
  //unwrapping uncaught promise rejection
  if(error.promise && error.rejection){
    error = error.rejection;
  }
  return error?.message || 'Undefined client error';
}
