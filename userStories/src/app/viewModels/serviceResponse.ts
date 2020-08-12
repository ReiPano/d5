export class ServiceResponse {
  success: boolean;
  message: string;
  result?;

  static InitResponse(): ServiceResponse {
      return {success: false, message: '', result: null};
  }
}
