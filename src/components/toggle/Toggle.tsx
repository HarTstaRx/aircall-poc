import React, { useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';

interface Props {
  text: string;
  onChange: (newValue: boolean) => void;
  defaultValue?: boolean;
}
export const ToggleWithText = ({ text, onChange, defaultValue }: Props) => {
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
        <Switch
          checked={internalValue}
          onChange={(_evt, checked) => handleChange(checked)}
        />
      }
      label={text}
    />
  );
};
