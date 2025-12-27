function required(message = "This field is required") {
  return (value) => {
    if (!value && value !== 0 && value !== false) {
      return message;
    }
    return null;
  };
}
function email(message = "Invalid email address") {
  return (value) => {
    if (!value) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return message;
    return null;
  };
}
function minLength(min, message = `Minimum ${min} characters required`) {
  return (value) => {
    if (!value) return null;
    if (String(value).length < min) return message;
    return null;
  };
}
function maxLength(max, message = `Maximum ${max} characters allowed`) {
  return (value) => {
    if (!value) return null;
    if (String(value).length > max) return message;
    return null;
  };
}
function minValue(min, message = `Minimum value is ${min}`) {
  return (value) => {
    if (value === null || value === void 0 || value === "") return null;
    if (Number(value) < min) return message;
    return null;
  };
}
function maxValue(max, message = `Maximum value is ${max}`) {
  return (value) => {
    if (value === null || value === void 0 || value === "") return null;
    if (Number(value) > max) return message;
    return null;
  };
}
function pattern(regex, message = "Invalid format") {
  return (value) => {
    if (!value) return null;
    if (!regex.test(String(value))) return message;
    return null;
  };
}
function compose(...validators) {
  return async (value, formValues) => {
    for (const validator of validators) {
      const error = await Promise.resolve(validator(value, formValues));
      if (error) return error;
    }
    return null;
  };
}
function custom(fn, message = "Validation failed") {
  return (value) => {
    try {
      const result = fn(value);
      if (result === false) return message;
      if (typeof result === "string") return result;
      return null;
    } catch (err) {
      return message;
    }
  };
}
function asyncValidator(fn, message = "Validation failed") {
  return async (value) => {
    try {
      const result = await fn(value);
      if (result === false) return message;
      if (typeof result === "string") return result;
      return null;
    } catch (err) {
      console.error("Async validator error:", err);
      return message;
    }
  };
}
function when(condition, validator) {
  return (value, formValues) => {
    if (condition(formValues)) {
      return validator(value, formValues);
    }
    return null;
  };
}
function match(fieldName, message = "Fields do not match") {
  return (value, formValues) => {
    if (formValues && formValues[fieldName] !== value) {
      return message;
    }
    return null;
  };
}
function url(message = "Invalid URL") {
  return (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  };
}
function number(message = "Must be a number") {
  return (value) => {
    if (!value && value !== 0) return null;
    if (isNaN(Number(value))) return message;
    return null;
  };
}
function integer(message = "Must be an integer") {
  return (value) => {
    if (!value && value !== 0) return null;
    if (!Number.isInteger(Number(value))) return message;
    return null;
  };
}
function phone(message = "Invalid phone number") {
  return (value) => {
    if (!value) return null;
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) return message;
    return null;
  };
}
var validators_default = {
  required,
  email,
  minLength,
  maxLength,
  minValue,
  maxValue,
  pattern,
  compose,
  custom,
  asyncValidator,
  when,
  match,
  url,
  number,
  integer,
  phone
};

export { asyncValidator, compose, custom, validators_default as default, email, integer, match, maxLength, maxValue, minLength, minValue, number, pattern, phone, required, url, when };
//# sourceMappingURL=validators.js.map
//# sourceMappingURL=validators.js.map