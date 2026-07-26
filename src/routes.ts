import {
  type RouteConfig,
  route,
} from '@react-router/dev/routes';

export default [
  route('home', './components/InsightsDashboard.tsx'),
  route('yourdata', './components/RawDataTables.tsx'),
  route('yourdata/childdata', './components/hildDataTable.tsx'),
  route('yourdata/placementdata', './components/PlacementDataTable.tsx'),
  route('yourdata/providerdata', './components/ProviderTable.tsx'),
] satisfies RouteConfig;
