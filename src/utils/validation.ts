export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export interface ProfileFormValues {
  displayName: string;
  contactEmail: string;
  jurisdiction: string;
}

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export interface PasswordStrength {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  isValid: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber,
  };
}

export function validateLoginForm(values: LoginFormValues): ValidationErrors<LoginFormValues> {
  const errors: ValidationErrors<LoginFormValues> = {};
  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}

export function validateRegisterForm(
  values: RegisterFormValues
): ValidationErrors<RegisterFormValues> {
  const errors: ValidationErrors<RegisterFormValues> = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  const strength = evaluatePasswordStrength(values.password);
  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (!strength.isValid) {
    errors.password =
      'Password must be at least 10 characters with uppercase, lowercase, and a number.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = 'You must acknowledge the platform security terms to continue.';
  }

  return errors;
}

export function validateProfileForm(
  values: ProfileFormValues
): ValidationErrors<ProfileFormValues> {
  const errors: ValidationErrors<ProfileFormValues> = {};
  if (!values.displayName.trim() || values.displayName.trim().length < 2) {
    errors.displayName = 'Display name must be at least 2 characters.';
  }
  if (!isValidEmail(values.contactEmail)) {
    errors.contactEmail = 'Enter a valid contact email address.';
  }
  if (!values.jurisdiction.trim()) {
    errors.jurisdiction = 'Select or enter a jurisdiction.';
  }
  return errors;
}

export function filterRecords<T extends object>(
  records: readonly T[],
  query: string,
  searchFields: readonly (keyof T)[],
  statusField?: keyof T,
  statusValue?: string
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  return records.filter((record) => {
    if (statusField && statusValue && statusValue !== 'all') {
      if (String(record[statusField]).toLowerCase() !== statusValue.toLowerCase()) {
        return false;
      }
    }
    if (!normalizedQuery) {
      return true;
    }
    return searchFields.some((field) =>
      String(record[field] ?? '')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  });
}
