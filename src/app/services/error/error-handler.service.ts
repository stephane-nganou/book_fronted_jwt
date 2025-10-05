
export interface ErrorHandler {

    handleError(error: any, errorMsg: Array<string>): Array<string>;
}