import { Box, Typography } from '@mui/material';
import React from 'react';

const Footer = () => {
  return (
    <Box className='text-center mb-3'>
      <Typography className='text-sm'>
        Développé par{' '}
        <a
          href='https://twitter.com/Wonezer'
          target='_blank'
          rel='noreferrer'
          className='font-bold text-yellow-500'>
          Wone
        </a>{' '}
        🐵
      </Typography>
    </Box>
  );
};

export default Footer;
