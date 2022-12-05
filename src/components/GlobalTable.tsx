import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, frFR } from '@mui/x-data-grid';
import { Box, ButtonBase, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Chip from './Chip';
import GuildModal from './GuildModal';
import Footer from './Footer';
import { supabase } from 'supabase';

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

const weaponsLabels = {
  greataxe: 'Hache double',
  greatsword: 'Épée longue',
  warhammer: "Marteau d'armes",
  spear: 'Lance',
  bow: 'Arc',
  firestaff: 'Bâton de feu',
  musquet: 'Mousquet',
  hatchet: 'Hachette',
  lifestaff: 'Bâton de vie',
  ice_gauntlet: 'Gantelet de glace',
  void_gauntlet: 'Gantelet du néant',
  sword_shield: 'Épée & bouclier',
  rapier: 'Rapière',
};

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
    field: 'discord',
    headerName: 'Discord',
    width: 200,
    renderCell: (params) => (
      <Box
        className='flex items-center cursor-pointer'
        onClick={() => {
          copyDiscord(params.value);
        }}>
        <Icon icon='ic:baseline-discord' className='mr-2' height={20} width={20} />
        <Typography className='text-sm'>{params.value}</Typography>
      </Box>
    ),
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'gearscore',
    headerName: 'Gearscore PVP',
    type: 'number',
    width: 140,
    renderCell(params) {
      const gs = params.value;
      let renderGS: JSX.Element;

      if (gs <= 500) {
        return <Typography className='text-sm font-semibold text-amber-300'>{gs}</Typography>;
      } else if (gs <= 520) {
        return <Typography className='text-sm font-semibold text-green-500'>{gs}</Typography>;
      } else if (gs <= 540) {
        return <Typography className='text-sm font-semibold text-blue-500'>{gs}</Typography>;
      } else if (gs <= 560) {
        return <Typography className='text-sm font-semibold text-purple-500'>{gs}</Typography>;
      } else if (gs <= 580) {
        return <Typography className='text-sm font-semibold text-pink-500'>{gs}</Typography>;
      } else if (gs <= 600) {
        return <Typography className='text-sm font-semibold text-red-500'>{gs}</Typography>;
      } else if (gs <= 620) {
        return <Typography className='text-sm font-semibold text-cyan-500'>{gs}</Typography>;
      } else if (gs <= 625) {
        return (
          <Typography className='text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-200'>
            {gs}
          </Typography>
        );
      }

      return renderGS;
    },
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'first_weapon',
    headerName: 'Première arme',
    width: 160,
    renderCell: (params) => (
      <Typography className='text-sm'>{weaponsLabels[params.value]}</Typography>
    ),
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'second_weapon',
    headerName: 'Deuxième arme',
    width: 160,
    renderCell: (params) => (
      <Typography className='text-sm'>{weaponsLabels[params.value]}</Typography>
    ),
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'third_weapon',
    headerName: 'Troisième arme',
    width: 160,
    renderCell: (params) => (
      <Typography className='text-sm'>{weaponsLabels[params.value]}</Typography>
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
    renderCell: (params) => (
      <Chip status={params.value} label={params.value} />
    ),
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    renderCell: (params) => (
      <>
        <Tooltip title='Modifier'>
          <IconButton size='small'>
            <EditIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Supprimer'>
          <IconButton size='small' color='error'>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </>
    ),
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
];

export default function DataTable() {
  const [guildModalOpen, setGuildModalOpen] = useState(false);
  const [rows, setRows] = useState([]);

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

  return (
    <>
      <GuildModal isOpen={guildModalOpen} handleClose={() => setGuildModalOpen(false)} />

      <div className='m-5' style={{ height: '71vh' }}>
        <ButtonBase className='font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black mb-5 mr-2'>
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
          className='font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black mb-5'>
          <Icon height={20} width={20} icon='mdi:people-group' className='mr-3' />
          Ajouter une guilde
        </ButtonBase>
        <DataGrid
          className='bg-[#212121] mb-4'
          rows={rows}
          columns={columns}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        />

        <Footer />
      </div>
    </>
  );
}
