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
import { PageNextStep } from "../components/page/PageNextStep";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";
import {
  focusBlocks,
  milestoneTimeline,
  upcomingSchedule,
  weekOverview
} from "./data/calendarPageData";

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

      <PageNextStep
        titleId="calendar-next-step-title"
        title="下一步建議"
        description="排程檢查完成後，建議立即同步任務與專案頁面。"
        links={[
          { label: "前往任務頁面，更新本週待辦", to: "/tasks" },
          { label: "前往專案頁面，確認交付節點", to: "/projects" }
        ]}
      />
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
