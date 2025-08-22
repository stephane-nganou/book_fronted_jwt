import { Injectable } from '@angular/core';
import { ApiErrorResponse } from './models/api-error-response';

@Injectable({
  providedIn: 'root'
})
export class JsonParserService {

  parseErrorResponse(jsonString: string): ApiErrorResponse {
    try {
      // parse the JSON string
      const parsed = JSON.parse(jsonString);

      // Validate the parsed object structure
      if(this.isValidErrorResponse(parsed)){
        return parsed as ApiErrorResponse;
      }else{
        console.warn('Parsed JSON does not match expected ApiErrorResponse structure');
        return {} as ApiErrorResponse;
      }
    } catch(error){
      console.error('Failed to parse JSON:', error);
      return {} as ApiErrorResponse;
    }
  }

  private isValidErrorResponse(obj: any): boolean {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.timestamp === 'string' &&
      typeof obj.errorMessage === 'string' &&
      Array.isArray(obj.validationErrors) &&
      obj.validationErrors.every((err: any) => typeof err === 'string') &&
      typeof obj.details === 'string'
    );
  }
}
