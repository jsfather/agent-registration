import { Box, Field, Input, Textarea, defineStyle, Spinner } from '@chakra-ui/react';
import type { UseFormRegister, UseFormClearErrors } from 'react-hook-form';
import type { RegistrationFormData } from '../../types/form.types';
import { useState, useEffect } from 'react';
import { useCheckAgencyCode } from '../../hooks/useCheckAgencyCode';
import { useDebounce } from '../../hooks/useDebounce';
import { toaster } from '../../components/ui/toaster';

interface FormFieldProps {
  name: keyof RegistrationFormData;
  label: string;
  register: UseFormRegister<RegistrationFormData>;
  errors: any;
  type?: 'text' | 'textarea';
  validateAgencyCode?: boolean;
  clearErrors?: UseFormClearErrors<RegistrationFormData>;
}

export const FormField = ({
  name,
  label,
  register,
  errors,
  type = 'text',
  validateAgencyCode = false,
  clearErrors,
}: FormFieldProps) => {
  const error = errors[name];
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const shouldFloat = value.length > 0 || focused;

  const { onChange, ...registerProps } = register(name);

  // Agency code validation
  const { mutate: checkAgencyCode, isPending, isError, error: apiError, isSuccess } = useCheckAgencyCode();
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (validateAgencyCode && debouncedValue && debouncedValue.length > 0) {
      checkAgencyCode(debouncedValue);
    }
  }, [debouncedValue, validateAgencyCode, checkAgencyCode]);

  // Show toast on error
  useEffect(() => {
    if (validateAgencyCode && isError && apiError?.message) {
      toaster.create({
        title: 'خطا',
        description: apiError.message,
        type: 'error',
        duration: 5000,
      });
    }
  }, [isError, apiError, validateAgencyCode]);

  // Show toast on success
  useEffect(() => {
    if (validateAgencyCode && isSuccess) {
      // Clear any form validation errors for this field
      if (clearErrors) {
        clearErrors(name);
      }
      toaster.create({
        title: 'موفق',
        description: 'کد نمایندگی معتبر است',
        type: 'success',
        duration: 3000,
      });
    }
  }, [isSuccess, validateAgencyCode, clearErrors, name]);

  const showError = error || (validateAgencyCode && isError);
  const errorMessage = error?.message || (isError && apiError?.message);

  return (
    <Field.Root invalid={!!showError} mb={4}>
      <Box pos="relative" w="full">
        {type === 'textarea' ? (
          <Textarea
            id={name}
            {...registerProps}
            onChange={(e) => {
              onChange(e);
              setValue(e.target.value);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: 'gray.400' }}
            _focus={{ borderColor: 'primary', boxShadow: '0 0 0 1px var(--primary)' }}
            rows={5}
            data-float={shouldFloat || undefined}
          />
        ) : (
          <Box pos="relative">
            <Input
              id={name}
              {...registerProps}
              onChange={(e) => {
                onChange(e);
                setValue(e.target.value);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              bg="white"
              borderColor={
                validateAgencyCode && isSuccess
                  ? 'green.500'
                  : showError
                  ? 'red.500'
                  : 'gray.300'
              }
              _hover={{ 
                borderColor: validateAgencyCode && isSuccess
                  ? 'green.600'
                  : showError
                  ? 'red.600'
                  : 'gray.400'
              }}
              _focus={{ 
                borderColor: validateAgencyCode && isSuccess
                  ? 'green.500'
                  : 'primary',
                boxShadow: validateAgencyCode && isSuccess
                  ? '0 0 0 1px var(--chakra-colors-green-500)'
                  : '0 0 0 1px var(--primary)'
              }}
              data-float={shouldFloat || undefined}
              paddingEnd={isPending && validateAgencyCode ? '10' : undefined}
            />
            {isPending && validateAgencyCode && (
              <Box
                pos="absolute"
                left="3"
                top="50%"
                transform="translateY(-50%)"
              >
                <Spinner size="sm" color="var(--primary)" />
              </Box>
            )}
          </Box>
        )}
        <Field.Label htmlFor={name} css={floatingStyles} data-float={shouldFloat || undefined}>
          {label}
        </Field.Label>
      </Box>
      {showError && (
        <Field.ErrorText color="red.500" fontSize="sm" mt={1}>
          {errorMessage}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

const floatingStyles = defineStyle({
  pos: "absolute",
  bg: "bg",
  px: "0.5",
  top: "2.5",
  insetStart: "3",
  fontWeight: "normal",
  pointerEvents: "none",
  transition: "position",
  color: "fg.muted",
  "&[data-float]": {
    top: "-3",
    insetStart: "2",
    color: "fg",
  },
});
