import { Field, HStack } from '@chakra-ui/react';
import type { RegistrationFormData } from '../../types/form.types';
import { Radio, RadioGroup } from '../../components/ui/radio';

interface RadioGroupFieldProps {
  name: keyof RegistrationFormData;
  label: string;
  errors: any;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioGroupField = ({
  name,
  label,
  errors,
  options,
  value,
  onChange,
}: RadioGroupFieldProps) => {
  const error = errors[name];

  const handleChange = (details: { value: string | null }) => {
    if (details.value && onChange) {
      onChange(details.value);
    }
  };

  return (
    <Field.Root invalid={!!error} mb={6}>
      <Field.Label fontSize="sm" color="gray.600" mb={3}>
        {label}
      </Field.Label>
      <RadioGroup 
        value={value} 
        onValueChange={handleChange}
      >
        <HStack gap={8} justify="flex-end">
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              colorPalette="teal"
            >
              {option.label}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
      {error && (
        <Field.ErrorText color="red.500" fontSize="sm" mt={1}>
          {error.message}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};
