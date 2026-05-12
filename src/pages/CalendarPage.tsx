import styled from "styled-components";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import {
  PageList,
  PageListCard,
  PageNote
} from "../components/page/PageContentPrimitives";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";

const weekOverview = [
  { day: "週一", item: "專案站會", time: "10:00", type: "會議" },
  { day: "週二", item: "首頁設計調整", time: "14:00", type: "深度工作" },
  { day: "週三", item: "客戶回饋檢視", time: "11:00", type: "回饋" },
  { day: "週四", item: "功能交付檢查", time: "16:00", type: "交付" },
  { day: "週五", item: "週報回顧", time: "15:30", type: "回顧" }
] as const;

const upcomingSchedule = [
  { title: "Bright Studio 進度會議", date: "5 月 21 日", tag: "客戶會議" },
  { title: "FlowMart 測試結果回報", date: "5 月 22 日", tag: "專案追蹤" },
  { title: "Northwind 提案審閱", date: "5 月 23 日", tag: "提案審查" }
] as const;

const milestoneTimeline = [
  { milestone: "首頁改版初稿", due: "5 月 24 日", status: "準備交付" },
  { milestone: "購物流程驗收", due: "5 月 26 日", status: "進行中" },
  { milestone: "提案最終版本", due: "5 月 28 日", status: "待確認" }
] as const;

const focusBlocks = [
  { block: "深度工作", time: "09:30 - 11:30", detail: "關鍵功能與版面製作" },
  { block: "客戶溝通", time: "13:30 - 14:30", detail: "回覆提問與同步進度" },
  { block: "行政整理", time: "17:00 - 17:30", detail: "收款追蹤與排程更新" }
] as const;

export function CalendarPage() {
  return (
    <PageMain aria-labelledby="calendar-page-title">
      <PageHeader>
        <PageTitle id="calendar-page-title">行事曆</PageTitle>
        <PageDescription>
          查看本週工作節奏、會議安排與交付里程碑的靜態排程頁面殼層。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="calendar-week-overview-title">
        <DashboardSectionHeader
          titleId="calendar-week-overview-title"
          title="本週概覽"
          description="以靜態示意顯示本週每日重點安排。"
          withDivider
        />
        <WeekGrid>
          {weekOverview.map((item) => (
            <WeekCard key={item.day}>
              <WeekDay>{item.day}</WeekDay>
              <WeekItem>{item.item}</WeekItem>
              <WeekMeta>{item.time} ・ {item.type}</WeekMeta>
            </WeekCard>
          ))}
        </WeekGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="calendar-upcoming-title">
        <DashboardSectionHeader
          titleId="calendar-upcoming-title"
          title="近期行程"
          description="接下來的會議、交付與審閱安排（靜態示意）。"
          withDivider
        />
        <List>
          {upcomingSchedule.map((item) => (
            <ListRow key={item.title}>
              <RowTitle>{item.title}</RowTitle>
              <RowMeta>{item.date} ・ {item.tag}</RowMeta>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="calendar-milestone-title">
        <DashboardSectionHeader
          titleId="calendar-milestone-title"
          title="里程碑時間線"
          description="追蹤交付節點與目前狀態（靜態佔位）。"
          withDivider
        />
        <List>
          {milestoneTimeline.map((item) => (
            <ListRow key={item.milestone}>
              <RowTitle>{item.milestone}</RowTitle>
              <RowMeta>{item.due} ・ {item.status}</RowMeta>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="calendar-focus-title">
        <DashboardSectionHeader
          titleId="calendar-focus-title"
          title="專注時段"
          description="安排深度工作、溝通與行政任務的固定區塊。"
          withDivider
        />
        <List>
          {focusBlocks.map((item) => (
            <ListRow key={item.block}>
              <RowTitle>{item.block}</RowTitle>
              <RowMeta>{item.time} ・ {item.detail}</RowMeta>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="calendar-note-title">
        <DashboardSectionHeader
          titleId="calendar-note-title"
          title="排程提醒"
          description="每週規劃備註（靜態文案示意）。"
          withDivider
        />
        <Note>
          週初先確認交付里程碑與客戶會議時段，週末前預留半天處理逾期項目與下週排程。
        </Note>
      </DashboardPanel>
    </PageMain>
  );
}

const WeekGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const WeekCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const WeekDay = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

const WeekItem = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.88rem;
  font-weight: 700;
`;

const WeekMeta = styled.p`
  margin-top: 0.2rem;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.8rem;
`;

const List = PageList;
const ListRow = PageListCard;

const RowTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 800;
`;

const RowMeta = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
`;

const Note = PageNote;
