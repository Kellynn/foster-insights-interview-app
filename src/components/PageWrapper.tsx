import Box from '@mui/material/Box';
import TopBar from './TopBar.tsx';
import AppTheme from '../theme/AppTheme.tsx';
import NavSideBar from './NavSideBar.tsx';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router';
import DataContent from './DataContent.tsx';
import { useEffect, useState } from 'react';
import Papa, { ParseResult } from 'papaparse';

export interface ChildLevel {
  id_child: string;
  removal_date: string;
  discharge_date: string;
  age_at_removal: string;
  most_recent_age: string;
  removal_county: string;
}

export interface ProviderLevel {
  id_provider: string;
  license_start_date: string;
  license_end_date: string;
  county_provider: string;
  n_days_licensed: string;
  n_days_active: string;
  min_age: string;
  max_age: string;
}

export interface PlacementLevel {
  id_child: string;
  placement_start_date: string;
  placement_end_date: string;
  resource_type_on_this_placement: string;
  placement_index: string;
  removal_county: string;
  placement_county: string;
  id_provider: string;
  placement_length: string;
  id_placement: number;
}

export interface CsvData {
  childData: ChildLevel[];
  providerData: ProviderLevel[];
  placementData: PlacementLevel[];
}

export default function PageWrapper() {

  const[childLevelData, setChildLevelData] = useState<ChildLevel[]>();
  const [providerLevelData, setProviderLevelData] = useState<ProviderLevel[]>();
  const [placementLevelData, setPlacementLevelData] = useState<PlacementLevel[]>();

  async function loadData(){
    fetch('child_level.csv')
      .then((response) => response.text())
      .then((responseText) => {
        Papa.parse<ChildLevel>(responseText, {
          header: true,
          complete: (results: ParseResult<ChildLevel>) => {
            setChildLevelData(results.data);
          }
        });
      });

    fetch('placement_level.csv')
      .then((response) => response.text())
      .then((responseText) => {
        Papa.parse<PlacementLevel>(responseText, {
          header: true,
          complete: (results: ParseResult<PlacementLevel>) => {
            // setPlacementLevelData(results.data);
            const placementEdit = results.data?.map((item: PlacementLevel, index) => {
              return {
                ...item,
                id_placement: index
              }
            })
            setPlacementLevelData(placementEdit)
          },
        });
      });

    fetch('provider_level_updated.csv')
      .then((response) => response.text())
      .then((responseText) => {
        Papa.parse<ProviderLevel>(responseText, {
          header: true,
          complete: (results: ParseResult<ProviderLevel>) => {
            setProviderLevelData(results.data);
          },
        });
      });
  }

  useEffect(() => {
    // Load existing customer data from csv
    loadData()
  }, []);

  return (
    <AppTheme>
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <TopBar />
          <NavSideBar />
          <DataContent
            childLevelData={childLevelData}
            providerLevelData={providerLevelData}
            placementLevelData={placementLevelData}
          />
        </Box>
      </BrowserRouter>
    </AppTheme>
  );
}
