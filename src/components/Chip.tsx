import { Typography } from '@mui/material';
import React from 'react';

const colorStatus = {
  light: 'bg-gradient-to-r from-green-500  to-green-300',
  medium: 'bg-gradient-to-r from-yellow-500  to-yellow-300',
  heavy: 'bg-gradient-to-r from-red-500  to-red-400',
  syndicate: 'bg-gradient-to-r from-violet-400  to-violet-300',
  marauders: 'bg-gradient-to-r from-green-500  to-green-300',
  covenant: 'bg-gradient-to-r from-yellow-500  to-yellow-300',
};

const cleanLabel = {
  light: 'Léger',
  medium: 'Moyen',
  heavy: 'Lourd',
  syndicate: 'Les Ombres',
  marauders: 'Les Maraudeurs',
  covenant: 'Les Engagés',
}

const Chip = ({ label, status }) => {
  return (
    <div className={`h-5 items-center px-3 rounded-xl ${colorStatus[status]}`}>
      <Typography className='text-[13px] font-semibold text-black leading-5'>
        {cleanLabel[status]}
      </Typography>
    </div>
  );
};

export default Chip;
