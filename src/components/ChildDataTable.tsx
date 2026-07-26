import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const columns: GridColDef[] = [
  { field: 'id_child', headerName: 'Child ID', width: 70 },
  { field: 'removal_date', headerName: 'Removal Date', width: 130 },
  { field: 'discharge_date', headerName: 'Discharge Date', width: 130 },
  { field: 'age_at_removal', headerName: 'Age at Removal', width: 130 },
  { field: 'most_recent_age', headerName: 'Most Recent Age', width: 130 },
  { field: 'removal_county', headerName: 'Removal County', width: 130 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function ChildDataTable({childLevelData}) {
  return (
    <Box>
      <DataGrid
        rows={childLevelData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 20, 50, 100]}
        getRowId={(row) => row.id_child}
        sx={{ border: 0 }}
      />
    </Box>
  );
}