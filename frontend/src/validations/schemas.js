import * as Yup from 'yup';

// Login Schema
export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

// Register Schema
export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

// Agent Register Schema
export const agentRegisterSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  licenseNumber: Yup.string()
    .required('License number is required'),
  experience: Yup.number()
    .min(0, 'Experience must be a positive number')
    .required('Experience is required')
});

// Change Password Schema
export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required')
});

// Reset Password Link Schema
export const resetPasswordLinkSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
});

// Reset Password Schema
export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

// Verify Email Schema
export const verifyEmailSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, 'OTP must be exactly 6 digits')
    .required('OTP is required')
});

// Contact Us Schema
export const contactUsSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
    .required('Phone number is required'),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required')
});

// Form Validation Schemas for Document Forms
export const willDeedSchema = Yup.object({
  testator: Yup.object({
    name: Yup.string().required('Testator name is required'),
    fatherName: Yup.string().required('Father name is required'),
    address: Yup.string().required('Address is required'),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
      .required('Mobile is required'),
    aadhaar: Yup.string()
      .matches(/^[0-9]{12}$/, 'Aadhaar must be exactly 12 digits')
      .required('Aadhaar is required')
  }).required('Testator information is required'),
  beneficiaries: Yup.array()
    .of(Yup.object({
      name: Yup.string().required('Beneficiary name is required'),
      relationship: Yup.string().required('Relationship is required'),
      share: Yup.string().required('Share is required')
    }))
    .min(1, 'At least one beneficiary is required'),
  witnesses: Yup.array()
    .of(Yup.object({
      name: Yup.string().required('Witness name is required'),
      address: Yup.string().required('Witness address is required'),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
        .required('Witness mobile is required')
    }))
    .min(2, 'At least two witnesses are required')
});

export const saleDeedSchema = Yup.object({
  documentType: Yup.string().required('Document type is required'),
  propertyType: Yup.string().required('Property type is required'),
  salePrice: Yup.number()
    .min(0, 'Sale price must be positive')
    .required('Sale price is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
  tehsil: Yup.string().required('Tehsil is required'),
  village: Yup.string().required('Village is required')
});

export const trustDeedSchema = Yup.object({
  trustName: Yup.string().required('Trust name is required'),
  trustAddress: Yup.string().required('Trust address is required'),
  startingAmount: Yup.object({
    number: Yup.string().required('Starting amount is required'),
    words: Yup.string().required('Amount in words is required')
  }).required('Starting amount information is required'),
  trustees: Yup.array()
    .of(Yup.object({
      name: Yup.string().required('Trustee name is required'),
      address: Yup.string().required('Trustee address is required'),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
        .required('Trustee mobile is required')
    }))
    .min(1, 'At least one trustee is required')
});

export const propertyRegistrationSchema = Yup.object({
  seller_name: Yup.string().required('Seller name is required'),
  seller_father_name: Yup.string().required('Seller father name is required'),
  seller_address: Yup.string().required('Seller address is required'),
  seller_aadhaar: Yup.string()
    .matches(/^[0-9]{12}$/, 'Aadhaar must be exactly 12 digits')
    .required('Seller Aadhaar is required'),
  seller_mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
    .required('Seller mobile is required'),
  buyer_name: Yup.string().required('Buyer name is required'),
  buyer_father_name: Yup.string().required('Buyer father name is required'),
  buyer_address: Yup.string().required('Buyer address is required'),
  buyer_aadhaar: Yup.string()
    .matches(/^[0-9]{12}$/, 'Aadhaar must be exactly 12 digits')
    .required('Buyer Aadhaar is required'),
  buyer_mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
    .required('Buyer mobile is required'),
  property_address: Yup.string().required('Property address is required'),
  property_type: Yup.string().required('Property type is required'),
  area_sqm: Yup.string().required('Area is required'),
  sale_price: Yup.string().required('Sale price is required'),
  registration_date: Yup.date().required('Registration date is required')
});

export const adoptionDeedSchema = Yup.object({
  childName: Yup.string().required('Child name is required'),
  childDOB: Yup.date().required('Child date of birth is required'),
  childGender: Yup.string().required('Child gender is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
  tehsil: Yup.string().required('Tehsil is required'),
  firstParties: Yup.array()
    .of(Yup.object({
      name: Yup.string().required('Adopting party name is required'),
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
        .required('Mobile is required'),
      address: Yup.string().required('Address is required')
    }))
    .min(1, 'At least one adopting party is required'),
  witnesses: Yup.array()
    .of(Yup.object({
      name: Yup.string().required('Witness name is required'),
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
        .required('Witness mobile is required'),
      address: Yup.string().required('Witness address is required')
    }))
    .min(1, 'At least one witness is required')
});

export const powerOfAttorneySchema = Yup.object({
  executionDate: Yup.date().required('Execution date is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
  tehsil: Yup.string().required('Tehsil is required'),
  subRegistrarOffice: Yup.string().required('Sub Registrar office is required'),
  kartaParties: Yup.array()
    .of(Yup.object({
      name: Yup.string().required('Karta name is required'),
      fatherName: Yup.string().required('Father name is required'),
      address: Yup.string().required('Address is required'),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
        .required('Mobile is required')
    }))
    .min(1, 'At least one karta party is required'),
  agentParties: Yup.array()
    .of(Yup.object({
      name: Yup.string().required('Agent name is required'),
      fatherName: Yup.string().required('Father name is required'),
      address: Yup.string().required('Address is required'),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
        .required('Mobile is required')
    }))
    .min(1, 'At least one agent party is required')
});
