import Box from '@mui/material/Box';
import { Toolbar } from '@mui/material';
import { Route, Routes } from 'react-router';
import InsightsDashboard from './InsightsDashboard.tsx';
import RawDataTables from './RawDataTables.tsx';

export default function DataContent({childLevelData, providerLevelData, placementLevelData}) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Routes>
        <Route
          path="/"
          element={
            <InsightsDashboard
              childLevelData={childLevelData}
              providerLevelData={providerLevelData}
              placementLevelData={placementLevelData}
            />
          }
        />
        <Route
          path="/yourdata/*"
          element={
            <RawDataTables
              childLevelData={childLevelData}
              providerLevelData={providerLevelData}
              placementLevelData={placementLevelData}
            />
          }
        />
      </Routes>
    </Box>
  );
}