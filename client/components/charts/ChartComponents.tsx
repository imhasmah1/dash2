import { 
  XAxis as RechartsXAxis, 
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer
} from 'recharts';

// Minimal wrapper components to avoid defaultProps warnings without adding conflicting props
export const XAxis = (props: any) => <RechartsXAxis {...props} />;

export const YAxis = (props: any) => <RechartsYAxis {...props} />;

export const CartesianGrid = (props: any) => <RechartsCartesianGrid {...props} />;

export const Tooltip = (props: any) => <RechartsTooltip {...props} />;

export const ResponsiveContainer = (props: any) => <RechartsResponsiveContainer {...props} />;

// Re-export other components that don't have defaultProps issues
export {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
