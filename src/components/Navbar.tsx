import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import MapIcon from '@mui/icons-material/Map';
import { Chip, IconButton, Tooltip } from '@mui/material';

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }} className='m-5'>
      <AppBar position='static' className='rounded-md'>
        <Toolbar>
          <Link href='/' className='mr-3'>
            <Image src='/NW-logo.svg' alt='logo' width={30} height={30} />
          </Link>
          <Typography className='font-light' component='div' sx={{ flexGrow: 1 }}>
            New World Wartool
            <Chip label='BETA' className='text-xs ml-2 font-bold' size='small' />
          </Typography>
          <Tooltip title='Liste des joueurs'>
            <IconButton color='inherit'>
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Map intéractive'>
            <a
              href='https://raidplan.io/plan/create?raid=nw.war'
              target='_blank'
              rel='noopener noreferrer'>
              <IconButton color='inherit'>
                <MapIcon />
              </IconButton>
            </a>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
