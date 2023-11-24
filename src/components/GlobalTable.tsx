import React, { useEffect, useState } from 'react';
import { DataGrid, enUS, frFR, GridColDef } from '@mui/x-data-grid';
import { Box, ButtonBase, InputBase, Tooltip, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Chip from './Chip';
import Footer from './Footer';
import { supabase } from 'supabase';
import { enWeaponsLabels, frWeaponsLabels } from 'utils/weapons';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { enHeartruneLabels, frHeartruneLabels } from '../../utils/heartrunes';
import ManageBuildsModal from '@/components/ManageBuildsModal';
import ManageUserSettings from '@/components/ManageUserSettings';
import Image from 'next/image';

const factionColors = {
  syndicate: 'bg-violet-500',
  marauders: 'bg-green-600',
  covenant: 'bg-yellow-500',
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '270px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

const copyDiscord = async (username: string) => {
  try {
    await navigator.clipboard.writeText(username);

    toast.success('Copié dans le presse papier', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      style: {
        fontFamily: 'Montserrat',
        fontSize: '0.8rem',
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export default function DataTable() {
  const [buildsModalOpen, setBuildsModalOpen] = useState(false);
  const [userInfoModalOpen, setUserInfoModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [inputText, setInputText] = useState('');
  const [fetchClicked, setFetchClicked] = useState(false);
  const [uniquePlayersCount, setUniquePlayersCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isPlayerRegistered, setIsPlayerRegistered] = useState(false);

  const { t } = useTranslation(['common', 'global-table']);
  const router = useRouter();

  const handleRefresh = () => {
    setFetchClicked(true);

    fetchPlayers();

    setTimeout(() => {
      setFetchClicked(false);
    }, 5000);
  };

  const columns: GridColDef[] = [
    {
      field: 'ig_username',
      headerName: t('global-table:ig_username'),
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-2">
            {params.row.player.avatar_url && (
              <Image
                src={params.row.player.avatar_url}
                alt="avatar"
                width={22}
                className="object-cover rounded-full"
                height={22}
              />
            )}
            <Typography className={`text-sm font-medium`}>
              {params.row.player.ig_username}
            </Typography>
          </div>
        );
      },
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'gearscore',
      headerName: 'Gearscore PVP',
      type: 'number',
      align: 'left',
      width: 140,
      renderCell(params) {
        const gs = params.value;
        let renderGS: JSX.Element;

        if (gs <= 640) {
          return (
            <Typography className="text-sm font-semibold text-pink-500">
              {gs}
            </Typography>
          );
        } else if (gs <= 655) {
          return (
            <Typography className="text-sm font-semibold text-green-500">
              {gs}
            </Typography>
          );
        } else if (gs <= 690) {
          return (
            <Typography className="text-sm font-semibold text-purple-500">
              {gs}
            </Typography>
          );
        } else if (gs < 695) {
          return (
            <Typography className="text-sm font-semibold text-cyan-500">
              {gs}
            </Typography>
          );
        } else if (gs >= 695) {
          return (
            <Typography
              className="text-sm font-semibold bg-gradient-to-r bg-clip-text  text-transparent 
            from-orange-500 via-amber-300 to-orange-500 animate-text"
            >
              {gs}
            </Typography>
          );
        } else if (gs <= 625) {
          return (
            <Typography className="text-sm font-semibold text-red-500">
              {gs}
            </Typography>
          );
        }

        return renderGS;
      },
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'class_type',
      headerName: t('global-table:class_type'),
      width: 140,
      renderCell: (params) => (
        <Chip
          locale={router.locale}
          label={params.value}
          status={params.value}
        />
      ),
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'first_weapon',
      headerName: t('global-table:first_weapon'),
      width: 180,
      renderCell: (params) => (
        <Box display="flex items-center">
          <Icon
            icon={
              router.locale === 'fr'
                ? frWeaponsLabels[params.value].icon
                : enWeaponsLabels[params.value].icon
            }
            width={18}
            height={18}
            className="mr-2"
          />
          <Typography className="text-sm">
            {router.locale === 'fr'
              ? frWeaponsLabels[params.value].label
              : enWeaponsLabels[params.value].label}
          </Typography>
        </Box>
      ),
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'second_weapon',
      headerName: t('global-table:second_weapon'),
      width: 180,
      renderCell: (params) => (
        <Box display="flex items-center">
          <Icon
            icon={
              router.locale === 'fr'
                ? frWeaponsLabels[params.value].icon
                : enWeaponsLabels[params.value].icon
            }
            width={18}
            height={18}
            className="mr-2"
          />
          <Typography className="text-sm">
            {router.locale === 'fr'
              ? frWeaponsLabels[params.value].label
              : enWeaponsLabels[params.value].label}
          </Typography>
        </Box>
      ),
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'heartrune',
      headerName: t('global-table:heartrune'),
      width: 180,
      renderCell: (params) => (
        <Box display="flex items-center">
          <Icon
            icon={
              router.locale === 'fr'
                ? frHeartruneLabels[params.value]?.icon
                : enHeartruneLabels[params.value]?.icon
            }
            width={18}
            height={18}
            className="mr-2"
          />
          <Typography className="text-sm">
            {router.locale === 'fr'
              ? frHeartruneLabels[params.value]?.label
              : enHeartruneLabels[params.value]?.label}
          </Typography>
        </Box>
      ),
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'stuff',
      headerName: 'Stuff',
      width: 140,
      renderCell: (params) => (
        <Chip
          locale={router.locale}
          status={params.value}
          label={params.value}
        />
      ),
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'guild',
      headerName: t('global-table:guild'),
      width: 200,
      renderCell: (params) => {
        if (params.row.player.guild === null) {
          return <Typography className="text-sm">-</Typography>;
        }
        return (
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full h-3 w-3 ${
                factionColors[params.row.player.guild.faction]
              }`}
            />
            <Typography className="text-sm">
              {params.row.player.guild.name}
            </Typography>
          </div>
        );
      },
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
    {
      field: 'discord',
      headerName: 'Discord',
      width: 200,
      renderCell: (params) => (
        <ButtonBase
          className="flex items-center cursor-pointer bg-[#5865F2]/70 hover:bg-[#5865F2]/90 py-1 px-2 rounded-full text-ellipsis"
          onClick={() => {
            copyDiscord(params.row.player.discord);
          }}
        >
          <Icon
            icon="ic:baseline-discord"
            className="mr-1"
            height={17}
            width={17}
          />
          <Typography className="text-[11px]">
            {params.row.player.discord}
          </Typography>
        </ButtonBase>
      ),
      renderHeader: (params) => (
        <Typography className="text-sm font-bold">
          {params.colDef.headerName}
        </Typography>
      ),
    },
  ];

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('builds')
      .select(
        'id, class_type, first_weapon, second_weapon, heartrune, stuff, player:player_id(id, ig_username, discord, avatar_url, guild:guild_id(id, name, faction)), gearscore'
      );

    if (error) {
      console.log(error);
    } else {
      const sortedData = data.sort((a, b) => {
        // @ts-ignore
        return (
          // @ts-ignore
          a.player.ig_username
            .toLowerCase()
            // @ts-ignore
            .localeCompare(b.player.ig_username.toLowerCase())
        );
      });

      setRows(sortedData);

      let uniquePlayers = [];

      sortedData.forEach((row) => {
        // @ts-ignore
        const { ig_username } = row.player;

        if (!uniquePlayers.includes(ig_username)) {
          uniquePlayers.push(ig_username);
        }
      });

      setUniquePlayersCount(uniquePlayers.length);
    }
  };

  useEffect(() => {
    fetchPlayers();
    getUser();
  }, [isPlayerRegistered]);

  useEffect(() => {
    if (user) {
      getPlayerRegistered();
    }
  }, [user]);

  const inputHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const getPlayerRegistered = async () => {
    const { data } = await supabase
      .from('players_duplicate')
      .select('id, ig_username, discord')
      .eq('auth_id', user.id);

    if (data.length > 0) {
      setIsPlayerRegistered(true);
    }
  };

  return (
    <>
      <ManageBuildsModal
        handleClose={() => setBuildsModalOpen(false)}
        isOpen={buildsModalOpen}
        user={user}
        rows={rows}
        handleRows={(values) => setRows(values)}
      />

      <ManageUserSettings
        isOpen={userInfoModalOpen}
        handleClose={() => setUserInfoModalOpen(false)}
        user={user}
        rows={rows}
        handleRows={(values) => setRows(values)}
        handlePlayerRegistered={() => setIsPlayerRegistered(true)}
      />

      <div className="m-5" style={{ height: '76vh' }}>
        <div className="flex items-center mb-5 justify-between">
          <div className="flex items-center">
            <Typography className={`uppercase font-black text-2xl mr-5`}>
              {t('common:players-list')}
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon className="w-5" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t('global-table:find-player')}
                inputProps={{ 'aria-label': 'search' }}
                onChange={inputHandler}
                className="text-sm"
              />
            </Search>
            <Tooltip title="Rafraîchir">
              <ButtonBase
                disabled={fetchClicked}
                onClick={() => handleRefresh()}
                className={`font-bold text-sm px-4 py-[8px] rounded ml-2 hover:bg-[#454545] ${
                  fetchClicked
                    ? 'bg-[#353535]/70 text-green-500'
                    : 'bg-[#353535] text-white'
                }`}
              >
                {fetchClicked ? (
                  <Icon height={20} width={20} icon="material-symbols:check" />
                ) : (
                  <Icon
                    height={20}
                    width={20}
                    icon="material-symbols:refresh"
                  />
                )}
              </ButtonBase>
            </Tooltip>
            <Typography className="text-sm font-medium flex items-center gap-2 ml-6">
              <Icon icon={`mdi:account-multiple`} className="w-5 h-5" />
              <div>
                <span className="font-bold mr-1">{uniquePlayersCount}</span>
                {t('global-table:unique-players')}
              </div>
            </Typography>
          </div>

          {user && (
            <div className="space-x-2">
              <ButtonBase
                onClick={() => setUserInfoModalOpen(true)}
                className="font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black"
              >
                <Icon
                  height={20}
                  width={20}
                  icon="iconamoon:settings"
                  className="mr-3"
                />
                {t('global-table:manage-user-information')}
              </ButtonBase>
              <ButtonBase
                disabled={!isPlayerRegistered}
                onClick={() => setBuildsModalOpen(true)}
                className="font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon
                  height={20}
                  width={20}
                  icon="charm:swords"
                  className="mr-3"
                />
                {t('global-table:manage-builds')}
              </ButtonBase>
            </div>
          )}
        </div>
        <DataGrid
          disableSelectionOnClick
          disableColumnSelector
          className="bg-[#212121] mb-4 border-none rounded-md"
          rows={rows.filter((row) => {
            if (inputText === '') {
              return row;
            } else if (
              row.player.ig_username.toLowerCase().includes(inputText)
            ) {
              return row;
            }
          })}
          columns={columns}
          localeText={
            router.locale === 'fr'
              ? frFR.components.MuiDataGrid.defaultProps.localeText
              : enUS.components.MuiDataGrid.defaultProps.localeText
          }
        />

        <Footer />
      </div>
    </>
  );
}
