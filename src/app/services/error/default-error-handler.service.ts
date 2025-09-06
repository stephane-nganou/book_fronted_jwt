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


    handleError(error: any ): Array<string> {

        let errorMsg: Array<string> = [];

        console.log(error);
        const parsedError = this.errorParserService.parseErrorResponse(error.error);
        if (undefined === parsedError.timestamp) {
            errorMsg.push('Something went wrong');
        }
        if (parsedError.validationErrors && parsedError.validationErrors.length > 0) {
            errorMsg = parsedError.validationErrors;
        } else {
            errorMsg.push(parsedError.errorMessage);
        }

        return errorMsg;
    }
}