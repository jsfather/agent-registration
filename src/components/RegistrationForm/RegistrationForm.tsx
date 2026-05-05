import { Box, Button, VStack, Field, Input, defineStyle } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useMemo } from 'react';
import type { RegistrationFormData, SignupRequest } from '../../types/form.types';
import { FormHeader } from './FormHeader';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { SearchableField } from './SearchableField';
import { PhoneFields } from './PhoneFields';
import { RadioGroupField } from './RadioGroupField';
import { useProvinces } from '../../hooks/useProvinces';
import { useCounties } from '../../hooks/useCounties';
import { useInsuranceBranches } from '../../hooks/useInsuranceBranches';
import { useSignup } from '../../hooks/useSignup';
import { toaster } from '../../components/ui/toaster';
import { validationRules } from '../../utils/validation';

export const RegistrationForm = () => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [insuranceBranchSearch, setInsuranceBranchSearch] = useState<string>('');
  const [showAgencyName, setShowAgencyName] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      representativeType: 'real',
    },
  });

  const watchProvince = watch('province');
  const watchRepType = watch('representativeType');
  
  // Memoize to prevent unnecessary re-renders
  const representativeType = useMemo(() => {
    return watchRepType || 'real';
  }, [watchRepType]);

  // Update showAgencyName based on representativeType
  useEffect(() => {
    setShowAgencyName(representativeType === 'legal');
  }, [representativeType]);

  // Memoize agency name validation rules
  const agencyNameValidation = useMemo(() => ({
    required: showAgencyName ? 'نام نمایندگی الزامی است' : false,
    minLength: {
      value: 2,
      message: 'نام نمایندگی باید حداقل ۲ کاراکتر باشد',
    },
  }), [showAgencyName]);

  // Fetch data using React Query
  const { data: provinces = [], isLoading: isLoadingProvinces } = useProvinces();
  const { data: counties = [], isLoading: isLoadingCounties } = useCounties(selectedProvinceId);
  const { data: insuranceBranches = [], isLoading: isLoadingBranches } = useInsuranceBranches(
    selectedProvinceId,
    insuranceBranchSearch
  );

  const { mutate: signup, isPending: isSubmitting } = useSignup();

  // Update selected province when it changes - using useEffect to avoid state update during render
  useEffect(() => {
    if (watchProvince && Number(watchProvince) !== selectedProvinceId) {
      setSelectedProvinceId(Number(watchProvince));
    }
  }, [watchProvince, selectedProvinceId]);

  const onSubmit = (data: RegistrationFormData) => {
    // Validate required fields
    if (!data.phoneNumber || data.phoneNumber.length < 11) {
      toaster.create({
        title: 'خطا',
        description: 'لطفا تلفن ثابت را به طور کامل وارد کنید',
        type: 'error',
        duration: 5000,
      });
      return;
    }

    // Extract city code and phone from phoneNumber
    const fullPhone = data.phoneNumber;
    const cityCode = fullPhone.slice(0, 3);
    const phone = fullPhone.slice(3);

    // Prepare signup request
    const signupData: SignupRequest = {
      agent_code: data.agentCode,
      province: data.province,
      county: data.city,
      address: data.address,
      insurance_branch: data.insuranceType,
      phone: phone,
      city_code: cityCode,
      agency_type: data.representativeType,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.mobileNumber,
      ...(data.representativeType === 'legal' && data.agencyName && { name: data.agencyName }),
    };

    signup(signupData, {
      onSuccess: (response) => {
        toaster.create({
          title: 'موفق',
          description: 'ثبت نام با موفقیت انجام شد',
          type: 'success',
          duration: 5000,
        });
        console.log('Access token:', response.response.access);
      },
      onError: (error: any) => {
        toaster.create({
          title: 'خطا',
          description: error.message || 'خطا در ثبت نام',
          type: 'error',
          duration: 5000,
        });
      },
    });
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #008e9c 0%, #00a8b8 100%)"
      py={8}
      px={4}
    >
      <Box
        maxW="500px"
        mx="auto"
        bg="white"
        borderRadius="2xl"
        p={8}
        boxShadow="xl"
      >
        <FormHeader />

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={0} align="stretch">
            <FormField
              name="agentCode"
              label="کد نمایندگی"
              register={(name) => register(name, validationRules.agentCode)}
              errors={errors}
              validateAgencyCode={true}
              clearErrors={clearErrors}
            />

            <FormField
              name="firstName"
              label="نام"
              register={(name) => register(name, validationRules.firstName)}
              errors={errors}
            />

            <FormField
              name="lastName"
              label="نام خانوادگی"
              register={(name) => register(name, validationRules.lastName)}
              errors={errors}
            />

            <FormField
              name="mobileNumber"
              label="شماره موبایل"
              register={(name) => register(name, validationRules.mobileNumber)}
              errors={errors}
            />

            <SelectField
              name="province"
              label="استان"
              register={(name) => register(name, validationRules.province)}
              errors={errors}
              options={provinces}
              isLoading={isLoadingProvinces}
            />

            <SelectField
              name="city"
              label="شهر"
              register={(name) => register(name, validationRules.city)}
              errors={errors}
              options={counties}
              disabled={!selectedProvinceId}
              isLoading={isLoadingCounties}
            />

            <FormField
              name="address"
              label="آدرس"
              register={(name) => register(name, validationRules.address)}
              errors={errors}
              type="textarea"
            />

            <SearchableField
              name="insuranceType"
              label="شعبه بیمه"
              register={(name) => register(name, validationRules.insuranceType)}
              errors={errors}
              options={insuranceBranches}
              isLoading={isLoadingBranches}
              onSearchChange={setInsuranceBranchSearch}
            />

            <PhoneFields 
              register={(name) => register(name, validationRules.phoneNumber)} 
              errors={errors} 
            />

            <Controller
              name="representativeType"
              control={control}
              defaultValue="real"
              render={({ field }) => (
                <RadioGroupField
                  name="representativeType"
                  label="نوع نمایندگی"
                  errors={errors}
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: 'real', label: 'حقیقی' },
                    { value: 'legal', label: 'حقوقی' },
                  ]}
                />
              )}
            />

            {showAgencyName && (
              <Controller
                name="agencyName"
                control={control}
                rules={agencyNameValidation}
                defaultValue=""
                render={({ field }) => (
                  <Field.Root invalid={!!errors.agencyName} mb={4}>
                    <Box pos="relative" w="full">
                      <Input
                        {...field}
                        value={field.value || ''}
                        bg="white"
                        borderColor={errors.agencyName ? 'red.500' : 'gray.300'}
                        _hover={{ borderColor: errors.agencyName ? 'red.600' : 'gray.400' }}
                        _focus={{ borderColor: 'primary', boxShadow: '0 0 0 1px var(--primary)' }}
                        data-float={field.value ? true : undefined}
                      />
                      <Field.Label 
                        htmlFor="agencyName" 
                        css={floatingLabelStyles} 
                        data-float={field.value ? true : undefined}
                      >
                        نام نمایندگی
                      </Field.Label>
                    </Box>
                    {errors.agencyName && (
                      <Field.ErrorText color="red.500" fontSize="sm" mt={1}>
                        {errors.agencyName.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>
                )}
              />
            )}

            <Button
              type="submit"
              w="full"
              bg="var(--primary)"
              color="white"
              size="lg"
              borderRadius="xl"
              _hover={{ bg: '#007a87' }}
              _active={{ bg: '#006b77' }}
              mt={4}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال ثبت نام...' : 'ثبت نام'}
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

const floatingLabelStyles = defineStyle({
  pos: "absolute",
  bg: "white",
  px: "0.5",
  top: "2.5",
  insetStart: "3",
  fontWeight: "normal",
  pointerEvents: "none",
  transition: "all 0.2s",
  color: "fg.muted",
  fontSize: "md",
  "&[data-float]": {
    top: "-3",
    insetStart: "2",
    fontSize: "sm",
    color: "fg",
  },
});
