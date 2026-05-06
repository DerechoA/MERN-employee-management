const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateField = (name, value, field) => {
  if (!field.required && (!value || value.trim() === '')) return '';

  switch (field.inputType) {
    case 'email':
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      break;
    case 'number':
      const num = Number(value);
      if (isNaN(num)) return 'Please enter a valid number';
      if (num < 0) return 'Value must be positive';
      break;
    default:
      if (field.required && (!value || value.trim().length === 0)) {
        return `${field.label} is required`;
      }
  }

  return '';
};

export const validateForm = (formFields, formData) => {
  const errors = {};
  let hasErrors = false;

  formFields.forEach((field) => {
    if (field.hidden) return;
    const error = validateField(field.name, formData[field.name] || '', field);
    if (error) {
      errors[field.name] = error;
      hasErrors = true;
    }
  });

  return { isValid: !hasErrors, errors };
};
