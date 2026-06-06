import { useState, useEffect, useCallback } from 'react';
import type { ServerData, CpuHistory, NetworkTraffic } from '../types';
import { getCurrentTimeLabel, formatUptime } from '../utils/helpers';

const SERVER_NAMES = ['web-01', 'web-02', 'api-01', 'api-02', 'db-01', 'db-02', 'cache-01', 'worker-01'];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function generateInitialServers(): ServerData[] {
  return SERVER_NAMES.map((name, i) => ({
    id: `srv-${i}`,
    hostname: name,
    status: Math.random() > 0.9 ? 'warning' : 'online',
    uptime: formatUptime(Math.floor(Math.random() * 10080)),
    cpu: Math.floor(Math.random() * 60) + 10,
    memory: Math.floor(Math.random() * 70) + 20,
    disk: Math.floor(Math.random() * 80) + 10,
    networkIn: Math.floor(Math.random() * 5000000),
    networkOut: Math.floor(Math.random() * 3000000),
  }));
}

function updateServers(prev: ServerData[]): ServerData[] {
  return prev.map((srv) => {
    const cpuChange = (Math.random() - 0.5) * 20;
    const newCpu = Math.max(5, Math.min(98, srv.cpu + cpuChange));
    const status: ServerData['status'] = newCpu > 90 ? 'warning' : Math.random() > 0.98 ? 'offline' : 'online';
    return {
      ...srv,
      status,
      cpu: Math.round(newCpu),
      memory: Math.max(10, Math.min(95, srv.memory + (Math.random() - 0.5) * 10)),
      networkIn: Math.max(0, srv.networkIn + Math.floor((Math.random() - 0.5) * 1000000)),
      networkOut: Math.max(0, srv.networkOut + Math.floor((Math.random() - 0.5) * 800000)),
    };
  });
}

export function useServerData() {
  const [servers, setServers] = useState<ServerData[]>(generateInitialServers);
  const [cpuHistory, setCpuHistory] = useState<CpuHistory[]>([]);
  const [networkTraffic, setNetworkTraffic] = useState<NetworkTraffic[]>([]);

  const tick = useCallback(() => {
    setServers((prev) => {
      const next = updateServers(prev);
      const time = getCurrentTimeLabel();

      setCpuHistory((hist) => {
        const updated = next.map((srv, i) => {
          const existing = hist.find((h) => h.serverId === srv.id);
          const data = existing ? [...existing.data, { time, value: srv.cpu }].slice(-30) : Array.from({ length: 30 }, (_, j) => ({ time: `${j}`, value: srv.cpu }));
          return { serverId: srv.id, serverName: srv.hostname, data };
        });
        return updated;
      });

      setNetworkTraffic((traf) => {
        const totalIn = next.reduce((s, srv) => s + srv.networkIn, 0);
        const totalOut = next.reduce((s, srv) => s + srv.networkOut, 0);
        const nextTraf = [...traf, { time, inbound: Math.round(totalIn / 1024 / 1024), outbound: Math.round(totalOut / 1024 / 1024) }].slice(-30);
        return nextTraf;
      });

      return next;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 3000);
    return () => clearInterval(interval);
  }, [tick]);

  return { servers, cpuHistory, networkTraffic, colors: COLORS };
}
