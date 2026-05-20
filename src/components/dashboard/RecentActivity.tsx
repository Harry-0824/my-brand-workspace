import {
  Panel,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  TimelineList,
  TimelineRow,
  TimelineMarker,
  ActivityDetails,
  ActivityAction,
  ActivityProject,
  ActivityTime,
  TypeBadge
} from "./RecentActivity.styles";

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
