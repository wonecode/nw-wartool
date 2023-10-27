import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, frFR, enUS } from '@mui/x-data-grid';
import { Box, ButtonBase, Typography, InputBase } from '@mui/material';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Chip from './Chip';
import GuildModal from './GuildModal';
import Footer from './Footer';
import { supabase } from 'supabase';
import PlayerModal from './PlayerModal';
import { frWeaponsLabels, enWeaponsLabels } from 'utils/weapons';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import {enHeartruneLabels, frHeartruneLabels} from "../../utils/heartrunes";

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

const copyDiscord = (username: string) => {
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
  navigator.clipboard.writeText(username);
};

export default function DataTable() {
  const [guildModalOpen, setGuildModalOpen] = useState(false);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [inputText, setInputText] = useState('');
  const [fetchClicked, setFetchClicked] = useState(false);

  const { t } = useTranslation(['common', 'global-table']);
  const router = useRouter();

  const handleRefresh = () => {
    setFetchClicked(true);

    fetchPlayers();

    setTimeout(() => {
      setFetchClicked(false);
    }, 5000);
  }

  const columns: GridColDef[] = [
    {
      field: 'ig_username',
      headerName: t('global-table:ig_username'),
      width: 200,
      renderCell: (params) => <Typography className='text-sm'>{params.value}</Typography>,
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
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
          return <Typography className='text-sm font-semibold text-pink-500'>{gs}</Typography>;
        } else if (gs <= 655) {
          return <Typography className='text-sm font-semibold text-green-500'>{gs}</Typography>;
        } else if (gs <= 670) {
          return <Typography className='text-sm font-semibold text-purple-500'>{gs}</Typography>;
        } else if (gs < 690) {
          return <Typography className='text-sm font-semibold text-cyan-500'>{gs}</Typography>;
        } else if (gs > 690) {
          return (
            <Typography
              className='text-sm font-semibold bg-gradient-to-r bg-clip-text  text-transparent 
            from-orange-500 via-amber-300 to-orange-500 animate-text'>
              {gs}
            </Typography>
          );
        } else if (gs <= 625) {
          return <Typography className='text-sm font-semibold text-red-500'>{gs}</Typography>;
        }

        return renderGS;
      },
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'class_type',
      headerName: t('global-table:class_type'),
      width: 140,
      renderCell: (params) => (
        <Chip locale={router.locale} label={params.value} status={params.value} />
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'first_weapon',
      headerName: t('global-table:first_weapon'),
      width: 180,
      renderCell: (params) => (
        <Box display='flex items-center'>
          <Icon
            icon={
              router.locale === 'fr'
                ? frWeaponsLabels[params.value].icon
                : enWeaponsLabels[params.value].icon
            }
            width={18}
            height={18}
            className='mr-2'
          />
          <Typography className='text-sm'>
            {router.locale === 'fr'
              ? frWeaponsLabels[params.value].label
              : enWeaponsLabels[params.value].label}
          </Typography>
        </Box>
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'second_weapon',
      headerName: t('global-table:second_weapon'),
      width: 180,
      renderCell: (params) => (
        <Box display='flex items-center'>
          <Icon
            icon={
              router.locale === 'fr'
                ? frWeaponsLabels[params.value].icon
                : enWeaponsLabels[params.value].icon
            }
            width={18}
            height={18}
            className='mr-2'
          />
          <Typography className='text-sm'>
            {router.locale === 'fr'
              ? frWeaponsLabels[params.value].label
              : enWeaponsLabels[params.value].label}
          </Typography>
        </Box>
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'heartrune',
      headerName: t('global-table:heartrune'),
      width: 180,
      renderCell: (params) => (
        <Box display='flex items-center'>
          <Icon
            icon={
              router.locale === 'fr'
                ? frHeartruneLabels[params.value]?.icon
                : enHeartruneLabels[params.value]?.icon
            }
            width={18}
            height={18}
            className='mr-2'
          />
          <Typography className='text-sm'>
            {router.locale === 'fr'
              ? frHeartruneLabels[params.value]?.label
              : enHeartruneLabels[params.value]?.label}
          </Typography>
        </Box>
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'stuff',
      headerName: 'Stuff',
      width: 140,
      renderCell: (params) => (
        <Chip locale={router.locale} status={params.value} label={params.value} />
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'guild',
      headerName: t('global-table:guild'),
      width: 200,
      renderCell: (params) => {
        if (params.value === null) {
          return <Typography className='text-sm'>-</Typography>;
        }
        return <Typography className='text-sm'>{params.value.name}</Typography>;
      },
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'faction',
      headerName: 'Faction',
      width: 150,
      renderCell: (params) => (
        <Chip locale={router.locale} status={params.value} label={params.value} />
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'discord',
      headerName: 'Discord',
      width: 200,
      renderCell: (params) => (
        <ButtonBase
          className='flex items-center cursor-pointer bg-[#5865F2] py-1 px-2 rounded-sm text-ellipsis'
          onClick={() => {
            copyDiscord(params.value);
          }}>
          <Icon icon='ic:baseline-discord' className='mr-1' height={17} width={17} />
          <Typography className='text-[11px]'>{params.value}</Typography>
        </ButtonBase>
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
  ];

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select(
        'id, ig_username, gearscore, class_type, first_weapon, second_weapon, heartrune, stuff, guild:guild_id(name), faction, discord'
      )
      .order('ig_username', { ascending: true });

    if (error) {
      console.log(error);
    } else {
      setRows(data);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  return (
    <>
      <GuildModal isOpen={guildModalOpen} handleClose={() => setGuildModalOpen(false)} />
      <PlayerModal
        isOpen={playerModalOpen}
        handleClose={() => setPlayerModalOpen(false)}
        rows={rows}
        handleRows={(values) => setRows(values)}
      />

      <div className='m-5' style={{ height: '76vh' }}>
        <div className='flex items-center mb-5 justify-between'>
          <div className='flex items-center'>
            <Typography className={`uppercase font-black text-2xl mr-5`}>
              {t('common:players-list')}
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon className='w-5' />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t('global-table:find-player')}
                inputProps={{ 'aria-label': 'search' }}
                onChange={inputHandler}
                className='text-sm'
              />
            </Search>
            <ButtonBase
                disabled={fetchClicked}
                onClick={() => handleRefresh()}
                className='font-bold text-sm px-4 py-[7px] rounded-sm bg-[#353535] text-white ml-5 hover:bg-[#454545]'>
              {fetchClicked ?
                    <Icon
                        height={20}
                        width={20}
                        icon='line-md:loading-loop' />
                  :
                  <Icon
                  height={20}
                  width={20}
                  icon='ic:baseline-refresh'
              />}
            </ButtonBase>
          </div>
          <div>
            <ButtonBase
              onClick={() => setPlayerModalOpen(true)}
              className='font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black mr-2'>
              <Icon
                height={20}
                width={20}
                icon='material-symbols:person-add-rounded'
                className='mr-3'
              />
              {t('global-table:add-player')}
            </ButtonBase>
            <ButtonBase
              onClick={() => setGuildModalOpen(true)}
              className='font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black'>
              <Icon height={20} width={20} icon='mdi:people-group' className='mr-3' />
              {t('global-table:add-guild')}
            </ButtonBase>
          </div>
        </div>
        <DataGrid
          disableSelectionOnClick
          className='bg-[#212121] mb-4'
          rows={rows.filter((row) => {
            if (inputText === '') {
              return row;
            } else if (row.ig_username.toLowerCase().includes(inputText)) {
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
