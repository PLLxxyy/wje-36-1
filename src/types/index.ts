export interface ServerData {
  id: string;
  hostname: string;
  status: 'online' | 'offline' | 'warning';
  uptime: string;
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
}

export interface MetricHistory {
  serverId: string;
  serverName: string;
  data: TimeSeriesPoint[];
}

export interface NetworkHistory {
  serverId: string;
  serverName: string;
  data: {
    time: string;
    inbound: number;
    outbound: number;
  }[];
}

export interface NetworkTraffic {
  time: string;
  inbound: number;
  outbound: number;
}
