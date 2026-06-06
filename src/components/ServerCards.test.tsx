import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ServerCards from './ServerCards';
import type { ServerData } from '../types';

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
    hostname: 'cache-01',
    status: 'offline',
    uptime: '0分',
    cpu: 0,
    memory: 0,
    disk: 45,
    networkIn: 0,
    networkOut: 0,
  },
];

describe('ServerCards', () => {
  it('should render all server cards', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    expect(screen.getByText('web-01')).toBeInTheDocument();
    expect(screen.getByText('db-01')).toBeInTheDocument();
    expect(screen.getByText('cache-01')).toBeInTheDocument();
  });

  it('should display server metrics correctly', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    expect(screen.getByText('CPU 45%')).toBeInTheDocument();
    expect(screen.getByText('内存 63%')).toBeInTheDocument();
    expect(screen.getByText('磁盘 78%')).toBeInTheDocument();
    expect(screen.getByText('5天12小时30分')).toBeInTheDocument();
  });

  it('should display correct status badges', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    expect(screen.getByText('在线')).toBeInTheDocument();
    expect(screen.getByText('告警')).toBeInTheDocument();
    expect(screen.getByText('离线')).toBeInTheDocument();
  });

  it('should call onCardClick with correct server when card is clicked', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    const web01Card = screen.getByTestId('server-card-srv-0');
    fireEvent.click(web01Card);

    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).toHaveBeenCalledWith(mockServers[0]);
  });

  it('should call onCardClick for warning server', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    const db01Card = screen.getByTestId('server-card-srv-1');
    fireEvent.click(db01Card);

    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).toHaveBeenCalledWith(mockServers[1]);
  });

  it('should have cursor pointer style on cards', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    mockServers.forEach((srv) => {
      const card = screen.getByTestId(`server-card-${srv.id}`);
      expect(card.className).toContain('cursor-pointer');
    });
  });

  it('should apply warning animation class to warning servers', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    const warningCard = screen.getByTestId('server-card-srv-1');
    expect(warningCard.className).toContain('animate-flash-red');
  });

  it('should render cards with correct data-testid', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    expect(screen.getByTestId('server-card-srv-0')).toBeInTheDocument();
    expect(screen.getByTestId('server-card-srv-1')).toBeInTheDocument();
    expect(screen.getByTestId('server-card-srv-2')).toBeInTheDocument();
  });

  it('should not call onCardClick when not clicked', () => {
    const onCardClick = vi.fn();
    render(<ServerCards servers={mockServers} onCardClick={onCardClick} />);

    expect(onCardClick).not.toHaveBeenCalled();
  });
});
