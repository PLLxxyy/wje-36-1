import CpuChart from './components/CpuChart';
import MemoryGauge from './components/MemoryGauge';
import DiskUsage from './components/DiskUsage';
import NetworkChart from './components/NetworkChart';
import ServerCards from './components/ServerCards';
import { useServerData } from './hooks/useServerData';
import { Server, Activity } from 'lucide-react';

export default function App() {
  const { servers, cpuHistory, networkTraffic, colors } = useServerData();
  const onlineCount = servers.filter((s) => s.status !== 'offline').length;
  const warningCount = servers.filter((s) => s.status === 'warning').length;

  return (
    <div className="w-screen h-screen bg-dashboard-bg text-gray-100 flex flex-col p-4 gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Server className="text-accent" size={28} />
          <h1 className="text-xl font-bold tracking-wide">服务器资源监控大屏</h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-gray-400">在线</span>
            <span className="font-semibold text-gray-200">{onlineCount}/{servers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-danger" />
            <span className="text-gray-400">告警</span>
            <span className="font-semibold text-danger">{warningCount}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Activity size={16} />
            <span>实时刷新中</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
        {/* Left: CPU Chart */}
        <div className="col-span-12 lg:col-span-5 min-h-0">
          <CpuChart data={cpuHistory} colors={colors} />
        </div>

        {/* Center: Network */}
        <div className="col-span-12 lg:col-span-4 min-h-0">
          <NetworkChart data={networkTraffic} />
        </div>

        {/* Right: Memory + Disk */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <MemoryGauge servers={servers} />
          </div>
          <div className="flex-1 min-h-0">
            <DiskUsage servers={servers} />
          </div>
        </div>
      </div>

      {/* Bottom: Server Cards */}
      <div className="shrink-0">
        <ServerCards servers={servers} />
      </div>
    </div>
  );
}
