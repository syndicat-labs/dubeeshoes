/**
 * Validation Module — Form validation using the error taxonomy
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ValidationResult = {
  valid: boolean;
  errors: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FieldValidator = (value: string) => ValidationResult;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Validators = {
  required(fieldName: string): FieldValidator {
    return (value: string): ValidationResult => {
      if (!value.trim()) {
        return {
          valid: false,
          errors: [`${fieldName} is required`],
        };
      }
      return { valid: true, errors: [] };
    };
  },

  email(): FieldValidator {
    return (value: string): ValidationResult => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {
          valid: false,
          errors: ['Please enter a valid email address'],
        };
      }
      return { valid: true, errors: [] };
    };
  },

  minLength(min: number): FieldValidator {
    return (value: string): ValidationResult => {
      if (value.length < min) {
        return {
          valid: false,
          errors: [`Must be at least ${min} characters`],
        };
      }
      return { valid: true, errors: [] };
    };
  },

  matchesField(otherFieldName: string, otherFieldValue: string): FieldValidator {
    return (value: string): ValidationResult => {
      if (value !== otherFieldValue) {
        return {
          valid: false,
          errors: [`Must match ${otherFieldName}`],
        };
      }
      return { valid: true, errors: [] };
    };
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class FormValidator {
  private fields: Map<string, FieldValidator[]> = new Map();
  private errorElements: Map<string, HTMLElement> = new Map();

  registerField(fieldName: string, errorElementId: string, ...validators: FieldValidator[]): void {
    this.fields.set(fieldName, validators);
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      this.errorElements.set(fieldName, errorEl);
    }
  }

  validateField(fieldName: string, value: string): ValidationResult {
    const validators = this.fields.get(fieldName);
    if (!validators) {
      return { valid: true, errors: [] };
    }

    const allErrors: string[] = [];
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        allErrors.push(...result.errors);
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  showError(fieldName: string, errors: string[]): void {
    const errorEl = this.errorElements.get(fieldName);
    const inputEl = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
    
    if (errorEl) {
      errorEl.textContent = errors[0] || '';
    }
    if (inputEl) {
      if (errors.length > 0) {
        inputEl.classList.add('input-error');
      } else {
        inputEl.classList.remove('input-error');
      }
    }
  }

  clearError(fieldName: string): void {
    this.showError(fieldName, []);
  }

  validateForm(formData: Map<string, string>): boolean {
    let isValid = true;

    for (const [fieldName] of this.fields) {
      const value = formData.get(fieldName) || '';
      const result = this.validateField(fieldName, value);
      this.showError(fieldName, result.errors);
      if (!result.valid) {
        isValid = false;
      }
    }

    return isValid;
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  (window as any).Validators = Validators;
  (window as any).FormValidator = FormValidator;
}
