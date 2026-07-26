import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const columns: GridColDef[] = [
  { field: 'id_provider', headerName: 'Provider ID', width: 70 },
  { field: 'license_start_date', headerName: 'License Start Date', width: 130 },
  { field: 'license_end_date', headerName: 'License End Date', width: 130 },
  { field: 'county_provider', headerName: 'County', width: 130 },
  { field: 'n_days_licensed', headerName: 'Days Licensed', width: 130 },
  { field: 'n_days_active', headerName: 'Days Active', width: 130 },
  { field: 'min_age', headerName: 'Min Age', width: 130 },
  { field: 'max_age', headerName: 'Max Age', width: 130 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function ProviderDataTable({ providerLevelData }) {
  return (
    <Box>
      <DataGrid
        rows={providerLevelData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 20, 50, 100]}
        getRowId={(row) => row.id_provider}
        sx={{ border: 0 }}
      />
    </Box>
  );
}
