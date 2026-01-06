export enum Status {
  NOMINAL = 'NOM',
  WARNING = 'WRN',
  CRITICAL = 'CRT',
  INFO = 'INF'
}

export interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: Status;
  alarms: number;
  subValue: string;
}

export interface TelemetryPoint {
  time: string;
  value: number;
  threshold: number;
}

export interface TelemetryChannel {
  id: string;
  name: string;
  currentValue: number;
  unit: string;
  threshold: number;
  data: TelemetryPoint[];
  color: string;
}

export interface DiagnosticItem {
  id: string;
  name: string;
  parameter: string;
  current: number;
  nominal: number;
  tolerance: string;
  deviation: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
}

export interface AlarmItem {
  id: string;
  severity: 'CRIT' | 'WARN' | 'INFO';
  timestamp: string;
  system: string;
  message: string;
  code: string;
  acknowledged: boolean;
}

export interface LapData {
  lap: number;
  s1: string;
  s2: string;
  s3: string;
  lapTime: string;
  tyre: string;
  s1Status: 'purple' | 'green' | 'yellow' | 'normal';
  s2Status: 'purple' | 'green' | 'yellow' | 'normal';
  s3Status: 'purple' | 'green' | 'yellow' | 'normal';
}