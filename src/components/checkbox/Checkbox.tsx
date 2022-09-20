import React, { useEffect, useState } from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface Props {
  text: string;
  checked: boolean;
  onChange: (newValue: boolean) => void;
  defaultValue?: boolean;
}
export const CheckboxWithText = ({
  text,
  checked,
  onChange,
  defaultValue,
}: Props) => {
  const [internalValue, setInternalValue] = useState<boolean>(
    defaultValue ?? checked ?? false
  );
  const handleChange = (newValue: boolean) => {
    onChange(newValue);
    setInternalValue(newValue);
  };

  useEffect(() => {
    setInternalValue(checked);
  }, [checked]);

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
