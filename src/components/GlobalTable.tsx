import * as React from 'react';
import { DataGrid, GridColDef, frFR } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'username', headerName: 'Pseudo', width: 200 },
  { field: 'discord', headerName: 'Discord', width: 200 },
  {
    field: 'level',
    headerName: 'Niveau',
    type: 'number',
    width: 140,
  },
  {
    field: 'primaryWeapon',
    headerName: 'Arme principale',
    width: 200,
  },
  {
    field: 'secondaryWeapon',
    headerName: 'Arme secondaire',
    width: 200,
  },
];

const rows = [
  // { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  // { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  // { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  // { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  // { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  // { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  // { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  // { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  // { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function DataTable() {
  return (
    <div className='m-5' style={{ height: '80vh' }}>
      <DataGrid
        className='bg-[#212121]'
        rows={rows}
        columns={columns}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      />
    </div>
  );
}
