import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ValidationError } from "class-validator";

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    let errors = [];

    // Extract validation errors if it’s a validation exception
    if (exception.getStatus() === HttpStatus.BAD_REQUEST) {
      const exceptionResponse = exception.getResponse() as any;

      if (
        exceptionResponse.message &&
        Array.isArray(exceptionResponse.message)
      ) {
        errors = this.formatErrors(exceptionResponse["message"]);

        response.status(status).json({
          statusCode: status,
          message: "Validation failed",
          OK: false,
          errors, // Return the populated errors array
        });
      }
    } else {
      // For other exceptions, return the default response
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }

  private formatErrors(validationErrors: ValidationError[]): any[] {
    return validationErrors.map((error) => ({
      fieldName: error.property,
      message: Object.values(error.constraints || {}).join(", "),
    }));
  }
}
