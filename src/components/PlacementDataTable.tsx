import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const columns: GridColDef[] = [
  { field: 'id_child', headerName: 'Child ID', width: 70 },
  { field: 'placement_start_date', headerName: 'Placement Start Date', width: 130 },
  { field: 'placement_end_date', headerName: 'Placement End Date', width: 130 },
  {
    field: 'resource_type_on_this_placement',
    headerName: 'Placement Resource Type',
    width: 130,
  },
  { field: 'placement_index', headerName: 'Placement Index', width: 130 },
  { field: 'removal_county', headerName: 'Removal County', width: 130 },
  { field: 'placement_county', headerName: 'Placement County', width: 130 },
  { field: 'id_provider', headerName: 'Provider ID', width: 130 },
  { field: 'placement_length', headerName: 'Placement Length', width: 130 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function PlacementDataTable({ placementLevelData }) {
  return (
    <Box>
      <DataGrid
        rows={placementLevelData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 20, 50, 100]}
        getRowId={(row) => row.id_placement}
        sx={{ border: 0 }}
      />
    </Box>
  );
}
