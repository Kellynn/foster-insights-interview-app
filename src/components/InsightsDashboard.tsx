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

const pieData = [
  { label: 'Group A', value: 400, color: '#0088FE' },
  { label: 'Group B', value: 300, color: '#00C49F' },
  { label: 'Group C', value: 300, color: '#FFBB28' },
  { label: 'Group D', value: 200, color: '#FF8042' },
];

const activePlacements: string[] = [];
const underUtilizedProviders: ProviderLevel[] = [];

interface CountyMap {
  county: string;
  count: number;
}

interface CountyPercent {
  county: string;
  percentUnderutilized: number;
}

function calculateActivePlacements(placementLevelData: PlacementLevel[]) {
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
  return activePlacements.length;
}

function calculateProvidersWithoutPlacements(providerLevelData: ProviderLevel[], placementLevelData: PlacementLevel[]) {
  if (providerLevelData && placementLevelData) {
    const totalProviders = providerLevelData.length;
    if (activePlacements.length != 0) {
      return totalProviders - activePlacements.length;
    }
    return totalProviders - calculateActivePlacements(placementLevelData);
  }
  return 0;
}

function calculateUnderutilizedProviders(providerLevelData: ProviderLevel[], placementLevelData: PlacementLevel[]) {
  if (providerLevelData && placementLevelData) {
    if (activePlacements.length == 0) {
     calculateActivePlacements(placementLevelData)
    }

    const inactiveProviders:ProviderLevel[] = [];
    providerLevelData.forEach((provider) => {
      if (activePlacements.indexOf(provider.id_provider) === -1 ) {
        inactiveProviders.push(provider);
      }
    });

    inactiveProviders.forEach((provider) => {
      const inactivePercent = (+provider.n_days_active / +provider.n_days_licensed) * 100;
      if (inactivePercent < 20) {
        underUtilizedProviders.push(provider);
      }
    });
    return underUtilizedProviders.length
  }
}

function calculateUnderUtilizedCounties(providerLevelData: ProviderLevel[], placementLevelData: PlacementLevel[]) {
  let topThree:CountyPercent[] = [];

  if (providerLevelData) {
    const defaultCountyMap = calculateCountyMap(providerLevelData);
    console.log('defaultcountymap', defaultCountyMap);

    const countyMap: CountyMap[] = [];

    if (underUtilizedProviders.length == 0) {
      calculateUnderutilizedProviders(providerLevelData, placementLevelData);
    }

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


    const percentMap: CountyPercent[] = [];
    for (let i = 0; i < countyMap.length; i++) {
      const county = countyMap[i].county;
      const percent = (countyMap[i].count / defaultCountyMap[i].count) * 100;
      percentMap.push({county: county, percentUnderutilized: percent});
    }

    topThree = percentMap
      .slice()
      .sort((a, b) => b.percentUnderutilized - a.percentUnderutilized)
      .slice(0, 3);
    console.log(topThree);
  }

  if (topThree) {
    return topThree.map(function (topThree) {
      return (
        <Typography>{topThree.county}, {Number(topThree.percentUnderutilized).toFixed(0)}% underutilized</Typography>
      )
    });
  }
  return <Typography></Typography>;
}

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


export default function InsightsDashboard({childLevelData, placementLevelData, providerLevelData}) {
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
          marginBottom: 4,
        }}
      >
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              variant="overline"
              component="div"
              sx={{ marginBottom: 3 }}
            >
              Providers with placements 
            </Typography>
            <Typography variant="h1" sx={{ marginBottom: 2, color: 'blue' }}>
              {calculateActivePlacements(placementLevelData)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Go to list</Button>
          </CardActions>
        </Card>
        <Card sx={{ minWidth: 275 }}>
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
        <Card sx={{ minWidth: 275 }}>
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
                {calculateUnderutilizedProviders(
                  providerLevelData,
                  placementLevelData,
                )}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
        <Card sx={{ minWidth: 275 }}>
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
          gap: 5,
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <Card sx={{ minWidth: 400 }}>
          <CardContent>
            <Typography variant="overline" component="div">
              License Risk
            </Typography>
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 50,
                  outerRadius: 100,
                  paddingAngle: 0,
                  cornerRadius: 0,
                  startAngle: -90,
                  endAngle: 90,
                  cx: 150,
                  cy: 150,
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