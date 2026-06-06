import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import * as useServerDataModule from './hooks/useServerData';
import type { ServerData, MetricHistory, NetworkHistory } from './types';

vi.mock('./hooks/useServerData');

const mockServers: ServerData[] = [
  {
    id: 'srv-0',
    hostname: 'web-01',
    status: 'online',
    uptime: '5天12小时30分',
    cpu: 45,
    memory: 62.5,
    disk: 78,
    networkIn: 1000000,
    networkOut: 500000,
  },
  {
    id: 'srv-1',
    hostname: 'db-01',
    status: 'warning',
    uptime: '2天8小时15分',
    cpu: 92,
    memory: 85.3,
    disk: 90,
    networkIn: 2000000,
    networkOut: 1500000,
  },
  {
    id: 'srv-2',
    hostname: 'api-01',
    status: 'online',
    uptime: '10天5小时45分',
    cpu: 55,
    memory: 70.2,
    disk: 65,
    networkIn: 1500000,
    networkOut: 800000,
  },
];

const generateHistory = (serverId: string, serverName: string, value: number): MetricHistory => ({
  serverId,
  serverName,
  data: Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, value })),
});

const generateNetworkHistory = (serverId: string, serverName: string): NetworkHistory => ({
  serverId,
  serverName,
  data: Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, inbound: 10, outbound: 5 })),
});

const mockCpuHistory = mockServers.map((s) => generateHistory(s.id, s.hostname, s.cpu));
const mockMemoryHistory = mockServers.map((s) => generateHistory(s.id, s.hostname, Math.round(s.memory)));
const mockDiskHistory = mockServers.map((s) => generateHistory(s.id, s.hostname, s.disk));
const mockServerNetworkHistory = mockServers.map((s) => generateNetworkHistory(s.id, s.hostname));
const mockNetworkTraffic = Array.from({ length: 30 }, (_, i) => ({
  time: `${i}`,
  inbound: 100,
  outbound: 80,
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useServerDataModule, 'useServerData').mockReturnValue({
      servers: mockServers,
      cpuHistory: mockCpuHistory,
      memoryHistory: mockMemoryHistory,
      diskHistory: mockDiskHistory,
      serverNetworkHistory: mockServerNetworkHistory,
      networkTraffic: mockNetworkTraffic,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
    });
  });

  it('should render overview dashboard with server cards', () => {
    render(<App />);

    expect(screen.getByText('服务器资源监控大屏')).toBeInTheDocument();
    expect(screen.getByText('web-01')).toBeInTheDocument();
    expect(screen.getByText('db-01')).toBeInTheDocument();
    expect(screen.getByText('api-01')).toBeInTheDocument();
    expect(screen.getByText('在线')).toBeInTheDocument();
    expect(screen.getByText('告警')).toBeInTheDocument();
  });

  it('should show correct online and warning counts in header', () => {
    render(<App />);

    expect(screen.getByText('2/3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should open detail modal when clicking a server card', () => {
    render(<App />);

    expect(screen.queryByText('运行时间')).not.toBeInTheDocument();

    const web01Card = screen.getByText('web-01').closest('[class*="rounded-xl"]');
    expect(web01Card).toBeInTheDocument();

    if (web01Card) {
      fireEvent.click(web01Card);
    }

    expect(screen.getByText('运行时间')).toBeInTheDocument();
    expect(screen.getByText('5天12小时30分')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('should display correct server data in modal for warning server', () => {
    render(<App />);

    const db01Card = screen.getByText('db-01').closest('[class*="rounded-xl"]');
    expect(db01Card).toBeInTheDocument();

    if (db01Card) {
      fireEvent.click(db01Card);
    }

    expect(screen.getByText('db-01')).toBeInTheDocument();
    expect(screen.getByText('告警')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('should render four charts in the detail modal', () => {
    const { container } = render(<App />);

    const web01Card = screen.getByText('web-01').closest('[class*="rounded-xl"]');
    if (web01Card) {
      fireEvent.click(web01Card);
    }

    const charts = container.querySelectorAll('[data-testid="echarts-mock"]');
    const chartTitles = Array.from(charts).map((c) => c.getAttribute('data-chart-title'));

    expect(chartTitles).toContain('CPU 使用率');
    expect(chartTitles).toContain('内存使用率');
    expect(chartTitles).toContain('磁盘使用率');
    expect(chartTitles).toContain('网络流量');
  });

  it('should close modal and return to overview when clicking close button', () => {
    render(<App />);

    const web01Card = screen.getByText('web-01').closest('[class*="rounded-xl"]');
    if (web01Card) {
      fireEvent.click(web01Card);
    }

    expect(screen.getByText('运行时间')).toBeInTheDocument();

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(screen.queryByText('运行时间')).not.toBeInTheDocument();
    expect(screen.getByText('web-01')).toBeInTheDocument();
    expect(screen.getByText('db-01')).toBeInTheDocument();
  });

  it('should preserve overview layout after closing modal', () => {
    render(<App />);

    const cpuChartTitle = screen.getByText('CPU 使用率趋势');
    const networkChartTitle = screen.getByText('网络流量');
    const memoryGaugeTitle = screen.getByText('内存使用率');
    const diskUsageTitle = screen.getByText('磁盘使用率');

    const web01Card = screen.getByText('web-01').closest('[class*="rounded-xl"]');
    if (web01Card) {
      fireEvent.click(web01Card);
    }

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(cpuChartTitle).toBeInTheDocument();
    expect(networkChartTitle).toBeInTheDocument();
    expect(memoryGaugeTitle).toBeInTheDocument();
    expect(diskUsageTitle).toBeInTheDocument();

    expect(screen.getByText('web-01')).toBeInTheDocument();
    expect(screen.getByText('db-01')).toBeInTheDocument();
    expect(screen.getByText('api-01')).toBeInTheDocument();

    expect(screen.getByText('服务器资源监控大屏')).toBeInTheDocument();
    expect(screen.getByText('实时刷新中')).toBeInTheDocument();
  });

  it('should open modal for different servers independently', () => {
    render(<App />);

    const web01Card = screen.getByText('web-01').closest('[class*="rounded-xl"]');
    if (web01Card) {
      fireEvent.click(web01Card);
    }
    expect(screen.getByText('web-01')).toBeInTheDocument();

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    const api01Card = screen.getByText('api-01').closest('[class*="rounded-xl"]');
    if (api01Card) {
      fireEvent.click(api01Card);
    }

    expect(screen.getByText('api-01')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('should pass correct history data based on selected server', () => {
    const { container } = render(<App />);

    const web01Card = screen.getByText('web-01').closest('[class*="rounded-xl"]');
    if (web01Card) {
      fireEvent.click(web01Card);
    }

    const charts = container.querySelectorAll('[data-testid="echarts-mock"]');
    expect(charts.length).toBeGreaterThanOrEqual(4);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    const db01Card = screen.getByText('db-01').closest('[class*="rounded-xl"]');
    if (db01Card) {
      fireEvent.click(db01Card);
    }

    const chartsAfter = container.querySelectorAll('[data-testid="echarts-mock"]');
    expect(chartsAfter.length).toBeGreaterThanOrEqual(4);
  });

  it('should have cursor pointer on server cards in overview', () => {
    const { container } = render(<App />);

    const cards = container.querySelectorAll('[class*="rounded-xl"]');
    const serverCards = Array.from(cards).filter((card) =>
      card.className.includes('cursor-pointer')
    );

    expect(serverCards.length).toBeGreaterThan(0);
  });
});
