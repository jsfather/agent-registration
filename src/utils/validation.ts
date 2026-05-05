export const validationRules = {
  agentCode: {
    required: 'کد نمایندگی الزامی است',
    pattern: {
      value: /^[0-9]+$/,
      message: 'کد نمایندگی باید فقط شامل اعداد باشد',
    },
  },
  firstName: {
    required: 'نام الزامی است',
    minLength: {
      value: 2,
      message: 'نام باید حداقل ۲ کاراکتر باشد',
    },
  },
  lastName: {
    required: 'نام خانوادگی الزامی است',
    minLength: {
      value: 2,
      message: 'نام خانوادگی باید حداقل ۲ کاراکتر باشد',
    },
  },
  mobileNumber: {
    required: 'شماره موبایل الزامی است',
    pattern: {
      value: /^09[0-9]{9}$/,
      message: 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود',
    },
  },
  province: {
    required: 'انتخاب استان الزامی است',
  },
  city: {
    required: 'انتخاب شهر الزامی است',
  },
  address: {
    required: 'آدرس الزامی است',
    minLength: {
      value: 10,
      message: 'آدرس باید حداقل ۱۰ کاراکتر باشد',
    },
  },
  insuranceType: {
    required: 'انتخاب شعبه بیمه الزامی است',
  },
  phoneNumber: {
    required: 'تلفن ثابت الزامی است',
    minLength: {
      value: 11,
      message: 'تلفن ثابت باید ۱۱ رقم باشد (۳ رقم کد شهر + ۸ رقم شماره)',
    },
    maxLength: {
      value: 11,
      message: 'تلفن ثابت باید ۱۱ رقم باشد (۳ رقم کد شهر + ۸ رقم شماره)',
    },
  },
  representativeType: {
    required: 'انتخاب نوع نمایندگی الزامی است',
  },
  agencyName: {
    minLength: {
      value: 2,
      message: 'نام نمایندگی باید حداقل ۲ کاراکتر باشد',
    },
  },
};
