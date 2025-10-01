import { Injectable } from "@angular/core";
import { JsonParserService } from "../json-parser.service";
import { ErrorHandler } from "./error-handler.service";


@Injectable({
    providedIn: 'root'
})
export class DefaulErrorHandlerService implements ErrorHandler {

    constructor(
        private errorParserService: JsonParserService,
    ) { }


    handleError(error: any): Array<string> {

        let errorMsg: Array<string> = [];
        const defaultErrorMsg = "Something went wrong";

        try {
            console.log(`An error occured: `);
            console.log(error);

            const parsedError = error.error ? this.errorParserService.parseErrorResponse(error.error, error.status)
                : error.message ? this.errorParserService.parseErrorResponse(error.message, error.status) : this.errorParserService.parseErrorResponse(error, error.status);
            
            if (parsedError.validationErrors && parsedError.validationErrors.length > 0) {
                errorMsg = parsedError.validationErrors;
            } else {
                errorMsg.push(parsedError.errorMessage);
            }

            return errorMsg;
        } catch (ex) {
            console.log(`Error could not be caugth: ${ex}`);
            errorMsg.push(defaultErrorMsg);

            return errorMsg;
        }

    }
}