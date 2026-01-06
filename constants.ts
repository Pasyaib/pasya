import { SystemMetric, Status, TelemetryChannel, DiagnosticItem, AlarmItem, LapData } from './types';

export const SYSTEM_METRICS: SystemMetric[] = [
  { id: 'm1', name: 'Velocity', value: 324, unit: 'KPH', status: Status.NOMINAL, alarms: 0, subValue: 'SEC 2' },
  { id: 'm2', name: 'RPM', value: 11850, unit: '', status: Status.NOMINAL, alarms: 0, subValue: 'GEAR 7' },
  { id: 'm3', name: 'ERS Batt', value: 34, unit: '%', status: Status.WARNING, alarms: 1, subValue: 'HARVEST' },
  { id: 'm4', name: 'Brake Temp', value: 890, unit: '°C', status: Status.WARNING, alarms: 2, subValue: 'FRONT R' },
  { id: 'm5', name: 'Tire Wear', value: 72, unit: '%', status: Status.NOMINAL, alarms: 0, subValue: 'SOFT C3' },
  { id: 'm6', name: 'Downforce', value: 1850, unit: 'KG', status: Status.NOMINAL, alarms: 0, subValue: 'DRS ON' },
  { id: 'm7', name: 'Tire Pressure', value: 22.1, unit: 'PSI', status: Status.NOMINAL, alarms: 0, subValue: 'OPTIMAL' },
  { id: 'm8', name: 'Engine Temp', value: 112, unit: '°C', status: Status.NOMINAL, alarms: 0, subValue: 'ICE' },
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
    name: 'Speed Trace',
    currentValue: 324,
    unit: 'KPH',
    threshold: 340,
    color: '#00ba7c', // Green
    data: generateTelemetryData(320, 10, 50, 340)
  },
  {
    id: 't2',
    name: 'Throttle Map',
    currentValue: 98,
    unit: '%',
    threshold: 100,
    color: '#1d9bf0', // Blue
    data: generateTelemetryData(95, 5, 50, 100)
  },
  {
    id: 't3',
    name: 'Brake Pressure',
    currentValue: 12,
    unit: 'BAR',
    threshold: 150,
    color: '#f91880', // Red/Pink
    data: generateTelemetryData(10, 60, 50, 150)
  },
  {
    id: 't4',
    name: 'Steering Angle',
    currentValue: 4,
    unit: 'DEG',
    threshold: 180,
    color: '#ffd400', // Amber
    data: generateTelemetryData(0, 45, 50, 180)
  }
];

export const DIAGNOSTICS_DATA: DiagnosticItem[] = [
  { id: 'PU-01', name: 'ICE Unit', parameter: 'Oil Pressure', current: 5.2, nominal: 5.0, tolerance: '±0.5', deviation: 4.00, unit: 'Bar', status: 'good' },
  { id: 'PU-02', name: 'MGU-K', parameter: 'Torque Demand', current: 124, nominal: 120, tolerance: '±10', deviation: 3.33, unit: 'Nm', status: 'good' },
  { id: 'PU-03', name: 'Energy Store', parameter: 'Cell Temp', current: 62.4, nominal: 60.0, tolerance: '±5.0', deviation: 4.00, unit: '°C', status: 'warning' },
  { id: 'HYD-01', name: 'Hydraulics', parameter: 'Main Pressure', current: 205, nominal: 240, tolerance: '±20', deviation: 14.58, unit: 'Bar', status: 'critical' },
  { id: 'AERO-F', name: 'Front Wing', parameter: 'Flap Angle', current: 28.5, nominal: 28.5, tolerance: '±0.1', deviation: 0.00, unit: 'deg', status: 'good' },
  { id: 'AERO-R', name: 'DRS Actuator', parameter: 'Response', current: 12, nominal: 10, tolerance: '±2', deviation: 20.00, unit: 'ms', status: 'good' },
  { id: 'COOL-L', name: 'Rad Inlet L', parameter: 'Air Flow', current: 14.5, nominal: 15.0, tolerance: '±1.0', deviation: 3.33, unit: 'm/s', status: 'good' },
  { id: 'GBX-01', name: 'Gearbox', parameter: 'Shift Time', current: 32, nominal: 30, tolerance: '±5', deviation: 6.66, unit: 'ms', status: 'good' },
];

export const ALARMS_DATA: AlarmItem[] = [
  { id: 'a1', severity: 'CRIT', timestamp: 'LAP 14', system: 'HYDRAULICS', message: 'Main circuit pressure loss detected', code: 'HYD-LOW', acknowledged: false },
  { id: 'a2', severity: 'WARN', timestamp: 'LAP 14', system: 'STRATEGY', message: 'Tire deg higher than expected', code: 'TYRE-DEG', acknowledged: false },
  { id: 'a3', severity: 'INFO', timestamp: 'LAP 13', system: 'RACE CTRL', message: 'Blue flags - Car 44 behind', code: 'FLAG-BLU', acknowledged: true },
  { id: 'a4', severity: 'WARN', timestamp: 'LAP 12', system: 'ERS-MGMT', message: 'Harvest rate suboptimal T4', code: 'ERS-EFF', acknowledged: true },
  { id: 'a5', severity: 'INFO', timestamp: 'LAP 12', system: 'PIT WALL', message: 'Box Box this lap, confirm', code: 'CMD-BOX', acknowledged: true },
  { id: 'a6', severity: 'CRIT', timestamp: 'LAP 10', system: 'ICE-TEMP', message: 'Cylinder 4 temp spike', code: 'ENG-THM', acknowledged: true },
];

export const LAP_DATA: LapData[] = [
  { lap: 14, s1: '24.102', s2: '38.441', s3: '20.110', lapTime: '1:22.653', tyre: 'S', s1Status: 'green', s2Status: 'green', s3Status: 'yellow' },
  { lap: 13, s1: '24.255', s2: '38.305', s3: '20.095', lapTime: '1:22.655', tyre: 'S', s1Status: 'yellow', s2Status: 'purple', s3Status: 'purple' },
  { lap: 12, s1: '24.150', s2: '38.500', s3: '20.200', lapTime: '1:22.850', tyre: 'S', s1Status: 'green', s2Status: 'yellow', s3Status: 'yellow' },
  { lap: 11, s1: '24.300', s2: '38.600', s3: '20.300', lapTime: '1:23.200', tyre: 'S', s1Status: 'yellow', s2Status: 'yellow', s3Status: 'yellow' },
  { lap: 10, s1: '24.180', s2: '38.450', s3: '20.150', lapTime: '1:22.780', tyre: 'S', s1Status: 'green', s2Status: 'yellow', s3Status: 'green' },
  { lap: 9,  s1: '24.400', s2: '38.700', s3: '20.400', lapTime: '1:23.500', tyre: 'S', s1Status: 'yellow', s2Status: 'yellow', s3Status: 'yellow' },
  { lap: 8,  s1: '25.100', s2: '39.000', s3: '21.000', lapTime: '1:25.100', tyre: 'M', s1Status: 'normal', s2Status: 'normal', s3Status: 'normal' },
  { lap: 7,  s1: '25.200', s2: '39.100', s3: '21.100', lapTime: '1:25.400', tyre: 'M', s1Status: 'normal', s2Status: 'normal', s3Status: 'normal' },
];