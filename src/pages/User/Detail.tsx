import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tabs,
  Image,
  Tag,
  Button,
  Space,
  message,
  Spin,
  Progress,
  Empty,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { profileApi, UserProfile, UserInterest, UserPhoto, UserMatePreference } from '@/services/profile';
import { formatDateTime } from '@/utils/format';

// 完整度详情类型
interface CompletenessDetails {
  score: number;
  level: string;
  missingFields: string[];
}

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [matePreferences, setMatePreferences] = useState<UserMatePreference | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessDetails | null>(null);

  useEffect(() => {
    if (id) {
      loadUserDetail(Number(id));
    }
  }, [id]);

  // 清理音频资源
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const loadUserDetail = async (userId: number) => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        profileApi.getProfile(userId),
        profileApi.getInterests(userId),
        profileApi.getPhotos(userId),
        profileApi.getMatePreferences(userId),
        profileApi.getCompletenessDetails(userId),
      ]);

      // 处理基础资料（必需）
      if (results[0].status === 'fulfilled') {
        setProfile(results[0].value);
      } else {
        message.error('加载用户资料失败');
        return;
      }

      // 处理兴趣爱好（可选）
      if (results[1].status === 'fulfilled') {
        setInterests(results[1].value);
      } else {
        console.error('加载兴趣爱好失败:', results[1].reason);
      }

      // 处理照片（可选）
      if (results[2].status === 'fulfilled') {
        setPhotos(results[2].value);
      } else {
        console.error('加载照片失败:', results[2].reason);
      }

      // 处理择偶偏好（可选）
      if (results[3].status === 'fulfilled') {
        setMatePreferences(results[3].value);
      } else {
        console.error('加载择偶偏好失败:', results[3].reason);
      }

      // 处理完整度（可选）
      if (results[4].status === 'fulfilled') {
        setCompleteness(results[4].value);
      } else {
        console.error('加载完整度失败:', results[4].reason);
      }
    } catch (error: any) {
      message.error(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return <Empty description="用户资料不存在" />;
  }

  const tabItems = [
    {
      key: 'basic',
      label: '基础信息',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="真实姓名">{profile.realName || '-'}</Descriptions.Item>
            <Descriptions.Item label="出生日期">{profile.birthDate || '-'}</Descriptions.Item>
            <Descriptions.Item label="家乡">{profile.hometown || '-'}</Descriptions.Item>
            <Descriptions.Item label="现居地">{profile.residence || '-'}</Descriptions.Item>
            <Descriptions.Item label="身高">{profile.height ? `${profile.height}cm` : '-'}</Descriptions.Item>
            <Descriptions.Item label="体重">{profile.weight ? `${profile.weight}kg` : '-'}</Descriptions.Item>
            <Descriptions.Item label="职业">{profile.occupation || '-'}</Descriptions.Item>
            <Descriptions.Item label="收入范围">{profile.incomeRange || '-'}</Descriptions.Item>
            <Descriptions.Item label="学历">{profile.education || '-'}</Descriptions.Item>
            <Descriptions.Item label="个人简介" span={2}>{profile.bio || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'appearance',
      label: '外貌体征',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="体型">{profile.bodyType || '-'}</Descriptions.Item>
            <Descriptions.Item label="星座">{profile.zodiacSign || '-'}</Descriptions.Item>
            <Descriptions.Item label="生肖">{profile.chineseZodiac || '-'}</Descriptions.Item>
            <Descriptions.Item label="脸型">{profile.faceShape || '-'}</Descriptions.Item>
            <Descriptions.Item label="是否戴眼镜">
              {profile.hasGlasses !== undefined ? (profile.hasGlasses ? '是' : '否') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="是否有纹身">
              {profile.hasTattoo !== undefined ? (profile.hasTattoo ? '是' : '否') : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'education',
      label: '教育职业',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="毕业院校">{profile.graduateSchool || '-'}</Descriptions.Item>
            <Descriptions.Item label="专业">{profile.major || '-'}</Descriptions.Item>
            <Descriptions.Item label="行业">{profile.industry || '-'}</Descriptions.Item>
            <Descriptions.Item label="公司">{profile.company || '-'}</Descriptions.Item>
            <Descriptions.Item label="工作年限">
              {profile.workYears !== undefined ? `${profile.workYears}年` : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'family',
      label: '家庭背景',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="籍贯">{profile.nativePlace || '-'}</Descriptions.Item>
            <Descriptions.Item label="家庭成员数">
              {profile.familyMembers !== undefined ? `${profile.familyMembers}人` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="家中排行">{profile.familyRanking || '-'}</Descriptions.Item>
            <Descriptions.Item label="父母职业">{profile.parentsOccupation || '-'}</Descriptions.Item>
            <Descriptions.Item label="是否独生子女">
              {profile.isOnlyChild !== undefined ? (profile.isOnlyChild ? '是' : '否') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="家庭经济状况">{profile.familyEconomic || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'marital',
      label: '婚恋状况',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="婚姻状况">{profile.maritalStatus || '-'}</Descriptions.Item>
            <Descriptions.Item label="是否有孩子">
              {profile.hasChildren !== undefined ? (profile.hasChildren ? '是' : '否') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="孩子数量">
              {profile.childrenCount !== undefined ? `${profile.childrenCount}个` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="孩子信息">{profile.childrenInfo || '-'}</Descriptions.Item>
            <Descriptions.Item label="结婚计划" span={2}>{profile.marriagePlan || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'assets',
      label: '资产状况',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="住房状况">{profile.housingStatus || '-'}</Descriptions.Item>
            <Descriptions.Item label="购车状况">{profile.carStatus || '-'}</Descriptions.Item>
            <Descriptions.Item label="房产位置">{profile.housingLocation || '-'}</Descriptions.Item>
            <Descriptions.Item label="车辆品牌">{profile.carBrand || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'lifestyle',
      label: '生活方式',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="吸烟状况">{profile.smokingStatus || '-'}</Descriptions.Item>
            <Descriptions.Item label="饮酒状况">{profile.drinkingStatus || '-'}</Descriptions.Item>
            <Descriptions.Item label="作息时间">{profile.sleepSchedule || '-'}</Descriptions.Item>
            <Descriptions.Item label="运动频率">{profile.exerciseFrequency || '-'}</Descriptions.Item>
            <Descriptions.Item label="饮食偏好">{profile.dietPreference || '-'}</Descriptions.Item>
            <Descriptions.Item label="是否养宠物">
              {profile.hasPets !== undefined ? (profile.hasPets ? '是' : '否') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="宠物类型">{profile.petType || '-'}</Descriptions.Item>
            <Descriptions.Item label="厨艺水平">{profile.cookingSkill || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'personality',
      label: '个性展示',
      children: (
        <Card>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="个性标签">
              {profile.personalityTags && profile.personalityTags.length > 0 ? (
                <Space wrap>
                  {profile.personalityTags.map((tag, index) => (
                    <Tag key={index} color="blue">{tag}</Tag>
                  ))}
                </Space>
              ) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="自我介绍">{profile.selfIntroduction || '-'}</Descriptions.Item>
            <Descriptions.Item label="内心独白">{profile.innerMonologue || '-'}</Descriptions.Item>
            <Descriptions.Item label="语音介绍">
              {profile.voiceIntroUrl ? (
                <audio ref={audioRef} controls src={profile.voiceIntroUrl} />
              ) : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'interests',
      label: '兴趣爱好',
      children: (
        <Card>
          {interests.length > 0 ? (
            <Space wrap>
              {interests.map((interest) => (
                <Tag key={interest.id} color="green">
                  {interest.name} (Lv.{interest.level})
                </Tag>
              ))}
            </Space>
          ) : (
            <Empty description="暂无兴趣爱好" />
          )}
        </Card>
      ),
    },
    {
      key: 'photos',
      label: '照片墙',
      children: (
        <Card>
          {photos.length > 0 ? (
            <Image.PreviewGroup>
              <Space wrap>
                {photos.map((photo, index) => (
                  <div key={photo.id} style={{ position: 'relative' }}>
                    <Image
                      width={150}
                      height={150}
                      src={photo.photoUrl}
                      alt={`${profile?.realName || '用户'}的照片${index + 1}`}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                    {photo.isAvatar && (
                      <Tag color="blue" style={{ position: 'absolute', top: 5, right: 5 }}>
                        头像
                      </Tag>
                    )}
                    {photo.isCertified && (
                      <Tag color="green" style={{ position: 'absolute', top: 5, left: 5 }}>
                        已认证
                      </Tag>
                    )}
                  </div>
                ))}
              </Space>
            </Image.PreviewGroup>
          ) : (
            <Empty description="暂无照片" />
          )}
        </Card>
      ),
    },
    {
      key: 'mate',
      label: '择偶偏好',
      children: (
        <Card>
          {matePreferences ? (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="年龄范围">
                {matePreferences.ageMin && matePreferences.ageMax
                  ? `${matePreferences.ageMin}-${matePreferences.ageMax}岁`
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="身高范围">
                {matePreferences.heightMin && matePreferences.heightMax
                  ? `${matePreferences.heightMin}-${matePreferences.heightMax}cm`
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="学历要求">{matePreferences.educationRequirement || '-'}</Descriptions.Item>
              <Descriptions.Item label="收入要求">{matePreferences.incomeRequirement || '-'}</Descriptions.Item>
              <Descriptions.Item label="地域要求">{matePreferences.locationRequirement || '-'}</Descriptions.Item>
              <Descriptions.Item label="接受异地">
                {matePreferences.acceptLongDistance !== undefined
                  ? (matePreferences.acceptLongDistance ? '是' : '否')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="婚姻状况要求">{matePreferences.maritalStatusRequirement || '-'}</Descriptions.Item>
              <Descriptions.Item label="接受有孩子">
                {matePreferences.acceptChildren !== undefined
                  ? (matePreferences.acceptChildren ? '是' : '否')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="住房要求">{matePreferences.housingRequirement || '-'}</Descriptions.Item>
              <Descriptions.Item label="购车要求">{matePreferences.carRequirement || '-'}</Descriptions.Item>
              <Descriptions.Item label="吸烟要求">{matePreferences.smokingRequirement || '-'}</Descriptions.Item>
              <Descriptions.Item label="饮酒要求">{matePreferences.drinkingRequirement || '-'}</Descriptions.Item>
              <Descriptions.Item label="其他要求" span={2}>{matePreferences.otherRequirements || '-'}</Descriptions.Item>
              <Descriptions.Item label="理想型描述" span={2}>{matePreferences.idealTypeDescription || '-'}</Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="暂无择偶偏好" />
          )}
        </Card>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>用户详情 - ID: {id}</span>
        </Space>
      </Card>

      {/* 资料完整度 */}
      {completeness && (
        <Card title="资料完整度" style={{ marginBottom: 16 }}>
          <Progress
            percent={completeness.score}
            status={completeness.score >= 80 ? 'success' : 'normal'}
            format={(percent) => `${percent}% (${completeness.level})`}
          />
          {completeness.missingFields && completeness.missingFields.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>缺失字段：</div>
              <Space wrap>
                {completeness.missingFields.map((field: string, index: number) => (
                  <Tag key={index} color="orange">{field}</Tag>
                ))}
              </Space>
            </div>
          )}
        </Card>
      )}

      {/* 详细信息 */}
      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default UserDetail;
