import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation(['common']);

  return (
    <Box className='text-center mb-3'>
      <Typography className='text-sm'>
        {t('common:footer')}{' '}
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
