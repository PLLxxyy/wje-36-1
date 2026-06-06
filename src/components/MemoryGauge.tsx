import ReactECharts from 'echarts-for-react';
import type { ServerData } from '../types';

interface Props {
  servers: ServerData[];
}

export default function MemoryGauge({ servers }: Props) {
  const avgMemory = Math.round(servers.reduce((s, srv) => s + srv.memory, 0) / (servers.length || 1));

  const option = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: { color: '#3b82f6' },
        progress: { show: true, width: 18 },
        pointer: { show: true, length: '70%', width: 4 },
        axisLine: { lineStyle: { width: 18, color: [[1, '#1f2937']] } },
        axisTick: { distance: -25, splitNumber: 5, lineStyle: { width: 1, color: '#4b5563' } },
        splitLine: { distance: -32, length: 10, lineStyle: { width: 2, color: '#4b5563' } },
        axisLabel: { distance: -14, color: '#9ca3af', fontSize: 10 },
        anchor: { show: true, size: 16, itemStyle: { borderColor: '#3b82f6', borderWidth: 2 } },
        title: { show: true, offsetCenter: [0, '70%'], fontSize: 14, color: '#e5e7eb' },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          offsetCenter: [0, '40%'],
          formatter: '{value}%',
          color: '#e5e7eb',
        },
        data: [{ value: avgMemory, name: '平均内存使用率' }],
      },
    ],
  };

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">内存使用率</h3>
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
