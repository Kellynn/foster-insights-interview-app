import Box from '@mui/material/Box';
import { Button, ButtonGroup, Typography } from '@mui/material';
import { Route, Routes } from 'react-router';
import ChildDataTable from './ChildDataTable.tsx';
import ProviderDataTable from './ProviderDataTable.tsx';
import { Link as RouterLink, Route, Routes } from 'react-router';
import PlacementDataTable from './PlacementDataTable.tsx';

export default function RawDataTables({ childLevelData, providerLevelData, placementLevelData }) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button component={RouterLink} to="/yourdata/childdata">
          Child Data
        </Button>
        <Button component={RouterLink} to="/yourdata/placementdata">
          Placement Data
        </Button>
        <Button component={RouterLink} to="/yourdata/providerdata">
          Provider Data
        </Button>
      </ButtonGroup>
      <Routes>
        <Route
          path="/childdata"
          element={<ChildDataTable childLevelData={childLevelData} />}
        />
        <Route
          path="/placementdata"
          element={<PlacementDataTable placementLevelData={placementLevelData} />}
        />
        <Route
          path="/providerdata"
          element={<ProviderDataTable providerLevelData={providerLevelData} />}
        />
      </Routes>
    </Box>
  );
}
