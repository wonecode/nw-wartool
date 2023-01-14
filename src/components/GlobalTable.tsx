import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, frFR } from '@mui/x-data-grid';
import { Box, ButtonBase, IconButton, Input, Tooltip, Typography, InputBase } from '@mui/material';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Chip from './Chip';
import GuildModal from './GuildModal';
import Footer from './Footer';
import { supabase } from 'supabase';
import PlayerModal from './PlayerModal';
import { weaponsLabels } from 'utils/weapons';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
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
    // vertical padding + font size from searchIcon
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

  const columns: GridColDef[] = [
    {
      field: 'ig_username',
      headerName: 'Pseudo IG',
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

        if (gs <= 560) {
          return <Typography className='text-sm font-semibold text-pink-500'>{gs}</Typography>;
        } else if (gs <= 600) {
          return <Typography className='text-sm font-semibold text-green-500'>{gs}</Typography>;
        } else if (gs <= 610) {
          return <Typography className='text-sm font-semibold text-purple-500'>{gs}</Typography>;
        } else if (gs <= 620) {
          return <Typography className='text-sm font-semibold text-cyan-500'>{gs}</Typography>;
        } else if (gs === 625) {
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
      field: 'main_bis_class',
      headerName: 'Main/Bis classe',
      width: 140,
      renderCell: (params) => <Chip label={params.value} status={params.value} />,
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'first_weapon',
      headerName: 'Première arme',
      width: 180,
      renderCell: (params) => (
        <Box display='flex items-center'>
          <Icon icon={weaponsLabels[params.value].icon} width={18} height={18} className='mr-2' />
          <Typography className='text-sm'>{weaponsLabels[params.value].label}</Typography>
        </Box>
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'second_weapon',
      headerName: 'Deuxième arme',
      width: 180,
      renderCell: (params) => (
        <Box display='flex items-center'>
          <Icon icon={weaponsLabels[params.value].icon} width={18} height={18} className='mr-2' />
          <Typography className='text-sm'>{weaponsLabels[params.value].label}</Typography>
        </Box>
      ),
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'third_weapon',
      headerName: 'Troisième arme',
      width: 180,
      renderCell: (params) => (
        <Box display='flex items-center'>
          <Icon icon={weaponsLabels[params.value]?.icon} width={18} height={18} className='mr-2' />
          <Typography className='text-sm'>{weaponsLabels[params.value]?.label}</Typography>
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
      renderCell: (params) => <Chip status={params.value} label={params.value} />,
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'guild',
      headerName: 'Guilde',
      width: 200,
      renderCell: (params) => <Typography className='text-sm'>{params.value}</Typography>,
      renderHeader: (params) => (
        <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
      ),
    },
    {
      field: 'faction',
      headerName: 'Faction',
      width: 150,
      renderCell: (params) => <Chip status={params.value} label={params.value} />,
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
    const { data, error } = await supabase.from('players').select('*');

    if (error) {
      console.log(error);
    } else {
      console.log(data);
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
            <Typography className='uppercase font-black text-xl w-72'>War players</Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Chercher un joueur'
                inputProps={{ 'aria-label': 'search' }}
                onChange={inputHandler}
              />
            </Search>
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
              Ajouter un joueur
            </ButtonBase>
            <ButtonBase
              onClick={() => setGuildModalOpen(true)}
              className='font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black'>
              <Icon height={20} width={20} icon='mdi:people-group' className='mr-3' />
              Ajouter une guilde
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
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        />

        <Footer />
      </div>
    </>
  );
}
