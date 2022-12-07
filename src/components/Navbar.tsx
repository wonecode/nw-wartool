import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import MapIcon from '@mui/icons-material/Map';
import { ButtonBase, Chip, IconButton, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }} className='m-5'>
      <AppBar position='static' className='rounded-md'>
        <Toolbar>
          <Link href='/' className='mr-3'>
            <Image src='/NW-logo.svg' alt='logo' width={30} height={30} />
          </Link>
          <Typography className='font-light' component='div' sx={{ flexGrow: 1 }}>
            New World GuildTool
            <Chip label='BETA' className='text-xs ml-2 font-bold' size='small' />
          </Typography>
          <div className='flex mr-8'>
            <Link href='/' className='mr-4'>
              <Typography className='text-[13px] font-bold uppercase'>War players</Typography>
            </Link>
            <ButtonBase disabled>
              <Link href='/crafters'>
                <Typography className='text-[13px] font-bold uppercase text-[#5b5b5b]'>
                  Crafters
                </Typography>
              </Link>
            </ButtonBase>
          </div>

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
          <Tooltip title='New World Database'>
            <a href='https://nwdb.info/' target='_blank' rel='noopener noreferrer'>
              <IconButton color='inherit'>
                <Icon icon='mdi:database' width={22} height={22} />
              </IconButton>
            </a>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
