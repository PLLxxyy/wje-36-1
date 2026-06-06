import { X } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import type { MetricHistory, NetworkHistory, ServerData } from '../types';

interface Props {
  server: ServerData | null;
  cpuData: MetricHistory | undefined;
  memoryData: MetricHistory | undefined;
  diskData: MetricHistory | undefined;
  networkData: NetworkHistory | undefined;
  onClose: () => void;
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

function getLineOption(
  data: MetricHistory | undefined,
  color: string,
  unit: string,
  title: string
) {
  return {
    backgroundColor: 'transparent',
    title: {
      text: title,
      textStyle: { color: '#e5e7eb', fontSize: 14, fontWeight: 'semibold' },
      left: 0,
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,24,39,0.9)',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' },
    },
    grid: { left: 48, right: 16, top: 40, bottom: 24 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data?.data.map((p) => p.time) || [],
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1f2937' } },
      axisLabel: { color: '#9ca3af', formatter: `{value}${unit}` },
    },
    series: [
      {
        name: title,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: color + '40' },
              { offset: 1, color: color + '05' },
            ],
          },
        },
        data: data?.data.map((p) => p.value) || [],
      },
    ],
  };
}

function getNetworkOption(data: NetworkHistory | undefined) {
  return {
    backgroundColor: 'transparent',
    title: {
      text: '网络流量',
      textStyle: { color: '#e5e7eb', fontSize: 14, fontWeight: 'semibold' },
      left: 0,
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,24,39,0.9)',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' },
    },
    legend: {
      data: ['上行', '下行'],
      textStyle: { color: '#9ca3af' },
      top: 0,
      right: 0,
    },
    grid: { left: 48, right: 16, top: 40, bottom: 24 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data?.data.map((p) => p.time) || [],
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1f2937' } },
      axisLabel: { color: '#9ca3af', formatter: '{value} MB/s' },
    },
    series: [
      {
        name: '上行',
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: { color: 'rgba(239,68,68,0.25)' },
        lineStyle: { color: '#ef4444', width: 2 },
        data: data?.data.map((p) => p.outbound) || [],
      },
      {
        name: '下行',
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: { color: 'rgba(59,130,246,0.25)' },
        lineStyle: { color: '#3b82f6', width: 2 },
        data: data?.data.map((p) => p.inbound) || [],
      },
    ],
  };
}

export default function ServerDetailModal({
  server,
  cpuData,
  memoryData,
  diskData,
  networkData,
  onClose,
}: Props) {
  if (!server) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
      <div className="bg-panel-bg rounded-2xl border border-gray-800 w-full max-w-7xl max-h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-100">{server.hostname}</h2>
            <StatusBadge status={server.status} />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">运行时间</div>
              <div className="text-lg font-semibold text-gray-200">{server.uptime}</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">CPU</div>
              <div className="text-lg font-semibold text-blue-400">{server.cpu}%</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">内存</div>
              <div className="text-lg font-semibold text-emerald-400">{Math.round(server.memory)}%</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">磁盘</div>
              <div className="text-lg font-semibold text-amber-400">{server.disk}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 h-72">
              <ReactECharts option={getLineOption(cpuData, '#3b82f6', '%', 'CPU 使用率')} style={{ height: '100%', width: '100%' }} />
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 h-72">
              <ReactECharts option={getLineOption(memoryData, '#10b981', '%', '内存使用率')} style={{ height: '100%', width: '100%' }} />
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 h-72">
              <ReactECharts option={getLineOption(diskData, '#f59e0b', '%', '磁盘使用率')} style={{ height: '100%', width: '100%' }} />
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 h-72">
              <ReactECharts option={getNetworkOption(networkData)} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
