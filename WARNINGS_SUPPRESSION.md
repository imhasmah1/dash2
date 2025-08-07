# Warning Suppression

This document explains the warning suppression implemented in the project.

## Recharts defaultProps Warnings

### Issue
Recharts library (versions up to 2.15.4) uses the deprecated `defaultProps` pattern, which causes warnings in React 18+:

```
Warning: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead. XAxis/YAxis
```

### Solution Implemented

1. **Console Warning Suppression** (`client/App.tsx`)
   - Filters out specific defaultProps warnings from Recharts
   - Preserves other important warnings
   - Applied globally at app startup

2. **Wrapper Components** (`client/components/charts/ChartComponents.tsx`)
   - Created custom wrapper components for XAxis, YAxis, etc.
   - Provides default props inline instead of using defaultProps
   - Improves type safety and avoids deprecation warnings

3. **Updated Imports** (`client/pages/Revenue.tsx`)
   - Uses wrapper components instead of direct Recharts imports
   - Maintains same functionality without warnings

### Patterns Suppressed

The following warning patterns are suppressed:
- `defaultProps will be removed`
- `Support for defaultProps`
- `XAxis`, `YAxis`, `XAxis2`, `YAxis2`
- `ChartLayoutContextProvider`
- `CategoricalChartWrapper`
- `function components in a future major release`
- `Use JavaScript default parameters instead`

### Future Considerations

- Monitor Recharts updates for native fix
- Consider alternative chart libraries if warnings persist
- Remove suppression once library is updated

### Testing

To verify warnings are suppressed:
1. Navigate to Revenue page
2. Open browser console
3. Confirm no defaultProps warnings appear
4. Verify other warnings still display normally

### Maintenance

When updating Recharts:
1. Test if warnings persist
2. Update suppression patterns if needed
3. Remove suppression if library fixes the issue
