import ReactECharts from 'echarts-for-react';
import type { CpuHistory } from '../types';

interface Props {
  data: CpuHistory[];
  colors: string[];
}

export default function CpuChart({ data, colors }: Props) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,24,39,0.9)',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' },
    },
    legend: {
      data: data.map((d) => d.serverName),
      textStyle: { color: '#9ca3af' },
      top: 0,
    },
    grid: { left: 48, right: 16, top: 40, bottom: 24 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data[0]?.data.map((p) => p.time) || [],
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1f2937' } },
      axisLabel: { color: '#9ca3af', formatter: '{value}%' },
    },
    series: data.map((srv, i) => ({
      name: srv.serverName,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color: colors[i % colors.length] },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: colors[i % colors.length] + '40' },
            { offset: 1, color: colors[i % colors.length] + '05' },
          ],
        },
      },
      data: srv.data.map((p) => p.value),
    })),
  };

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">CPU 使用率趋势</h3>
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
