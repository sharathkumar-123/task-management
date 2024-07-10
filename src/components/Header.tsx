import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {  useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  backNavigateUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ title, backNavigateUrl }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backNavigateUrl??'')
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {backNavigateUrl && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
