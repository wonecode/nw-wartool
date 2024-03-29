/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MapIcon from '@mui/icons-material/Map';
import {
  ButtonBase,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Rowdies } from '@next/font/google';
import LoginModal from '@/components/LoginModal';
import { supabase } from '../../supabase';
import { User } from '@supabase/gotrue-js';

const rowdies = Rowdies({
  subsets: ['latin'],
  weight: '700',
});

const Navbar = () => {
  const [openLoginModal, setOpenLoginModal] = React.useState(false);
  const [user, setUser] = React.useState<User | null>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const router = useRouter();

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const changeTo = router.locale === 'fr' ? 'en' : 'fr';

  const { t } = useTranslation('common');

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    getUser();
  }, []);

  const usersAllowed = [
    'wonezer',
    'alendal',
    'golushi',
    'a7flnc',
    'cata9057',
    'tibouni',
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="m-5">
        <AppBar position="static" className="rounded-md bg-transparent">
          <Toolbar className="flex items-center justify-between">
            <Link href="/" className="mr-2 flex items-center gap-2">
              <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
              <Typography
                component="div"
                sx={{ flexGrow: 1 }}
                className={`${rowdies.className} uppercase font-black flex items-center bg-gradient-to-r bg-clip-text  text-transparent  text-xl
            from-yellow-500 via-amber-300 to-yellow-400`}
              >
                GuildTool
                <Chip
                  label="v1.0"
                  className="text-[10px] ml-2 font-bold"
                  size="small"
                />
              </Typography>
            </Link>
            <div className="flex items-center">
              <div className="flex mr-8">
                <Link href="/" className="mr-4">
                  <Typography
                    className={`text-[13px] uppercase font-bold ${
                      router.pathname === '/' ? 'text-yellow-400' : ''
                    }`}
                  >
                    {t('common:players-list')}
                  </Typography>
                </Link>
                <div className="group inline-block relative z-50">
                  <Link href="/stats/weapons">
                    <Typography
                      className={`text-[13px] uppercase font-bold flex ${
                        router.pathname.includes('/stats')
                          ? 'text-yellow-400'
                          : ''
                      }`}
                    >
                      {t('common:stats')}
                      <svg
                        className="fill-current h-4 w-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </Typography>
                  </Link>
                  <ul className="absolute shadow-xl hidden text-gray-200 pt-4 group-hover:block w-80 right-0">
                    <div className="p-2 bg-[#222222] rounded-md border-[#737373] border-[1px]">
                      <li className="">
                        <Link
                          className="rounded-md hover:bg-[#3a3a3a] transition duration-300 ease-in-out py-3 px-4 whitespace-no-wrap flex items-center"
                          href="/stats/weapons"
                        >
                          <Icon
                            icon="ri:sword-line"
                            className="mr-5 text-[#3498db]"
                            height={25}
                            width={25}
                          />
                          <div>
                            <Typography className="text-xs uppercase font-bold">
                              Armes & classes
                            </Typography>
                            <span className="text-[12.5px]">
                              Statistiques générales par guilde
                            </span>
                          </div>
                        </Link>
                      </li>
                      <li className="">
                        <button className="rounded-md text-gray-500 duration-300 py-3 px-4 whitespace-no-wrap flex items-center cursor-not-allowed">
                          <Icon
                            icon="ic:outline-person-2"
                            height={25}
                            width={25}
                            className="mr-5"
                          />
                          <div className="flex flex-col items-start gap-1">
                            <Typography className="text-xs uppercase font-bold">
                              Joueurs
                            </Typography>
                            <span className="text-[12.5px]">
                              Statistiques individuelles en guerre
                            </span>
                          </div>
                        </button>
                      </li>
                    </div>
                  </ul>
                </div>
                {user &&
                  usersAllowed.includes(user.user_metadata.full_name) && (
                    <Link href="/staff" className="ml-4">
                      <Typography
                        className={`text-[13px] uppercase font-bold ${
                          router.pathname === '/staff' ? 'text-yellow-400' : ''
                        }`}
                      >
                        Staff
                      </Typography>
                    </Link>
                  )}
              </div>

              <Tooltip title={t('common:interactive_map')}>
                <a
                  href="https://raidplan.io/plan/create?raid=nw.war"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton color="inherit">
                    <MapIcon />
                  </IconButton>
                </a>
              </Tooltip>
              <Tooltip title="New World Database">
                <a
                  href="https://nwdb.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton color="inherit">
                    <Icon icon="mdi:database" width={22} height={22} />
                  </IconButton>
                </a>
              </Tooltip>
              <Link href={router.pathname} locale={changeTo} className="mr-8">
                <Tooltip title={t('common:change-locale')}>
                  <IconButton onClick={() => onToggleLanguageClick(changeTo)}>
                    <Image
                      src={`/assets/${router.locale}.png`}
                      alt="logo"
                      width={20}
                      className="object-cover"
                      height={20}
                    />
                  </IconButton>
                </Tooltip>
              </Link>

              {user ? (
                <>
                  <ButtonBase onClick={handleProfileMenuOpen}>
                    <Typography className="text-xs uppercase font-bold mr-2">
                      {user.user_metadata.full_name}
                    </Typography>
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="logo"
                      width={25}
                      className="object-cover rounded-full"
                      height={25}
                    />
                  </ButtonBase>

                  <Menu
                    className="top-2"
                    anchorEl={anchorEl}
                    keepMounted
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                  >
                    <MenuItem className="text-sm" onClick={logOut}>
                      Déconnexion
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <ButtonBase onClick={() => setOpenLoginModal(true)}>
                  <Typography className={`text-[13px] uppercase font-bold`}>
                    Connexion
                  </Typography>
                </ButtonBase>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </Box>

      <LoginModal
        isOpen={openLoginModal}
        handleClose={() => setOpenLoginModal(false)}
      />
    </>
  );
};

export default Navbar;
