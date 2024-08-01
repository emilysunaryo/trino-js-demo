import React from 'react';
import {FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent, Box} from '@mui/material'

interface SelectComponentProps {
    helperText: string;
    value: string;
    onChange: (event: SelectChangeEvent<string>) => void;
    options: {value: string; label:string}[];
}


function SelectComponent({ helperText, value, onChange, options}: SelectComponentProps) {
    return (
    <Box>
        <FormControl sx={{ width: 175, backgroundColor: '#fff', borderRadius: 3, color: 'gray'}}>
            <Select 
              sx = {{borderRadius: 3, color: 'gray'}}
               labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={value}  
                onChange = {onChange}>
                {options.map((option) => (
                    <MenuItem sx = {{color: 'gray'}}key={option.value} value={option.value}>
                     {option.label}
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
            <FormHelperText sx={{backgroundColor: '#f2f5f6'}}>
                {helperText}
            </FormHelperText>
        </Box>
    )
}


export default SelectComponent;