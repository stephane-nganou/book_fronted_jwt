export interface ApiErrorResponse {

  /**
   * timestamp is required
   */
  timestamp: string;
  /**
   * errorMessage is required
   */
  errorMessage: string;
  /**
   * validationErrors is optional and can be empty
   */
  validationErrors: string[];
  /**
   * details is optional and can be empty
   */
  details: string;
}