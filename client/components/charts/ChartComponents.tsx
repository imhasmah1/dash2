import { 
  XAxis as RechartsXAxis, 
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer
} from 'recharts';

// Wrapper components that provide default props without using defaultProps
export const XAxis = (props: any) => (
  <RechartsXAxis 
    axisLine={false}
    tickLine={false}
    {...props}
  />
);

export const YAxis = (props: any) => (
  <RechartsYAxis 
    axisLine={false}
    tickLine={false}
    {...props}
  />
);

export const CartesianGrid = (props: any) => (
  <RechartsCartesianGrid 
    strokeDasharray="3 3"
    stroke="#f0f0f0"
    {...props}
  />
);

export const Tooltip = (props: any) => (
  <RechartsTooltip 
    contentStyle={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    }}
    {...props}
  />
);

export const ResponsiveContainer = (props: any) => (
  <RechartsResponsiveContainer 
    width="100%"
    height={300}
    {...props}
  />
);

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
