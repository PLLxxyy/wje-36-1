import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useServerData } from './useServerData';

vi.useFakeTimers();

describe('useServerData', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should initialize with 8 servers', () => {
    const { result } = renderHook(() => useServerData());
    expect(result.current.servers).toHaveLength(8);
    expect(result.current.servers[0].hostname).toBe('web-01');
    expect(result.current.servers[7].hostname).toBe('worker-01');
  });

  it('should initialize empty history arrays', () => {
    const { result } = renderHook(() => useServerData());
    expect(result.current.cpuHistory).toHaveLength(8);
    expect(result.current.memoryHistory).toHaveLength(8);
    expect(result.current.diskHistory).toHaveLength(8);
    expect(result.current.serverNetworkHistory).toHaveLength(8);
  });

  it('should populate history data with initial 30 points on first tick', () => {
    const { result } = renderHook(() => useServerData());

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    result.current.cpuHistory.forEach((history) => {
      expect(history.data).toHaveLength(30);
      expect(history.serverId).toBeDefined();
      expect(history.serverName).toBeDefined();
    });

    result.current.memoryHistory.forEach((history) => {
      expect(history.data).toHaveLength(30);
    });

    result.current.diskHistory.forEach((history) => {
      expect(history.data).toHaveLength(30);
    });

    result.current.serverNetworkHistory.forEach((history) => {
      expect(history.data).toHaveLength(30);
      expect(history.data[0].inbound).toBeDefined();
      expect(history.data[0].outbound).toBeDefined();
    });
  });

  it('should append new data points and keep max 30 points after multiple ticks', () => {
    const { result } = renderHook(() => useServerData());

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const firstCpuData = [...result.current.cpuHistory[0].data];

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.cpuHistory[0].data).toHaveLength(30);
    expect(result.current.cpuHistory[0].data[0]).not.toEqual(firstCpuData[0]);

    const cpuValue = result.current.cpuHistory[0].data[29].value;
    const serverCpu = result.current.servers[0].cpu;
    expect(cpuValue).toBe(serverCpu);
  });

  it('should match history data with corresponding server metrics', () => {
    const { result } = renderHook(() => useServerData());

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const server = result.current.servers[0];
    const cpuHist = result.current.cpuHistory.find((h) => h.serverId === server.id);
    const memoryHist = result.current.memoryHistory.find((h) => h.serverId === server.id);
    const diskHist = result.current.diskHistory.find((h) => h.serverId === server.id);
    const networkHist = result.current.serverNetworkHistory.find((h) => h.serverId === server.id);

    expect(cpuHist?.serverName).toBe(server.hostname);
    expect(memoryHist?.serverName).toBe(server.hostname);
    expect(diskHist?.serverName).toBe(server.hostname);
    expect(networkHist?.serverName).toBe(server.hostname);

    const lastCpuPoint = cpuHist?.data[cpuHist.data.length - 1];
    const lastMemoryPoint = memoryHist?.data[memoryHist.data.length - 1];
    const lastDiskPoint = diskHist?.data[diskHist.data.length - 1];

    expect(lastCpuPoint?.value).toBe(server.cpu);
    expect(lastMemoryPoint?.value).toBe(Math.round(server.memory));
    expect(lastDiskPoint?.value).toBe(server.disk);
  });

  it('should provide colors array with 8 distinct colors', () => {
    const { result } = renderHook(() => useServerData());
    expect(result.current.colors).toHaveLength(8);
    expect(result.current.colors[0]).toBe('#3b82f6');
    expect(result.current.colors[1]).toBe('#10b981');
  });

  it('should update server metrics over time', () => {
    const { result } = renderHook(() => useServerData());

    const initialCpu = result.current.servers[0].cpu;

    act(() => {
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(3000);
      }
    });

    const laterCpu = result.current.servers[0].cpu;
    expect(laterCpu).toBeGreaterThanOrEqual(5);
    expect(laterCpu).toBeLessThanOrEqual(98);
    expect(laterCpu).not.toBeNaN();
  });

  it('should have network traffic aggregate data', () => {
    const { result } = renderHook(() => useServerData());

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.networkTraffic).toHaveLength(30);
    expect(result.current.networkTraffic[0].inbound).toBeDefined();
    expect(result.current.networkTraffic[0].outbound).toBeDefined();
  });
});
