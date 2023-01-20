import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MapIcon from '@mui/icons-material/Map';
import { ButtonBase, Chip, IconButton, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const router = useRouter();

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const changeTo = router.locale === 'fr' ? 'en' : 'fr';

  const { t } = useTranslation('common');

  return (
    <Box sx={{ flexGrow: 1 }} className='m-5'>
      <AppBar position='static' className='rounded-md'>
        <Toolbar>
          <Link href='/' className='mr-3'>
            <Image src='/NW-logo.svg' alt='logo' width={30} height={30} />
          </Link>
          <Typography
            component='div'
            sx={{ flexGrow: 1 }}>
            New World GuildTool
            <Chip label='BETA' className='text-xs ml-2 font-bold text-yellow-400' size='small' />
          </Typography>
          <div className='flex mr-8'>
            <Link href='/' className='mr-4'>
              <Typography
                className={`text-[13px] uppercase font-bold ${
                  router.pathname === '/' ? 'text-yellow-400' : ''
                }`}>
                {t('common:players-list')}
              </Typography>
            </Link>
            <Link href='/stats'>
              <Typography
                className={`text-[13px] uppercase font-bold ${
                  router.pathname === '/stats' ? 'text-yellow-400' : ''
                }`}>
                {t('common:stats')}
              </Typography>
            </Link>
          </div>

          <Tooltip title={t('common:interactive_map')}>
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

          <Link href={router.pathname} locale={changeTo}>
            <Tooltip title={t('common:change-locale')}>
              <IconButton onClick={() => onToggleLanguageClick(changeTo)}>
                <Image
                  src={`/assets/${router.locale}.png`}
                  alt='logo'
                  width={20}
                  className='object-cover'
                  height={20}
                />
              </IconButton>
            </Tooltip>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
