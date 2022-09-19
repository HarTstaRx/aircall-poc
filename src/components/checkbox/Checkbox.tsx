import React, { useState } from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface Props {
  text: string;
  onChange: (newValue: boolean) => void;
  defaultValue?: boolean;
}
export const CheckboxWithText = ({ text, onChange, defaultValue }: Props) => {
  const [internalValue, setInternalValue] = useState<boolean>(
    defaultValue ?? false
  );
  const handleChange = (newValue: boolean) => {
    onChange(newValue);
    setInternalValue(newValue);
  };
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={internalValue}
          onChange={(_evt, checked) => handleChange(checked)}
        />
      }
      label={text}
    />
  );
};
