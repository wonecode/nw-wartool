import { Typography } from '@mui/material';
import React from 'react';

const colorStatus = {
  Léger: 'bg-gradient-to-r from-green-500  to-green-300',
  Moyen: 'bg-gradient-to-r from-yellow-500  to-yellow-300',
  Lourd: 'bg-gradient-to-r from-red-500  to-red-400',
};

const Chip = ({ label, status }) => {
  return (
    <div className={`h-5 items-center px-3 rounded-xl ${colorStatus[status]}`}>
      <Typography className='text-[13px] font-semibold text-black leading-5'>{label}</Typography>
    </div>
  );
};

export default Chip;
