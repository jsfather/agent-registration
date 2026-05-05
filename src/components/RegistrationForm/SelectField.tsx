import { Box, Field, defineStyle, Spinner } from '@chakra-ui/react';
import type { UseFormRegister } from 'react-hook-form';
import type { RegistrationFormData } from '../../types/form.types';
import { NativeSelectRoot, NativeSelectField } from '../../components/ui/native-select';
import { useState } from 'react';

interface SelectFieldProps {
  name: keyof RegistrationFormData;
  label: string;
  register: UseFormRegister<RegistrationFormData>;
  errors: any;
  options: Array<{ id: number | string; name: string }>;
  disabled?: boolean;
  isLoading?: boolean;
}

export const SelectField = ({
  name,
  label,
  register,
  errors,
  options,
  disabled = false,
  isLoading = false,
}: SelectFieldProps) => {
  const error = errors[name];
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const shouldFloat = value.length > 0 || focused;

  const { onChange, onBlur, ...registerProps } = register(name);

  const isDisabled = disabled || isLoading;

  return (
    <Field.Root invalid={!!error} mb={4}>
      <Box pos="relative" w="full">
        <NativeSelectRoot disabled={isDisabled}>
          <NativeSelectField
            id={name}
            {...registerProps}
            onChange={(e) => {
              onChange(e);
              setValue(e.target.value);
            }}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              onBlur(e);
              setFocused(false);
            }}
            bg="white"
            borderColor="gray.300"
            _hover={{ borderColor: isDisabled ? 'gray.300' : 'gray.400' }}
            _focus={{ borderColor: 'primary', boxShadow: '0 0 0 1px var(--primary)' }}
            data-float={shouldFloat || undefined}
            opacity={isDisabled ? 0.6 : 1}
            cursor={isDisabled ? 'not-allowed' : 'pointer'}
            value={value}
          >
            <option value="" disabled hidden>
              {''}
            </option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
        {isLoading && (
          <Box
            pos="absolute"
            left="10"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
          >
            <Spinner size="sm" color="var(--primary)" />
          </Box>
        )}
        <Field.Label 
          htmlFor={name} 
          css={floatingStyles} 
          data-float={shouldFloat || undefined}
          pointerEvents="none"
        >
          {label}
        </Field.Label>
      </Box>
      {error && (
        <Field.ErrorText color="red.500" fontSize="sm" mt={1}>
          {error.message}
        </Field.ErrorText>
      )}
    </Field.Root>
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
