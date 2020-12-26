import { PageContainer } from '@ant-design/pro-layout';
import React, { Component, useState, useEffect } from 'react';
import echarts from 'echarts/lib/echarts';
import {Spin, DatePicker, Space, message, Divider} from 'antd';
import styles from './index.less';
import { chartPriceRule, chartStatisticsRule_1, chartStatisticsRule_2, chartStatisticsRule_3 } from './service';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/boxplot';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom';
import { prepareBoxplotData } from 'echarts/extension/dataTool';

const { RangePicker } = DatePicker;
const palette = [
  '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
  '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
  '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
  '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089',
];

class EchartsTest extends Component {
  constructor(P,S){
    super(P,S);
    this.option_000905 = { // initialization
      color: palette,
      title: {
        text: '中证500日收盘价',
        subtext: '数据源：wind',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['中证000905.SH','中证000905.SH 价格水平'],
      },
      dataZoom: [
        {
          type: 'inside',
          show: true,
          xAxisIndex: [0,1],
          start: 5,
          end: 95,
        },
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0,1],
          start: 5,
          end: 95,
        },
      ],
      grid: [
        {
          left: '10%',
          right: '10%',
          bottom: '45%',
        },
        {
          left: '10%',
          right: '10%',
          height: '17%',
          bottom: '15%',
        }
      ],
      xAxis: [
        {
          data: [],
        },
        {
          gridIndex: 1,
          data: [],
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: (val) => `${(val*1).toFixed(2)}`,
          },
          max: (val)=>val.max*1.1,
          min: (val)=>val.min-100,
        },
        {
          type: 'value',
          gridIndex: 1,
          axisLabel: {
            formatter: (val) => `${(val*100).toFixed(2)} %`,
          },
          max: (val)=>val.max*1.1,
          min: (val)=>val.min*0.9,
        },
      ],
      series: [
        {
          name: '中证000905.SH',
          type: 'line',
          data: [],
        },
        {
          name: '中证000905.SH 价格水平',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          areaStyle: {},
          data: [],
        },
      ],
    };
    this.option_statistics_1= {
      color: palette,
      title: {
        text: "收益凭证分类",
        subtext: "数据源：wind",
      },
      tooltip: {
        trigger: 'item',
        // formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend:{
        data: [],
      },
      grid: [
        {left: '50%', right: '7%', width: 'auto', height: '70%'},// 折线图位置控制
      ],
      xAxis: [
        {
          name: '发行年份',
          type: 'category',
          gridIndex: 0,
          data: [],
          axisTick: {
            show: true,
          }
        }
      ],
      yAxis: [
        {
          name: '数量',
          type: 'value',
          show: true,
          gridIndex: 0,
        }
      ],
      series: [
        {
          name: '未终止凭证',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['25%', '50%'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              color: palette,
              fontSize: 26,
              fontWeight: 'bold',
              formatter: '{b}: {d}%',
            }
          },
          labelLine: {
            show: false
          },
          data: [],
        },
      ]
    };
    this.option_statistics_2 = {
      color: palette,
      title: {
        text: "Autocall类敲入敲出水平分布",
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        top: 'middle',
        data: ['敲出水平频数', '敲出水平pdf', '敲入水平频数','敲入水平pdf','1m价格水平分布','3m价格水平分布','6m价格水平分布','12m价格水平分布'],
      },
      grid: [
        {
          left: '10%',
          right: 200,
          bottom: '35%',
        },
        {
          left: '10%',
          right: 200,
          height: '17%',
          bottom: '10%',
          tooltip: {
            show: false,
            formatter: '{b1}: {c1}',
          }
        }
      ],
      xAxis: [
        {
          type: 'category',
          gridIndex: 0,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            formatter: (val) => `${(val*100).toFixed(2)} %`,
          },
          data: [],
        },
        {
          name: '价格水平',
          type: 'category',
          gridIndex: 1,
          axisLabel: {
            formatter: (val) => `${(val*100).toFixed(2)} %`,
          },
          data: [],
        },
      ],
      yAxis: [
        {
          type: 'value',
          gridIndex: 0,
          name: '频数',
          position: 'left',
          formetter: (val) => `${(val*100).toFixed(2)}`,
        },
        {
          type: 'value',
          gridIndex: 0,
          name: 'pdf',
          position: 'right',
          formatter: (val) => `${(val*100).toFixed(2)} %`,
        },
        {
          show: false,
          type: 'value',
          gridIndex: 1,
          name: 'pdf',
          position: 'right',
          formatter: (val) => `${(val*100).toFixed(2)} %`,
        },
      ],
      series: [],
    };
    this.option_statistics_3= {
      // color: palette,
      title: {
        text: "存续期统计",
      },
      tooltip: {
        trigger: 'item',
        // formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend:{
        data: ['存续天数','存续天数离群值','未终止合约距离到期天数','距离到期天数离群值'],
      },
      grid: [
        {left: '7%', right: '7%', width: 'auto', height: '75%'},// 折线图位置控制
      ],
      xAxis: [{
        type: 'category',
        data: [],
        boundaryGap: true,
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: {
          show: true
        }
      }],
      yAxis: [
        {
          name: '天数',
          type: 'value',
          splitArea: {
            show: true
          },
          gridIndex: 0,
        }
      ],
      series: [
        {
          name: '存续天数',
          type: 'boxplot',
          data: [],
          tooltip: {
            formatter: function (param) {
              return [
                param.name + ': ',
                'upper: ' + param.data[5],
                'Q3: ' + param.data[4],
                'median: ' + param.data[3],
                'Q1: ' + param.data[2],
                'lower: ' + param.data[1]
              ].join('<br/>');
            }
          }
        },
        {
          name: '存续天数离群值',
          type: 'scatter',
          data: [],
        },
        {
          name: '未终止合约距离到期天数',
          type: 'boxplot',
          data: [],
          tooltip: {
            formatter: function (param) {
              return [
                param.name + ': ',
                'upper: ' + param.data[5],
                'Q3: ' + param.data[4],
                'median: ' + param.data[3],
                'Q1: ' + param.data[2],
                'lower: ' + param.data[1]
              ].join('<br/>');
            }
          }
        },
        {
          name: '距离到期天数离群值',
          type: 'scatter',
          data: [],
        },
      ],
    };
  }

  handleChartPriceUpdate = async (_dates,option,chart,_codes) => {
    // console.log(_dates);
    try {
      await chartPriceRule({dates: _dates,codes:_codes}).then((data) => {
        this[option].xAxis[0].data = data.date;
        this[option].xAxis[1].data = data.date;
        this[option].series[0].data = data.price[0];
        this[option].series[1].data = data.price_level[0];
        return data;
      })
      message.success('数据读取成功，即将刷新');
      this[chart].setOption(this[option]);
      return true;
    }
    catch (error){
      message.error('数据读取失败，请重试');
      return false;
    }
  };

  handleChartStatisticsUpdate_1 = async (option,chart) => {
    try{
      await chartStatisticsRule_1({}).then((data)=>{
        this[option].series=[this[option].series[0]]; //clear
        this[option].series[0].data=[]; //clear
        for (let i=0;i<data.data_1.x.length;i++) {
          this[option].series[0].data.push({
            value: data.data_1.y[i],
            name: data.data_1.x[i],
          });
        };
        this[option].legend.data=data.data_2.legend;
        this[option].xAxis[0].data=[...(data.data_2.x)];
        for (let i=0;i<data.data_2.legend.length;i++){
          this[option].series.push({
            name: data.data_2.legend[i],
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: data.data_2.y[i],
          });
        };
        return data;
      })
      console.log(this[option]);
      this[chart].setOption(this[option]);
      // message.success('数据读取成功，即将刷新');
      return true;
    }
    catch(error){
      message.error('数据读取失败，请重试');
      return false;
    }
  }

  handleChartStatisticsUpdate_2 = async (option,chart) => {
    try{
      await chartStatisticsRule_2({}).then((data)=>{
        console.log(data);
        this[option].series=[]; // clear
        this[option].xAxis[0].data=data.KnockOut.center;
        this[option].xAxis[1].data=data.price_level_pdf.x;
        this[option].series.push({
          name: '敲出水平频数',
          type: 'bar',
          yAxisIndex: 0,
          data: data.KnockOut.hist,
        });
        this[option].series.push({
          name: '敲出水平pdf',
          type: 'line',
          yAxisIndex: 1,
          data: data.KnockOut.pdf,
        });
        this[option].series.push({
          name: '敲入水平频数',
          type: 'bar',
          yAxisIndex: 0,
          data: data.KnockIn.hist,
        });
        this[option].series.push({
          name: '敲入水平pdf',
          type: 'line',
          yAxisIndex: 1,
          data: data.KnockIn.pdf,
        });
        this[option].series.push({
          name: '1m价格水平分布',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 2,
          areaStyle: {},
          data: data.price_level_pdf.pdf_1m,
        });
        this[option].series.push({
          name: '3m价格水平分布',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 2,
          areaStyle: {},
          data: data.price_level_pdf.pdf_3m,
        });
        this[option].series.push({
          name: '6m价格水平分布',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 2,
          areaStyle: {},
          data: data.price_level_pdf.pdf_6m,
        });
        this[option].series.push({
          name: '12m价格水平分布',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 2,
          areaStyle: {},
          data: data.price_level_pdf.pdf_12m,
        });
        return data;
      })
      this[chart].setOption(this[option]);
      // message.success('数据读取成功，即将刷新');
      return true;
    }
    catch(error){
      message.error('数据读取失败，请重试');
      return false;
    }
  };

  handleChartStatisticsUpdate_3 = async (option,chart) => {
    try{
      await chartStatisticsRule_3({}).then((data)=>{
        const survival_data = prepareBoxplotData(data.y1);
        this[option].xAxis[0].data=data.x;
        this[option].series[0].data=survival_data.boxData;
        this[option].series[1].data=survival_data.outliers;
        const residual_data = prepareBoxplotData(data.y2);
        this[option].series[2].data=residual_data.boxData;
        this[option].series[3].data=residual_data.outliers;
        return data;
      })
      this[chart].setOption(this[option]);
      // message.success('数据读取成功，即将刷新');
      return true;
    }
    catch(error){
      message.error('数据读取失败，请重试');
      return false;
    }
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    this.Chart_000905 = echarts.init(document.getElementById('price')); // 绘制图表
    this.Chart_000905.setOption(this.option_000905);
    this.Chart_statistics_1 = echarts.init(document.getElementById('statistics_1'));
    this.Chart_statistics_1.setOption(this.option_statistics_1);
    this.Chart_statistics_2 = echarts.init(document.getElementById('statistics_2'));
    this.Chart_statistics_2.setOption(this.option_statistics_2);
    this.Chart_statistics_3 = echarts.init(document.getElementById('statistics_3'));
    this.Chart_statistics_3.setOption(this.option_statistics_3);

    window.addEventListener('resize', () => {
      // console.log('resize');
      this.Chart_000905.resize();
      this.Chart_statistics_1.resize();
      this.Chart_statistics_2.resize();
      this.Chart_statistics_3.resize();
    });
  }

  render() {
    (async ()=>{
      // initialization
      await this.handleChartPriceUpdate([],"option_000905","Chart_000905",["000905.SH"]);
      await this.handleChartStatisticsUpdate_1("option_statistics_1","Chart_statistics_1");
      await this.handleChartStatisticsUpdate_2("option_statistics_2","Chart_statistics_2");
      await this.handleChartStatisticsUpdate_3("option_statistics_3","Chart_statistics_3");
    })();
    return (
      <PageContainer content="可视化总览" className={styles.main}>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        日期范围：
        <RangePicker
          onChange={async (_,dates)=>this.handleChartPriceUpdate(dates,"option_000905","Chart_000905",["000905.SH"])}
        />
        <body>
          <br/>
        </body>
        <div
          id="price"
          style={{
            width: '100%',
            height: 500,
          }}
        />
        <body>
        <br/>
        </body>
        <div
          id="statistics_1"
          style={{
            width: '100%',
            height: 500,
          }}
        />
        <body>
        <br/>
        </body>
        <div
          id="statistics_2"
          style={{
            width: '100%',
            height: 500,
          }}
        />
        <body>
        <br/>
        </body>
        <div
          id="statistics_3"
          style={{
            width: '100%',
            height: 500,
          }}
        />
      </PageContainer>
    );
  }
}

export default EchartsTest;
