import { NativeSelect as ChakraNativeSelect } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const NativeSelectRoot = forwardRef<
  HTMLDivElement,
  ChakraNativeSelect.RootProps
>(function NativeSelectRoot(props, ref) {
  return (
    <ChakraNativeSelect.Root ref={ref} {...props}>
      {props.children}
      <ChakraNativeSelect.Indicator />
    </ChakraNativeSelect.Root>
  );
});

export const NativeSelectField = ChakraNativeSelect.Field;
