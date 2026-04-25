import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, DatePicker, Space } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { statisticsStore } from '@/stores';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DashboardPage = observer(() => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => {
    const today = dayjs();
    return [today.startOf('month'), today];
  });

  useEffect(() => {
    const [startDate, endDate] = dateRange;
    statisticsStore.fetchStatistics(
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD'),
    );
  }, []);

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      statisticsStore.fetchStatistics(startDate, endDate);
    }
  };

  return (
    <div className="dashboard-page" style={{ padding: 24 }}>
      <Card
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>数据看板</span>}
        className="filter-card"
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            <span>统计时间：</span>
            <RangePicker value={dateRange} onChange={handleDateChange} />
          </Space>
        }
      />

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={statisticsStore.totalUsers}
              prefix={<UserOutlined />}
              suffix="人"
              loading={statisticsStore.isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={statisticsStore.newUsersToday}
              prefix={<TeamOutlined />}
              suffix="人"
              loading={statisticsStore.isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日活跃"
              value={statisticsStore.activeUsersToday}
              prefix={<TeamOutlined />}
              suffix="人"
              loading={statisticsStore.isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总帖子数"
              value={statisticsStore.totalPosts}
              prefix={<FileTextOutlined />}
              suffix="条"
              loading={statisticsStore.isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="积分统计">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="积分发放总额"
                  value={statisticsStore.totalPointsIssued}
                  prefix={<DollarOutlined />}
                  loading={statisticsStore.isLoading}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="积分消费总额"
                  value={statisticsStore.totalPointsConsumed}
                  prefix={<DollarOutlined />}
                  loading={statisticsStore.isLoading}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="内容统计">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="总帖子数"
                  value={statisticsStore.totalPosts}
                  prefix={<FileTextOutlined />}
                  loading={statisticsStore.isLoading}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="总评论数"
                  value={statisticsStore.totalComments}
                  prefix={<FileTextOutlined />}
                  loading={statisticsStore.isLoading}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default DashboardPage;
