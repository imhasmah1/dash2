// Filter out specific console warnings from third-party libraries
const originalWarn = console.warn;

console.warn = function filterWarnings(...args: any[]) {
  const message = args[0];
  
  // Filter out Recharts defaultProps warnings
  if (
    typeof message === 'string' && 
    (
      message.includes('Support for defaultProps will be removed from function components') ||
      message.includes('XAxis') ||
      message.includes('YAxis')
    )
  ) {
    // Skip this warning
    return;
  }
  
  // Allow all other warnings through
  originalWarn.apply(console, args);
};

export {}; // Make this a module
