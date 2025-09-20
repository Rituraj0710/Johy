import * as Yup from 'yup';

export const createTranslatedValidationSchema = (t) => {
  return {
    // Common validation rules
    required: (fieldName) => Yup.string().required(t('forms.validation.required')),
    email: () => Yup.string().email(t('forms.validation.email')),
    phone: () => Yup.string().matches(/^[0-9]{10}$/, t('forms.validation.phone')),
    number: () => Yup.string().matches(/^\d+$/, t('forms.validation.number')),
    
    // Trust Deed specific
    trustName: () => Yup.string()
      .required(t('forms.validation.required'))
      .max(100, t('forms.validation.maxLength', { count: 100 })),
    
    trustAddress: () => Yup.string()
      .required(t('forms.validation.required'))
      .max(500, t('forms.validation.maxLength', { count: 500 })),
    
    amount: () => Yup.string()
      .required(t('forms.validation.required'))
      .matches(/^\d+$/, t('forms.validation.number')),
    
    // Person details
    personName: () => Yup.string()
      .required(t('forms.validation.required'))
      .min(2, t('forms.validation.minLength', { count: 2 }))
      .max(100, t('forms.validation.maxLength', { count: 100 })),
    
    mobile: () => Yup.string()
      .required(t('forms.validation.required'))
      .matches(/^[0-9]{10}$/, t('forms.validation.phone')),
    
    address: () => Yup.string()
      .required(t('forms.validation.required'))
      .max(500, t('forms.validation.maxLength', { count: 500 })),
    
    idNumber: () => Yup.string()
      .required(t('forms.validation.required'))
      .min(5, t('forms.validation.minLength', { count: 5 }))
      .max(20, t('forms.validation.maxLength', { count: 20 }))
  };
};

export const createTrustDeedValidationSchema = (t) => {
  const validation = createTranslatedValidationSchema(t);
  
  return Yup.object({
    trustName: validation.trustName(),
    trustAddress: validation.trustAddress(),
    startingAmount_number: validation.amount(),
    startingAmount_words: validation.required('Amount in words'),
    trustees: Yup.array().of(
      Yup.object({
        name: validation.personName(),
        relation: validation.personName(),
        address: validation.address(),
        mobile: validation.mobile(),
        idNumber: validation.idNumber()
      })
    ).min(1, 'At least one trustee is required')
  });
};

export const createSaleDeedValidationSchema = (t) => {
  const validation = createTranslatedValidationSchema(t);
  
  return Yup.object({
    documentType: validation.required('Document type'),
    propertyType: validation.required('Property type'),
    salePrice: validation.amount(),
    circleRateAmount: validation.amount(),
    sellers: Yup.array().of(
      Yup.object({
        name: validation.personName(),
        address: validation.address(),
        mobile: validation.mobile(),
        idNo: validation.idNumber()
      })
    ).min(1, 'At least one seller is required'),
    buyers: Yup.array().of(
      Yup.object({
        name: validation.personName(),
        address: validation.address(),
        mobile: validation.mobile(),
        idNo: validation.idNumber()
      })
    ).min(1, 'At least one buyer is required')
  });
};
