import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';

export interface ICustomerChartProps {
  customers: number[];
}

export function CustomerChart({ customers }: ICustomerChartProps) {
  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: 'spline',
        height: 200,
      },
      title: {
        text: null,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        title: {
          text: null,
        },
        lineWidth: 0,
        tickWidth: 0,
        tickPixelInterval: 30,
        gridLineWidth: 0,
        labels: {
          enabled: false,
        },
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1,
          },
        },
      },
      series: [
        {
          data: customers,
        },
      ],
    };
  }, [customers]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}
