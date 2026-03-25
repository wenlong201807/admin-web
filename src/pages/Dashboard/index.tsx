import { useEffect } from 'react';
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
  useEffect(() => {
    // debugger;
    console.log(888);
    statisticsStore.fetchStatistics('20260323', '20260324');
  }, []);

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      statisticsStore.fetchStatistics(startDate, endDate);
    }
  };

  return (
    <div className="dashboard-page">
      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Space>
          <span>统计时间：</span>
          <RangePicker onChange={handleDateChange} />
        </Space>
      </Card>

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
