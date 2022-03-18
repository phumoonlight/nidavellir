export const MESSAGE = {
  success: 'success',
  internalServerError: 'internal_server_error',
  // request
  requiredOwnerId: 'error: required field [ownerId]',
  // upload
  uploaded: 'uploaded',
  uploadedError: 'error: failed to upload',
  uploadedEmpty: 'error: file cannot be empty',
  uploadedSizeTooLarge: 'error: maximum 5 mb allowed'
}

export class ResponsePayload {
  code: string = 'success'
  message: string = 'success'
  success: boolean = true
  data: any = null
}