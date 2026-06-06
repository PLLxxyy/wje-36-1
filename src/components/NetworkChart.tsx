import ReactECharts from 'echarts-for-react';
import type { NetworkTraffic } from '../types';

interface Props {
  data: NetworkTraffic[];
}

export default function NetworkChart({ data }: Props) {
  const option = {
    backgroundColor: 'transparent',
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
    },
    grid: { left: 48, right: 16, top: 40, bottom: 24 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((d) => d.time),
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
        stack: 'Total',
        areaStyle: { color: 'rgba(239,68,68,0.25)' },
        lineStyle: { color: '#ef4444', width: 2 },
        data: data.map((d) => d.outbound),
      },
      {
        name: '下行',
        type: 'line',
        smooth: true,
        showSymbol: false,
        stack: 'Total',
        areaStyle: { color: 'rgba(59,130,246,0.25)' },
        lineStyle: { color: '#3b82f6', width: 2 },
        data: data.map((d) => d.inbound),
      },
    ],
  };

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">网络流量</h3>
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
