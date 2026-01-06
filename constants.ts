import { SystemMetric, Status, TelemetryChannel, DiagnosticItem, AlarmItem } from './types';

export const SYSTEM_METRICS: SystemMetric[] = [
  { id: 'm1', name: 'Drilling', value: 97, unit: '%', status: Status.NOMINAL, alarms: 0, uptimeHours: 1247 },
  { id: 'm2', name: 'Pumps', value: 94, unit: '%', status: Status.NOMINAL, alarms: 1, uptimeHours: 892 },
  { id: 'm3', name: 'Power Gen', value: 82, unit: '%', status: Status.WARNING, alarms: 3, uptimeHours: 2134 },
  { id: 'm4', name: 'Safety Sys', value: 99, unit: '%', status: Status.NOMINAL, alarms: 0, uptimeHours: 3421 },
  { id: 'm5', name: 'Comms', value: 96, unit: '%', status: Status.NOMINAL, alarms: 0, uptimeHours: 1876 },
  { id: 'm6', name: 'Electrical', value: 91, unit: '%', status: Status.NOMINAL, alarms: 2, uptimeHours: 1632 },
];

const generateTelemetryData = (base: number, variance: number, count: number, threshold: number) => {
  return Array.from({ length: count }, (_, i) => ({
    time: `${i}`,
    value: base + (Math.random() * variance * 2 - variance),
    threshold: threshold
  }));
};

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    id: 't1',
    name: 'Well Pressure',
    currentValue: 2871.6,
    unit: 'PSI',
    threshold: 3000,
    color: '#3b82f6', // blue
    data: generateTelemetryData(2850, 50, 40, 3000)
  },
  {
    id: 't2',
    name: 'Mud Flow Rate',
    currentValue: 546.4,
    unit: 'GPM',
    threshold: 600,
    color: '#22c55e', // green
    data: generateTelemetryData(540, 20, 40, 600)
  },
  {
    id: 't3',
    name: 'Vibration Level',
    currentValue: 0.5,
    unit: 'G',
    threshold: 0.8,
    color: '#eab308', // yellow/amber
    data: generateTelemetryData(0.5, 0.15, 40, 0.8)
  },
  {
    id: 't4',
    name: 'Coolant Temp',
    currentValue: 89.7,
    unit: '°C',
    threshold: 90,
    color: '#ef4444', // red
    data: generateTelemetryData(88, 1.5, 40, 90)
  }
];

export const DIAGNOSTICS_DATA: DiagnosticItem[] = [
  { id: 'd1', name: 'Top Drive A', parameter: 'Torque', current: 46501.23, nominal: 45000.00, tolerance: '±10%', deviation: 1.23, unit: 'Nm', status: 'good' },
  { id: 'd2', name: 'Top Drive A', parameter: 'RPM', current: 44210.76, nominal: 45000.00, tolerance: '±10%', deviation: 0.98, unit: 'Nm', status: 'good' },
  { id: 'd3', name: 'Top Drive A', parameter: 'Pressure', current: 41109.87, nominal: 45000.00, tolerance: '±10%', deviation: 1.05, unit: 'Nm', status: 'good' },
  { id: 'd4', name: 'AC Bus Freq', parameter: 'Frequency', current: 60.87, nominal: 60.00, tolerance: '±0.5%', deviation: 1.45, unit: 'Hz', status: 'critical' },
  { id: 'd5', name: 'Top Drive B', parameter: 'Stroke Rate', current: 49876.32, nominal: 45000.00, tolerance: '±10%', deviation: 0.87, unit: 'Nm', status: 'good' },
  { id: 'd6', name: 'Top Drive B', parameter: 'Load', current: 42987.90, nominal: 45000.00, tolerance: '±10%', deviation: 1.34, unit: 'Nm', status: 'good' },
  { id: 'd7', name: 'Top Drive C', parameter: 'Load', current: 47654.45, nominal: 45000.00, tolerance: '±10%', deviation: 0.91, unit: 'Nm', status: 'good' },
  { id: 'd8', name: 'Top Drive C', parameter: 'Pressure', current: 43123.56, nominal: 45000.00, tolerance: '±10%', deviation: 1.18, unit: 'Nm', status: 'good' },
  { id: 'd9', name: 'Top Drive D', parameter: 'Torque', current: 45500.14, nominal: 45000.00, tolerance: '±10%', deviation: 1.02, unit: 'Nm', status: 'good' },
];

export const ALARMS_DATA: AlarmItem[] = [
  { id: 'a1', severity: 'CRIT', timestamp: '2024-12-29 14:23:17', system: 'POWER-GEN-02', message: 'Generator load exceeds 8...', code: 'ALM-2024-1247', acknowledged: false },
  { id: 'a2', severity: 'WARN', timestamp: '2024-12-29 14:23:17', system: 'PUMP-MUD-03', message: 'Pump bearing temperature...', code: 'ALM-2024-1247', acknowledged: false },
  { id: 'a3', severity: 'WARN', timestamp: '2024-12-29 14:23:17', system: 'ELEC-DIST-A', message: 'Phase imbalance detected...', code: 'ALM-2024-1247', acknowledged: false },
  { id: 'a4', severity: 'CRIT', timestamp: '2024-12-29 14:23:17', system: 'POWER-GEN-02', message: 'Oil pressure below minim...', code: 'ALM-2024-1247', acknowledged: true },
  { id: 'a5', severity: 'INFO', timestamp: '2024-12-29 14:23:17', system: 'DRILL-CTRL-01', message: 'Routine calibration cycl...', code: 'ALM-2024-1247', acknowledged: true },
  { id: 'a6', severity: 'CRIT', timestamp: '2024-12-29 14:23:17', system: 'POWER-GEN-02', message: 'Routine calibration cycl...', code: 'ALM-2024-1247', acknowledged: true },
  { id: 'a7', severity: 'INFO', timestamp: '2024-12-29 14:23:17', system: 'PUMP-MUD-01', message: 'Flow rate variance excee...', code: 'ALM-2024-1247', acknowledged: true },
  { id: 'a8', severity: 'WARN', timestamp: '2024-12-29 14:23:17', system: 'SAFETY-ESD', message: 'Weekly ESD system test c...', code: 'ALM-2024-1247', acknowledged: true },
];