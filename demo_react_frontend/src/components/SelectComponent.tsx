import React from 'react';
import {FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material'

interface SelectComponentProps {
    helperText: string;
    value: string;
    onChange: (event: SelectChangeEvent<string>) => void;
    options: {value: string; label:string}[];
}


function SelectComponent({ helperText, value, onChange, options}: SelectComponentProps) {
    return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select 
               labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={value}  
                onChange = {onChange}>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                     {option.label}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}


export default SelectComponent;