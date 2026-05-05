import { Box, Field, Input, defineStyle, Spinner } from '@chakra-ui/react';
import type { UseFormRegister } from 'react-hook-form';
import type { RegistrationFormData } from '../../types/form.types';
import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchableFieldProps {
  name: keyof RegistrationFormData;
  label: string;
  register: UseFormRegister<RegistrationFormData>;
  errors: any;
  options: Array<{ id: number | string; name: string }>;
  isLoading?: boolean;
  onSearchChange?: (value: string) => void;
}

export const SearchableField = ({
  name,
  label,
  register,
  errors,
  options,
  isLoading = false,
  onSearchChange,
}: SearchableFieldProps) => {
  const error = errors[name];
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const shouldFloat = value.length > 0 || focused;

  const { onChange, ...registerProps } = register(name);
  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    if (onSearchChange && debouncedSearch) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange]);

  const handleSelectOption = (option: { id: number | string; name: string }) => {
    setValue(option.name);
    setSearchValue(option.name);
    setShowDropdown(false);
    // Trigger onChange with the option id
    const event = {
      target: { value: option.id.toString(), name },
    } as any;
    onChange(event);
  };

  return (
    <Field.Root invalid={!!error} mb={4}>
      <Box pos="relative" w="full">
        <Box pos="relative">
          <Input
            id={name}
            {...registerProps}
            value={searchValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchValue(newValue);
              setValue(newValue);
              setShowDropdown(true);
              onChange(e);
            }}
            onFocus={() => {
              setFocused(true);
              setShowDropdown(true);
            }}
            onBlur={() => {
              setFocused(false);
              // Delay to allow click on dropdown
              setTimeout(() => setShowDropdown(false), 200);
            }}
            bg="gray.50"
            borderColor="gray.300"
            _hover={{ borderColor: 'gray.400' }}
            _focus={{ borderColor: 'primary', boxShadow: '0 0 0 1px var(--primary)' }}
            data-float={shouldFloat || undefined}
            paddingEnd={isLoading ? '10' : undefined}
            autoComplete="off"
          />
          {isLoading && (
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
        <Field.Label htmlFor={name} css={floatingStyles} data-float={shouldFloat || undefined}>
          {label}
        </Field.Label>
        
        {showDropdown && options.length > 0 && (
          <Box
            pos="absolute"
            top="100%"
            left="0"
            right="0"
            mt="1"
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            maxH="200px"
            overflowY="auto"
            zIndex="10"
            boxShadow="md"
          >
            {options.map((option) => (
              <Box
                key={option.id}
                px="4"
                py="2"
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
                onClick={() => handleSelectOption(option)}
              >
                {option.name}
              </Box>
            ))}
          </Box>
        )}
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
