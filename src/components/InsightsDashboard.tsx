import Box from '@mui/material/Box';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart, LineChart } from '@mui/x-charts';
import { PlacementLevel, ProviderLevel } from './PageWrapper.tsx';
interface CountyMap {
  county: string;
  count: number;
}

interface CountyPercent {
  county: string;
  percentUnderutilized: number;
}

/* Finds all providers who have at least one placement active as of July 1st, 2026 */
function calculateActivePlacements(placementLevelData: PlacementLevel[]) {
  const activePlacements: string[] = [];

  if (placementLevelData) {
    placementLevelData.forEach((placement) => {
      if (
        placement.placement_end_date == '7/1/26' &&
        placement.id_provider != 'NA'
      ) {
        if (activePlacements.indexOf(placement.id_provider) === -1) {
          activePlacements.push(placement.id_provider);
        }
      }
    });
  }
  return activePlacements;
}

/* Finds number of providers that do not have any current active placements */
function calculateProvidersWithoutPlacements(providerLevelData: ProviderLevel[], placementLevelData: PlacementLevel[]) {
  const activePlacements: string[] = calculateActivePlacements(placementLevelData);

  if (providerLevelData && placementLevelData) {
    const totalProviders = providerLevelData.length;
    return totalProviders - activePlacements.length;
  }
  return 0;
}

/* Finds all providers who spend less than 20% of their active licensed time having placements */
function calculateUnderutilizedProviders(providerLevelData: ProviderLevel[], placementLevelData: PlacementLevel[]) {
  const activePlacements: string[] =
    calculateActivePlacements(placementLevelData);
  const underUtilizedProviders: ProviderLevel[] = [];

  if (providerLevelData && placementLevelData) {
    const inactiveProviders:ProviderLevel[] = [];

    // creates a map of providers who currently have no active placements
    providerLevelData.forEach((provider) => {
      if (activePlacements.indexOf(provider.id_provider) === -1 ) {
        inactiveProviders.push(provider);
      }
    });

    // calculates percentage of time active with placements vs licensed for each provider
    inactiveProviders.forEach((provider) => {
      const inactivePercent = (+provider.n_days_active / +provider.n_days_licensed) * 100;
      if (inactivePercent < 20) {
        underUtilizedProviders.push(provider);
      }
    });
  }

  return underUtilizedProviders;
}

/* Calculates top three counties that have high percentage of underutilized providers */
function calculateUnderUtilizedCounties(providerLevelData: ProviderLevel[], placementLevelData: PlacementLevel[]) {
  let topThree:CountyPercent[] = [];
  const underUtilizedProviders: ProviderLevel[] =
    calculateUnderutilizedProviders(providerLevelData, placementLevelData);

  calculateLicenseRisk(providerLevelData, placementLevelData);

  if (providerLevelData) {
    const defaultCountyMap = calculateCountyMap(providerLevelData);
    const countyMap: CountyMap[] = [];

    // create a map of how many underutilized providers are in each county
    underUtilizedProviders.forEach((provider) => {
      const providerCounty = provider.county_provider;
      const index = countyMap.findIndex(
        ({ county }) => county === providerCounty,
      );

      if (index != -1) {
        const updatedCount = countyMap[index].count + 1;
        countyMap.splice(index, 1, {
          county: providerCounty,
          count: updatedCount,
        });
      } else {
        countyMap.push({ county: providerCounty, count: 1 });
      }
    });

    // calculate percentage of underutilized providers to all providers for each county
    const percentMap: CountyPercent[] = [];
    for (let i = 0; i < countyMap.length; i++) {
      const county = countyMap[i].county;
      const percent = (countyMap[i].count / defaultCountyMap[i].count) * 100;
      percentMap.push({county: county, percentUnderutilized: percent});
    }

    // find and return the highest 3 percentages for easy understanding
    topThree = percentMap
      .slice()
      .sort((a, b) => b.percentUnderutilized - a.percentUnderutilized)
      .slice(0, 3);
  }

  if (topThree) {
    return topThree.map(function (topThree) {
      return (
        <Typography key={topThree.county}>{topThree.county}, {Number(topThree.percentUnderutilized).toFixed(0)}% underutilized</Typography>
      )
    });
  }
  return <Typography></Typography>;
}

/* Makes a map of counties and the number of providers in them based on the provider CSV data */
function calculateCountyMap(providerLevelData: ProviderLevel[]) {
  interface CountyMap {
    county: string;
    count: number;
  }

  const countyMap: CountyMap[] = [];

  providerLevelData.forEach((provider) => {
    const providerCounty = provider.county_provider;
    const index = countyMap.findIndex(
      ({ county }) => county === providerCounty,
    );

    if (index != -1) {
      const updatedCount = countyMap[index].count + 1;
      countyMap.splice(index, 1, {
        county: providerCounty,
        count: updatedCount,
      });
    } else {
      countyMap.push({ county: providerCounty, count: 1 });
    }
  });

  return countyMap;
}

function calculateLicenseRisk(providerLevelData: ProviderLevel[], placementLevelData: PlacementLevel[]) {
  const providers: ProviderLevel[] = [];
  const providerLowRisk: ProviderLevel[] = [];
  const providerMediumRisk: ProviderLevel[] = [];
  const providerHighRisk: ProviderLevel[] = [];

  // Find providers with licensing expiring soon (July, August, September)
  if (providerLevelData) {
    providerLevelData.forEach((provider) => {
      const licenseEnd = provider.license_end_date;
      const date = licenseEnd.split('/');
      if (
        date[2] === '26' &&
        (date[0] === '7' || date[0] === '8' || date[0] === '9')
      ) {
        providers.push(provider);
      }
    });

    providers.forEach((provider) => {
      const percentActive =
        (+provider.n_days_active / +provider.n_days_licensed) * 100;
      if (percentActive >= 80) {
        providerLowRisk.push(provider);
      } else if (percentActive <= 20) {
        providerHighRisk.push(provider);
      } else {
        providerMediumRisk.push(provider);
      }
    });
  }

  const pieData = [
    { label: 'Likely to renew', value: providerLowRisk.length, color: '#0088FE' },
    { label: 'Medium risk', value: providerMediumRisk.length, color: '#00C49F' },
    { label: 'High risk of not renewing', value: providerHighRisk.length, color: '#FFBB28' },
  ];

  return pieData;
}

export default function InsightsDashboard({childLevelData, placementLevelData, providerLevelData}) {

  const riskPieData = calculateLicenseRisk(providerLevelData, placementLevelData);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography
              variant="overline"
              component="div"
              sx={{ marginBottom: 3 }}
            >
              Providers with placements
            </Typography>
            <Typography variant="h1" sx={{ marginBottom: 2, color: 'blue' }}>
              {calculateActivePlacements(placementLevelData).length}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Go to list</Button>
          </CardActions>
        </Card>
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography
              variant="overline"
              component="div"
              sx={{ marginBottom: 3 }}
            >
              Providers without placements
            </Typography>
            <Typography variant="h1" sx={{ marginBottom: 2, color: 'red' }}>
              {calculateProvidersWithoutPlacements(
                providerLevelData,
                placementLevelData,
              )}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Go to list</Button>
          </CardActions>
        </Card>
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="overline" component="div">
              Underutilized Providers
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: 3, color: 'text.secondary', fontSize: 12 }}
            >
              Providers that have less than 20% time <br />
              with active placements
            </Typography>
            <Typography variant="h1">
              {
                calculateUnderutilizedProviders(
                  providerLevelData,
                  placementLevelData,
                ).length
              }
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="overline" component="div">
              Top Underutilized Counties
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: 3, color: 'text.secondary', fontSize: 12 }}
            >
              Counties with the highest percentage <br />
              of underutilized providers
            </Typography>
            <Typography variant="h1">
              {calculateUnderUtilizedCounties(
                providerLevelData,
                placementLevelData,
              )}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 5,
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <Card sx={{ minWidth: 500 }}>
          <CardContent>
            <Typography variant="overline" component="div">
              License Risk
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ marginBottom: 3 }}
            >
              For licenses expiring in the next 3 months
            </Typography>
            <PieChart
              series={[
                {
                  data: riskPieData,
                  innerRadius: 80,
                  outerRadius: 100,
                  paddingAngle: 1,
                  cornerRadius: 0,
                  startAngle: -80,
                  endAngle: 80,
                  cx: 150,
                  cy: 100,
                },
              ]}
            />
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 400 }}>
          <CardContent>
            <Typography variant="overline" component="div">
              Risk Focus
            </Typography>
            <Typography variant="body1" component="div">
              Historical number of placements at providers most likely to let their license expire
            </Typography>
            <BarChart
              xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
              series={[
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] },
              ]}
              height={200}
            />
          </CardContent>
        </Card>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 5,
          justifyContent: 'center',
        }}
      >
        <Card sx={{ minWidth: 350 }}>
          <CardContent>
            <Typography variant="overline" component="div">
              License expiring in the next 3 months
            </Typography>
            <BarChart
              xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
              series={[
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] },
              ]}
              height={200}
            />
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 350 }}>
          <CardContent>
            <Typography variant="overline" component="div">
              Historical active licenses per month
            </Typography>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              height={200}
            />
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 350 }}>
          <CardContent>
            <Typography variant="overline" component="div">
              Placements per month
            </Typography>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              height={200}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}