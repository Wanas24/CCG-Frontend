const shared = {
  "common": {
    "appName": "Construct Code Group",
    "loading": "Loading...",
    "submit": "Submit",
    "cancel": "Cancel",
    "back": "Back",
    "continue": "Continue",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "language": "Language",
    "english": "English",
    "arabic": "Arabic",
    "theme": "Theme",
    "darkMode": "Dark",
    "lightMode": "Light",
    "systemMode": "System",
    "menu": "Menu",
    "logout": "Logout",
    "unexpectedError": "Unexpected error",
    "networkError": "Unable to connect. Check your internet connection and try again.",
    "timeoutError": "The request timed out. Please try again.",
    "serverError": "Something went wrong on our side. Please try again later."
  },
  "validation": {
    "required": "This field is required",
    "email": "Enter a valid email address",
    "passwordMin": "Password must be at least 8 characters",
    "passwordMatch": "Passwords do not match",
    "passwordComplexity": "Password must include uppercase, lowercase, a number, and a symbol",
    "maxLength50": "Must be at most 50 characters",
    "maxLength200": "Must be at most 200 characters",
    "maxLength500": "Must be at most 500 characters",
    "maxLength1000": "Must be at most 1000 characters",
    "phoneInvalid": "Enter a valid Egyptian mobile number (e.g. +20 10XXXXXXXX)",
    "nationalIdLength": "National ID must be exactly 14 characters",
    "dateOfBirthPast": "Date of birth must be a past date",
    "imageType": "Upload a JPG or PNG image",
    "imageMaxSize": "Image must be 5 MB or smaller"
  },
  "upload": {
    "dragText": "Click or drag file to this area to upload",
    "dragHint": "Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files."
  }
} as const;

export default shared;
