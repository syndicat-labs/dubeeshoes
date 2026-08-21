/**
 * Auth Module — Login and Register page logic
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AuthPage {
  private form: HTMLFormElement | null;
  private validator: any;

  constructor(formId: string) {
    this.form = document.getElementById(formId) as HTMLFormElement | null;
    this.validator = new (window as any).FormValidator();
    this.init();
  }

  private init(): void {
    if (!this.form) return;

    this.setupValidators();
    this.setupEventListeners();
  }

  private setupValidators(): void {
    const formId = this.form?.id;

    if (formId === 'loginForm') {
      this.validator.registerField(
        'email',
        'emailError',
        (window as any).Validators.required('Email'),
        (window as any).Validators.email()
      );
      this.validator.registerField(
        'password',
        'passwordError',
        (window as any).Validators.required('Password')
      );
    } else if (formId === 'registerForm') {
      this.validator.registerField(
        'fullName',
        'fullNameError',
        (window as any).Validators.required('Name')
      );
      this.validator.registerField(
        'email',
        'emailError',
        (window as any).Validators.required('Email'),
        (window as any).Validators.email()
      );
      this.validator.registerField(
        'password',
        'passwordError',
        (window as any).Validators.required('Password'),
        (window as any).Validators.minLength(8)
      );
      this.validator.registerField(
        'confirmPassword',
        'confirmPasswordError',
        (window as any).Validators.required('Password confirmation')
      );
    }
  }

  private setupEventListeners(): void {
    if (!this.form) return;

    // Real-time validation on blur
    this.form.querySelectorAll('input').forEach((input) => {
      input.addEventListener('blur', () => {
        this.validateSingleField(input.name, input.value);
      });

      input.addEventListener('input', () => {
        // Clear error on input
        this.validator.clearError(input.name);
      });
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  private validateSingleField(fieldName: string, value: string): void {
    // For confirmPassword, also validate it matches password
    if (fieldName === 'confirmPassword') {
      const passwordField = this.form?.querySelector('[name="password"]') as HTMLInputElement;
      if (passwordField) {
        const matchValidator = (window as any).Validators.matchesField(
          'password',
          passwordField.value
        );
        const result = matchValidator(value);
        this.validator.showError(fieldName, result.errors);
        return;
      }
    }

    const result = this.validator.validateField(fieldName, value);
    this.validator.showError(fieldName, result.errors);
  }

  private handleSubmit(): void {
    const formData = new Map<string, string>();
    
    if (this.form) {
      this.form.querySelectorAll('input').forEach((input) => {
        formData.set(input.name, input.value);
      });
    }

    // Validate all fields
    const isValid = this.validator.validateForm(formData);

    if (isValid) {
      // For demo purposes, show success
      this.showSuccess();
    }
  }

  private showSuccess(): void {
    const formId = this.form?.id;
    let message = 'Account created successfully!';
    
    if (formId === 'loginForm') {
      message = 'Welcome back!';
    }

    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'error-message';
    successDiv.style.backgroundColor = '#f0fdf4';
    successDiv.style.borderColor = 'var(--color-success)';
    successDiv.style.color = 'var(--color-success)';
    successDiv.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;

    // Insert at top of form
    this.form?.insertBefore(successDiv, this.form.firstChild);

    // Remove after 3 seconds
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    new AuthPage('loginForm');
  }
  if (registerForm) {
    new AuthPage('registerForm');
  }
});
