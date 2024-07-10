import { FC, useState } from "react";
import { InputAdornment, TextField, IconButton, TextFieldProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";



const SearchBox: FC<any> = ({ onClear, ...props }) => {
  const [showClearIcon, setShowClearIcon] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowClearIcon(event.target.value !== "");
    props.onChange && props.onChange(event);
  };

  const handleClear = (): void => {
    setShowClearIcon(false);
    props.onChange && props.onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    onClear && onClear();
  };

  return (
    <TextField
      {...props}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {showClearIcon && (
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBox;
