import styled from "styled-components";

const recentActivities = [
  {
    action: "完成首頁線框調整",
    project: "品牌官網重設計",
    time: "今天 10:30",
    type: "設計"
  },
  {
    action: "新增購物車流程測試案例",
    project: "電商功能開發",
    time: "今天 09:15",
    type: "測試"
  },
  {
    action: "更新客戶提案內容",
    project: "客戶提案製作",
    time: "昨天 16:40",
    type: "文件"
  },
  {
    action: "完成正式環境部署檢查",
    project: "個人作品網站",
    time: "昨天 14:20",
    type: "部署"
  },
  {
    action: "追蹤客戶回覆狀態",
    project: "品牌官網重設計",
    time: "5 月 18 日",
    type: "溝通"
  }
] as const;

export function RecentActivity() {
  return (
    <Panel aria-labelledby="recent-activity-title">
      <SectionHeader>
        <div>
          <SectionTitle id="recent-activity-title">最近活動</SectionTitle>
          <SectionDescription>
            近期專案、任務與客戶溝通的更新紀錄。
          </SectionDescription>
        </div>
      </SectionHeader>

      <TimelineList>
        {recentActivities.map((activity) => (
          <TimelineRow aria-label={activity.action} key={`${activity.action}-${activity.time}`}>
            <TimelineMarker aria-hidden="true" />
            <ActivityDetails>
              <ActivityAction>{activity.action}</ActivityAction>
              <ActivityProject>{activity.project}</ActivityProject>
            </ActivityDetails>
            <ActivityTime>{activity.time}</ActivityTime>
            <TypeBadge>{activity.type}</TypeBadge>
          </TimelineRow>
        ))}
      </TimelineList>
    </Panel>
  );
}

const Panel = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.018)),
    ${({ theme }) => theme.surface};
  box-shadow: 0 22px 55px rgb(0 0 0 / 0.18);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.35rem;
  font-weight: 800;
`;

const SectionDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
`;

const TimelineList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const TimelineRow = styled.article`
  display: grid;
  grid-template-columns: auto minmax(13rem, 1.5fr) minmax(6rem, 0.7fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const TimelineMarker = styled.span`
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  border: 1px solid rgb(98 214 199 / 0.5);
  background: rgb(98 214 199 / 0.18);
  box-shadow: 0 0 0 0.3rem rgb(98 214 199 / 0.08);
`;

const ActivityDetails = styled.div`
  min-width: 0;
`;

const ActivityAction = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
`;

const ActivityProject = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
`;

const ActivityTime = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 700;
`;

const TypeBadge = styled.span`
  justify-self: end;
  padding: 0.45rem 0.72rem;
  border: 1px solid rgb(98 214 199 / 0.26);
  border-radius: 999px;
  color: ${({ theme }) => theme.accent};
  background: rgb(98 214 199 / 0.08);
  font-size: 0.8rem;
  font-weight: 800;
  white-space: nowrap;
`;
