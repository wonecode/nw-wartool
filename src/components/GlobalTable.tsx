import * as React from 'react';
import { DataGrid, GridColDef, frFR } from '@mui/x-data-grid';
import { Box, ButtonBase, Chip, ChipTypeMap, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Icon } from '@iconify/react';

const stuff = [
  {
    type: 'Léger',
    color: 'success',
  },
  {
    type: 'Moyen',
    color: 'warning',
  },
  {
    type: 'Lourd',
    color: 'error',
  },
];

const columns: GridColDef[] = [
  {
    field: 'ingameName',
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
        className='flex items-center'
        onClick={() => {
          navigator.clipboard.writeText(params.value);
        }}>
        <Icon color='#5865F2' icon='ic:baseline-discord' className='mr-2' height={22} width={22} />
        <Typography className='text-sm'>{params.value}</Typography>
      </Box>
    ),
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'gearscore',
    headerName: 'Gearscore',
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
    field: 'primaryWeapon',
    headerName: 'Arme principale',
    width: 200,
    renderCell: (params) => <Typography className='text-sm'>{params.value}</Typography>,
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'secondaryWeapon',
    headerName: 'Arme secondaire',
    width: 200,
    renderCell: (params) => <Typography className='text-sm'>{params.value}</Typography>,
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'stuff',
    headerName: 'Stuff',
    width: 140,
    renderCell: (params) => (
      <Chip
        className='text-xs'
        size='small'
        variant='filled'
        color={stuff.find((item) => item.type === params.value).color}
        label={params.value}
      />
    ),
    renderHeader: (params) => (
      <Typography className='text-sm font-bold'>{params.colDef.headerName}</Typography>
    ),
  },
  {
    field: 'guild',
    headerName: 'Guilde',
    width: 200,
    renderCell: (params) => (
      <Box className='items-center flex'>
        <Box className='w-3 h-3 bg-violet-500 mr-2 rounded-lg' />
        <Typography className='text-sm'>{params.value}</Typography>
      </Box>
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

const rows = [
  {
    id: 1,
    ingameName: 'Wonezer',
    discord: 'Wone#5234',
    gearscore: 575,
    primaryWeapon: 'Arc',
    secondaryWeapon: 'Épée longue',
    stuff: 'Léger',
    guild: 'UFC Chômeur',
  },
];

export default function DataTable() {
  return (
    <div className='m-5' style={{ height: '75vh' }}>
      <ButtonBase className='font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black mb-5 mr-2'>
        <Icon height={20} width={20} icon='material-symbols:person-add-rounded' className='mr-3' />
        Ajouter un joueur
      </ButtonBase>
      <ButtonBase className='font-bold text-sm px-4 py-1 rounded-sm bg-slate-100 text-black mb-5'>
        <Icon height={20} width={20} icon='mdi:people-group' className='mr-3' />
        Ajouter une guilde
      </ButtonBase>
      <DataGrid
        className='bg-[#212121]'
        rows={rows}
        columns={columns}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      />
    </div>
  );
}
