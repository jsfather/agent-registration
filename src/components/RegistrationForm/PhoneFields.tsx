import { Box, Grid, GridItem, Field, Input, defineStyle } from '@chakra-ui/react';
import type { UseFormRegister } from 'react-hook-form';
import type { RegistrationFormData } from '../../types/form.types';
import { useState } from 'react';

interface PhoneFieldsProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: any;
}

export const PhoneFields = ({ register, errors }: PhoneFieldsProps) => {
  const [cityCodeFocused, setCityCodeFocused] = useState(false);
  const [cityCodeValue, setCityCodeValue] = useState('');
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');

  const shouldFloatCityCode = cityCodeValue.length > 0 || cityCodeFocused;
  const shouldFloatPhone = phoneValue.length > 0 || phoneFocused;

  const phoneError = errors['phoneNumber'];

  const { onChange: onPhoneChange, ...registerProps } = register('phoneNumber');

  const handleCityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCityCodeValue(value);
    const fullPhone = value + phoneValue;
    onPhoneChange({ 
      ...e, 
      target: { 
        ...e.target, 
        name: 'phoneNumber',
        value: fullPhone 
      } 
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPhoneValue(value);
    const fullPhone = cityCodeValue + value;
    onPhoneChange({ 
      ...e, 
      target: { 
        ...e.target, 
        name: 'phoneNumber',
        value: fullPhone 
      } 
    });
  };

  return (
    <Box mb={4}>
      {/* Hidden input for React Hook Form registration */}
      <input type="hidden" {...registerProps} value={cityCodeValue + phoneValue} />
      
      <Grid templateColumns="1fr 2fr" gap={2}>
        <GridItem>
          <Field.Root invalid={!!phoneError}>
            <Box pos="relative" w="full">
              <Input
                value={cityCodeValue}
                onChange={handleCityCodeChange}
                onFocus={() => setCityCodeFocused(true)}
                onBlur={() => setCityCodeFocused(false)}
                bg="white"
                borderColor={phoneError ? 'red.500' : 'gray.300'}
                _hover={{ borderColor: phoneError ? 'red.600' : 'gray.400' }}
                _focus={{ borderColor: 'primary', boxShadow: '0 0 0 1px var(--primary)' }}
                data-float={shouldFloatCityCode || undefined}
                maxLength={3}
                inputMode="numeric"
              />
              <Field.Label css={floatingStyles} data-float={shouldFloatCityCode || undefined}>
                کد شهر
              </Field.Label>
            </Box>
          </Field.Root>
        </GridItem>
        <GridItem>
          <Field.Root invalid={!!phoneError}>
            <Box pos="relative" w="full">
              <Input
                value={phoneValue}
                onChange={handlePhoneChange}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                bg="white"
                borderColor={phoneError ? 'red.500' : 'gray.300'}
                _hover={{ borderColor: phoneError ? 'red.600' : 'gray.400' }}
                _focus={{ borderColor: 'primary', boxShadow: '0 0 0 1px var(--primary)' }}
                data-float={shouldFloatPhone || undefined}
                maxLength={8}
                inputMode="numeric"
              />
              <Field.Label css={floatingStyles} data-float={shouldFloatPhone || undefined}>
                شماره تلفن
              </Field.Label>
            </Box>
          </Field.Root>
        </GridItem>
      </Grid>
      {phoneError && (
        <Field.Root invalid={!!phoneError}>
          <Field.ErrorText color="red.500" fontSize="sm" mt={1}>
            {phoneError.message}
          </Field.ErrorText>
        </Field.Root>
      )}
    </Box>
  );
};

const floatingStyles = defineStyle({
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
