import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ServerDetailModal from './ServerDetailModal';
import type { ServerData, MetricHistory, NetworkHistory } from '../types';

const mockServer: ServerData = {
  id: 'srv-0',
  hostname: 'web-01',
  status: 'online',
  uptime: '5天12小时30分',
  cpu: 45,
  memory: 62.5,
  disk: 78,
  networkIn: 1000000,
  networkOut: 500000,
};

const generateTimeSeries = (value: number) =>
  Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, value }));

const mockCpuData: MetricHistory = {
  serverId: 'srv-0',
  serverName: 'web-01',
  data: generateTimeSeries(45),
};

const mockMemoryData: MetricHistory = {
  serverId: 'srv-0',
  serverName: 'web-01',
  data: generateTimeSeries(63),
};

const mockDiskData: MetricHistory = {
  serverId: 'srv-0',
  serverName: 'web-01',
  data: generateTimeSeries(78),
};

const mockNetworkData: NetworkHistory = {
  serverId: 'srv-0',
  serverName: 'web-01',
  data: Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, inbound: 10, outbound: 5 })),
};

describe('ServerDetailModal', () => {
  it('should not render when server is null', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ServerDetailModal
        server={null}
        cpuData={undefined}
        memoryData={undefined}
        diskData={undefined}
        networkData={undefined}
        onClose={onClose}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render server hostname and status', () => {
    const onClose = vi.fn();
    render(
      <ServerDetailModal
        server={mockServer}
        cpuData={mockCpuData}
        memoryData={mockMemoryData}
        diskData={mockDiskData}
        networkData={mockNetworkData}
        onClose={onClose}
      />
    );

    expect(screen.getByText('web-01')).toBeInTheDocument();
    expect(screen.getByText('在线')).toBeInTheDocument();
  });

  it('should render warning status badge correctly', () => {
    const warningServer = { ...mockServer, status: 'warning' as const };
    const onClose = vi.fn();
    render(
      <ServerDetailModal
        server={warningServer}
        cpuData={mockCpuData}
        memoryData={mockMemoryData}
        diskData={mockDiskData}
        networkData={mockNetworkData}
        onClose={onClose}
      />
    );

    expect(screen.getByText('告警')).toBeInTheDocument();
  });

  it('should render offline status badge correctly', () => {
    const offlineServer = { ...mockServer, status: 'offline' as const };
    const onClose = vi.fn();
    render(
      <ServerDetailModal
        server={offlineServer}
        cpuData={mockCpuData}
        memoryData={mockMemoryData}
        diskData={mockDiskData}
        networkData={mockNetworkData}
        onClose={onClose}
      />
    );

    expect(screen.getByText('离线')).toBeInTheDocument();
  });

  it('should render four metric overview cards', () => {
    const onClose = vi.fn();
    render(
      <ServerDetailModal
        server={mockServer}
        cpuData={mockCpuData}
        memoryData={mockMemoryData}
        diskData={mockDiskData}
        networkData={mockNetworkData}
        onClose={onClose}
      />
    );

    expect(screen.getByText('运行时间')).toBeInTheDocument();
    expect(screen.getByText('5天12小时30分')).toBeInTheDocument();

    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();

    expect(screen.getByText('内存')).toBeInTheDocument();
    expect(screen.getByText('63%')).toBeInTheDocument();

    expect(screen.getByText('磁盘')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
  });

  it('should render four ECharts for CPU, Memory, Disk, and Network', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ServerDetailModal
        server={mockServer}
        cpuData={mockCpuData}
        memoryData={mockMemoryData}
        diskData={mockDiskData}
        networkData={mockNetworkData}
        onClose={onClose}
      />
    );

    const charts = container.querySelectorAll('[data-testid="echarts-mock"]');
    expect(charts.length).toBe(4);

    const chartTitles = Array.from(charts).map((c) => c.getAttribute('data-chart-title'));
    expect(chartTitles).toContain('CPU 使用率');
    expect(chartTitles).toContain('内存使用率');
    expect(chartTitles).toContain('磁盘使用率');
    expect(chartTitles).toContain('网络流量');
  });

  it('should render network chart with inbound and outbound series', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ServerDetailModal
        server={mockServer}
        cpuData={mockCpuData}
        memoryData={mockMemoryData}
        diskData={mockDiskData}
        networkData={mockNetworkData}
        onClose={onClose}
      />
    );

    const networkChart = container.querySelector('[data-chart-title="网络流量"]');
    expect(networkChart).toBeInTheDocument();

    const seriesData = networkChart?.getAttribute('data-series');
    if (seriesData) {
      const series = JSON.parse(seriesData);
      expect(series).toContain('上行');
      expect(series).toContain('下行');
    }
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ServerDetailModal
        server={mockServer}
        cpuData={mockCpuData}
        memoryData={mockMemoryData}
        diskData={mockDiskData}
        networkData={mockNetworkData}
        onClose={onClose}
      />
    );

    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render modal overlay with backdrop blur', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ServerDetailModal
        server={mockServer}
        cpuData={mockCpuData}
        memoryData={mockMemoryData}
        diskData={mockDiskData}
        networkData={mockNetworkData}
        onClose={onClose}
      />
    );

    const overlay = container.firstChild;
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('inset-0');
    expect(overlay).toHaveClass('bg-black/70');
    expect(overlay).toHaveClass('backdrop-blur-sm');
  });

  it('should handle undefined history data gracefully', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ServerDetailModal
        server={mockServer}
        cpuData={undefined}
        memoryData={undefined}
        diskData={undefined}
        networkData={undefined}
        onClose={onClose}
      />
    );

    const charts = container.querySelectorAll('[data-testid="echarts-mock"]');
    expect(charts.length).toBe(4);
  });
});
