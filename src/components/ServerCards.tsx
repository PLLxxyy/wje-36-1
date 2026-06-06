import { Activity, Clock, HardDrive, Cpu } from 'lucide-react';
import type { ServerData } from '../types';

interface Props {
  servers: ServerData[];
}

function StatusBadge({ status }: { status: ServerData['status'] }) {
  const map = {
    online: { text: '在线', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
    offline: { text: '离线', cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    warning: { text: '告警', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };
  const s = map[status];
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${s.cls}`}>{s.text}</span>
  );
}

export default function ServerCards({ servers }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {servers.map((srv) => {
        const isWarning = srv.status === 'warning';
        return (
          <div
            key={srv.id}
            className={`rounded-xl p-3 border transition-all duration-500 ${
              isWarning
                ? 'animate-flash-red border-red-500/50'
                : 'bg-panel-bg border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-200">{srv.hostname}</span>
              <StatusBadge status={srv.status} />
            </div>
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>{srv.uptime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu size={12} />
                <span>CPU {srv.cpu}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={12} />
                <span>内存 {Math.round(srv.memory)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive size={12} />
                <span>磁盘 {srv.disk}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
