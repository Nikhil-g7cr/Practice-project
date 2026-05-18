// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
//   BadRequestException,
//   UnauthorizedException,
//   ForbiddenException,
//   NotFoundException,
//   ConflictException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { AppResponse } from '../../../shared/appresponse.shared';
// import { MESSAGES } from '../../../shared/messages.shared';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);

//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest<Request>();
//     const response = ctx.getResponse<Response>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = MESSAGES.INTERNAL_ERROR;
//     let details: any = null;

//     // Handle HttpException
//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const exceptionResponse = exception.getResponse();

//       // Extract message from HttpException
//       if (typeof exceptionResponse === 'object') {
//         const { message: msg, error, statusCode } = exceptionResponse as any;
//         message = msg || error || MESSAGES.INTERNAL_ERROR;
//         details = (exceptionResponse as any).message;
//       } else {
//         message = exceptionResponse as string;
//       }
//     }
//     // Handle ValidationError from class-validator
//     else if (exception.isJoi || exception.details) {
//       status = HttpStatus.BAD_REQUEST;
//       message = MESSAGES.VALIDATION_ERROR;
//       details = exception.details || exception.message;
//     }
//     // Handle Mongoose errors
//     else if (exception.name === 'MongoServerError') {
//       if (exception.code === 11000) {
//         status = HttpStatus.CONFLICT;
//         message = MESSAGES.CONFLICT;
//         details = `Duplicate field: ${Object.keys(exception.keyPattern)[0]}`;
//       } else {
//         status = HttpStatus.INTERNAL_SERVER_ERROR;
//         message = MESSAGES.INTERNAL_ERROR;
//       }
//     } else if (exception.name === 'CastError') {
//       status = HttpStatus.BAD_REQUEST;
//       message = MESSAGES.BAD_REQUEST;
//       details = `Invalid ${exception.path}: ${exception.value}`;
//     } else if (exception.name === 'ValidationError') {
//       status = HttpStatus.BAD_REQUEST;
//       message = MESSAGES.VALIDATION_ERROR;
//       details = Object.values(exception.errors).map((err: any) => err.message);
//     }
//     // Handle JWT errors
//     else if (exception.name === 'JsonWebTokenError') {
//       status = HttpStatus.UNAUTHORIZED;
//       message = MESSAGES.AUTH_TOKEN_INVALID;
//     } else if (exception.name === 'TokenExpiredError') {
//       status = HttpStatus.UNAUTHORIZED;
//       message = 'Token expired';
//     }
//     // Handle generic errors
//     else if (exception instanceof Error) {
//       this.logger.error(
//         `Unhandled Exception: ${exception.message}`,
//         exception.stack,
//       );
//       status = HttpStatus.INTERNAL_SERVER_ERROR;
//       message = MESSAGES.INTERNAL_ERROR;
//     }

//     // Log the error
//     this.logError(request, status, message, exception);

//     // Format and send response
//     const errorResponse = new AppResponse(
//       status,
//       message,
//       details,
//       request.url,
//     );

//     response.status(status).json(errorResponse);
//   }

//   private logError(
//     request: Request,
//     status: number,
//     message: string,
//     exception: any,
//   ): void {
//     const { method, originalUrl, ip } = request;
//     const userAgent = request.get('user-agent');

//     const logMessage = `
//     ╔════════════════════════════════════════════════════════════╗
//     ║                    ERROR OCCURRED                          ║
//     ╠════════════════════════════════════════════════════════════╣
//     ║ Status: ${status}
//     ║ Method: ${method}
//     ║ URL: ${originalUrl}
//     ║ IP: ${ip}
//     ║ Message: ${message}
//     ║ Error: ${exception.message || 'Unknown error'}
//     ║ User Agent: ${userAgent}
//     ╚════════════════════════════════════════════════════════════╝
//     `;

//     if (status >= 500) {
//       this.logger.error(logMessage, exception.stack);
//     } else if (status >= 400) {
//       this.logger.warn(logMessage);
//     } else {
//       this.logger.log(logMessage);
//     }
//   }
// }
