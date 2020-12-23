import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, addRule, removeRule, calcRule, multicalcRule, updatePrice } from './service';
// import {string} from "prop-types";
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const handleCalc = async (fields) => {
  const hide = message.loading('正在更新');

  try {
    await calcRule({
      key:String(fields.key),
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};
const handleMultiCalc = async (selectedRows) => {
  const hide = message.loading('正在更新');
  if (!selectedRows) return true;

  try {
    await multicalcRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('更新成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败，请重试');
    return false;
  }
};

const handleUpdatePrice=(_code) => {
  // pooling to update price data in the server.
  updatePrice({code:_code});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTimeout(handleUpdatePrice,600000,_code);
};
handleUpdatePrice("000905.SH");

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      tip: '序号是唯一的 key',
      valueType: 'int',
      hideInForm: true,
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: false, // if not specified, auto-generated in the backend.
            message: '序号不能重复',
          },
        ],
      },
    },
    {
      title: '当前日期',
      dataIndex: 'Date',
      sorter: true,
      hideInTable: true,
      hideInSearch: true,
      valueType: 'date',// type can also be dateTime
    },
    {
      title: '名称',
      dataIndex: 'name',
      sorter: true,
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '凭证类型',
      dataIndex: 'Type',
      valueType: 'textarea',
    },
    {
      title: '挂钩标的',
      dataIndex: 'Underlying',
      valueType: 'textarea',
    },
    {
      title: '价格水平',
      dataIndex: 'PriceLevel',
      sorter: true,
      filter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val) => `${(val*100).toFixed(2)} %`,
    },
    {
      title: '份额价值',
      dataIndex: 'Value',
      sorter: true,
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
      renderText: (val) => `${(val*1).toFixed(4)}`,
    },
    {
      title: '敲出水平',
      dataIndex: 'KnockOut',
      sorter: true,
      hideInTable: true,
      renderText: (val) => `${(val*100).toFixed(2)} %`,
    },
    {
      title: '行权水平',
      dataIndex: 'Strike',
      sorter: true,
      hideInTable: true,
      renderText: (val) => `${(val*100).toFixed(2)} %`,
    },
    {
      title: '敲入水平',
      dataIndex: 'KnockIn',
      sorter: true,
      hideInTable: true,
      renderText: (val) => `${(val*100).toFixed(2)} %`,
    },
    {
      title: '票面利率',
      dataIndex: 'Rate',
      sorter: true,
      hideInTable: true,
      renderText: (val) => `${(val*100).toFixed(2)} %`,
    },
    {
      title: '付息基准',
      dataIndex: 'CouponCondition',
      sorter: true,
      hideInTable: true,
      renderText: (val) => val ? `${(val*100).toFixed(2)} %` : val, // if val===0, consider it as null
    },
    {
      title: '状态',
      dataIndex: 'Status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '已终止',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
        2: {
          text: '警告',
          status: 'Error',
        },
      },
    },
    {
      title: '期初观察日',
      dataIndex: 'StartDate',
      sorter: true,
      valueType: 'date',// type can also be dateTime
    },
    {
      title: '期末观察日',
      dataIndex: 'LastObserveDate',
      hideInTable: true,
      hideInSearch: true,
      valueType: 'date',// type can also be dateTime
    },
    {
      title: '到期日',
      dataIndex: 'Maturity',
      sorter: true,
      valueType: 'date',// type can also be dateTime
    },
    {
      title: '终止日',
      dataIndex: 'TerminateDate',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      valueType: 'date',// type can also be dateTime
    },
    {
      title: '最后更新日期',
      dataIndex: 'LastUpdate',
      sorter: true,
      valueType: 'date',// type can also be dateTime
      hideInForm: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: '敲出观察日',
      dataIndex: 'KnockOutObserveDate',
      tip: '格式：all或者yyyy/mm/dd,yyyy/mm/dd,...',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '敲入观察日',
      dataIndex: 'KnockInObserveDate',
      tip: '格式：all或者yyyy/mm/dd,yyyy/mm/dd,...',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '付息观察日',
      dataIndex: 'CouponObserveDate',
      tip: '格式：all或者yyyy/mm/dd,yyyy/mm/dd,...',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '份额面值',
      dataIndex: 'ParValue',
      sorter: true,
      hideInTable: true,
      hideInSearch: true,
      renderText: (val) => `${(val*1).toFixed(2)}`,
    },
    {
      title: '凭证份额',
      dataIndex: 'ContractNumber',
      sorter: true,
      hideInTable: true,
      hideInSearch: true,
      renderText: (val) => `${(val*1).toFixed(2)}`,
    },
    {
      title: '是否自动推断营业日',
      dataIndex: 'BusinessDateInfer',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        0: {
          text: '否',
          status: 'Processing',
        },
      },
    },
    {
      title: '是否自动推断交易日',
      dataIndex: 'TradingDateInfer',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        0: {
          text: '否',
          status: 'Processing',
        },
      },
    },
    {
      title: '营业日节假日',
      dataIndex: 'BusinessHoliday',
      tip: '格式：yyyy/mm/dd,yyyy/mm/dd,...',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '交易日节假日',
      dataIndex: 'TradingHoliday',
      tip: '格式：yyyy/mm/dd,yyyy/mm/dd,...',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '是否终止',
      dataIndex: 'IsTerminated',
      hideInTable: true,
      hideInForm: true,
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        0: {
          text: '否',
          status: 'Processing',
        },
      },
    },
    {
      title: '是否敲出',
      dataIndex: 'IsKnockOut',
      hideInTable: true,
      hideInForm: true,
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        0: {
          text: '否',
          status: 'Processing',
        },
      },
    },
    {
      title: '是否敲入',
      dataIndex: 'IsKnockIn',
      hideInTable: true,
      hideInForm: true,
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        0: {
          text: '否',
          status: 'Processing',
        },
      },
    },
    {
      title: '约定收益率',
      dataIndex: 'AgreedRate',
      tip: '鲨鱼鳍专属',
      hideInTable: true,
      hideInSearch: true,
      renderText: (val) => val ? `${(val*100).toFixed(2)} %` : val,
    },
    {
      title: '期望涨幅',
      dataIndex: 'ExpectedReturn',
      tip: '鲨鱼鳍专属',
      hideInTable: true,
      hideInSearch: true,
      renderText: (val) => val ? `${(val*100).toFixed(2)} %` : val,
    },
    {
      title: '涨幅差乘数',
      dataIndex: 'ReturnMultiplier',
      tip: '鲨鱼鳍专属',
      hideInTable: true,
      hideInSearch: true,
      renderText: (val) => val ? `${(val*100).toFixed(2)} %` : val,
    },
    {
      title: '最低收益率',
      dataIndex: 'MinRate',
      tip: '鲨鱼鳍专属',
      hideInTable: true,
      hideInSearch: true,
      renderText: (val) => val ? `${(val*100).toFixed(2)} %` : val,
    },
    {
      title: '预警类型',
      dataIndex: 'WarningType',
      valueType: 'textarea',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '距离敲出日天数',
      dataIndex: 'DaysToKnockOut',
      valueType: 'int',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '距离敲出价格水平',
      dataIndex: 'PriceToKnockOut',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val) => val ? `${(val*100).toFixed(2)} %` : val,
    },
    {
      title: '距离敲入日天数',
      dataIndex: 'DaysToKnockIn',
      valueType: 'int',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '距离敲入价格水平',
      dataIndex: 'PriceToKnockIn',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val) => val ? `${(val*100).toFixed(2)} %` : val,
    },
    {
      title: '距离付息日天数',
      dataIndex: 'DaysToCoupon',
      valueType: 'int',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '距离付息基准价格水平',
      dataIndex: 'PriceToCoupon',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val) => val ? `${(val*100).toFixed(2)} %` : val,
    },
    {
      title: '付息金额',
      dataIndex: 'Coupon',
      valueType: 'double',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val) => val ? `${(val*1).toFixed(4)}` : val,
    },
    {
      title: '距离到期日天数',
      dataIndex: 'DaysToMaturity',
      valueType: 'int',
      hideInTable: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              await handleCalc(record);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            更新
          </a>
          <Divider type="vertical" />
           <a href="https://pro.ant.design/">详情</a> {/* 导引至详情页面 */}
        </>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
              <span>
                未终止合约总计 {selectedRowsState.length - selectedRowsState.reduce((pre, item) => pre + item.IsTerminated, 0)} 条
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary"
                  onClick={async () =>{
                    await handleMultiCalc(selectedRowsState);
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }}
          >
            批量更新
          </Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async (value) => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
