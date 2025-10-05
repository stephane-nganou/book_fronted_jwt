import { Injectable } from '@angular/core';
import { ApiErrorResponse } from './models/api-error-response';

@Injectable({
  providedIn: 'root'
})
export class JsonParserService {

  maxRetry = 2;
  retry = 0;

  parseErrorResponse(jsonString: any, status: number, isStringMessage: boolean = false): ApiErrorResponse {
    
    try {
      
      if (isStringMessage)
        return this.returnDefaultResponse(jsonString, status);

      const parsed = JSON.parse(jsonString);

      // Validate the parsed object structure
      if (this.isValidErrorResponse(parsed)) {
        return parsed as ApiErrorResponse;
      } else {
        return this.returnDefaultResponse(jsonString, status);
      }
    } catch (error) {

      if (this.retry < this.maxRetry) {
        this.retry++;
        return this.parseErrorResponse(jsonString, status, true);
      } else {
        console.error('Failed to parse JSON:', error);
        this.retry = 0;
        return {
          timestamp: new Date().toLocaleTimeString(),
          errorMessage: "An error occured. Please retry!",
          validationErrors: [],
          details: ""

        } as ApiErrorResponse;
      }
    }
  }

  private returnDefaultResponse(jsonString: string, status: number): ApiErrorResponse {
    console.warn('Parsed JSON does not match expected ApiErrorResponse structure');
        return {
          timestamp: new Date().toISOString(),
          errorMessage: this.matchMessageBasedOnStatus(jsonString, status),
          validationErrors: [],
          details: ""

        } as ApiErrorResponse;
  }

  private matchMessageBasedOnStatus(message: string, status: number): string {

    if(status === 403){
      message = "Access denied: Bad credentials"
    }
    
    return message;
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
