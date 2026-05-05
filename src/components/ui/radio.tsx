import { RadioGroup as ChakraRadioGroup } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const { children, inputProps, ...rest } = props;
    return (
      <ChakraRadioGroup.Item ref={ref} {...rest}>
        <ChakraRadioGroup.ItemHiddenInput {...inputProps} />
        <ChakraRadioGroup.ItemIndicator />
        {children && (
          <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
        )}
      </ChakraRadioGroup.Item>
    );
  }
);

export const RadioGroup = ChakraRadioGroup.Root;
