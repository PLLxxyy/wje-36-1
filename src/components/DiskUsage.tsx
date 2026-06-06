import type { ServerData } from '../types';

interface Props {
  servers: ServerData[];
}

export default function DiskUsage({ servers }: Props) {
  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-200 mb-3">磁盘使用率</h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {servers.map((srv) => {
          const color = srv.disk > 85 ? 'bg-danger' : srv.disk > 60 ? 'bg-warning' : 'bg-success';
          return (
            <div key={srv.id}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{srv.hostname}</span>
                <span>{srv.disk}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className={`${color} h-2.5 rounded-full transition-all duration-700`}
                  style={{ width: `${srv.disk}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
