/**
 * Error Taxonomy — Foundation Layer
 *
 * Typed error categories for the luxury shoes landing page.
 * All errors carry: type/code, human message, context, and retryability.
 *
 * Required categories per Machine-Level Standards:
 * VALIDATION, AUTHENTICATION, AUTHORIZATION, NOT_FOUND,
 * EXTERNAL_DEPENDENCY, INTERNAL, RATE_LIMITED
 */

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  EXTERNAL_DEPENDENCY = 'EXTERNAL_DEPENDENCY',
  INTERNAL = 'INTERNAL',
  RATE_LIMITED = 'RATE_LIMITED',
}

export interface AppError {
  readonly type: ErrorType;
  readonly code: string;
  readonly message: string;
  readonly context: string;
  readonly retryable: boolean;
  readonly timestamp: Date;
}

export function createError(
  type: ErrorType,
  code: string,
  message: string,
  context: string,
  retryable: boolean = false
): AppError {
  return Object.freeze({
    type,
    code,
    message,
    context,
    retryable,
    timestamp: new Date(),
  });
}

export function isRetryable(error: AppError): boolean {
  return error.retryable;
}

export function formatErrorForUser(error: AppError): string {
  return `${error.message} (${error.code})`;
}

export function formatErrorForLog(error: AppError): string {
  return `[${error.type}] ${error.code}: ${error.message} | context: ${error.context} | retryable: ${error.retryable}`;
}

// Predefined error factories for common scenarios
export const Errors = {
  validation: {
    requiredField: (field: string): AppError =>
      createError(
        ErrorType.VALIDATION,
        'VAL-001',
        `${field} is required`,
        `form-field:${field}`,
        false
      ),
    invalidEmail: (): AppError =>
      createError(
        ErrorType.VALIDATION,
        'VAL-002',
        'Please enter a valid email address',
        'form-field:email',
        false
      ),
    passwordTooShort: (min: number): AppError =>
      createError(
        ErrorType.VALIDATION,
        'VAL-003',
        `Password must be at least ${min} characters`,
        'form-field:password',
        false
      ),
    passwordMismatch: (): AppError =>
      createError(
        ErrorType.VALIDATION,
        'VAL-004',
        'Passwords do not match',
        'form-field:confirmPassword',
        false
      ),
  },
  authentication: {
    invalidCredentials: (): AppError =>
      createError(
        ErrorType.AUTHENTICATION,
        'AUTH-001',
        'Invalid email or password',
        'login-form',
        false
      ),
    sessionExpired: (): AppError =>
      createError(
        ErrorType.AUTHENTICATION,
        'AUTH-002',
        'Your session has expired. Please log in again.',
        'session',
        true
      ),
  },
  internal: {
    unexpected: (context: string): AppError =>
      createError(
        ErrorType.INTERNAL,
        'INT-001',
        'An unexpected error occurred. Please try again.',
        context,
        true
      ),
  },
} as const;
