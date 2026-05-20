import {
  RowTitle,
  RowMeta,
  StaticNote,
  CardGrid,
  Card,
  CardTitle,
  CardDetail,
  QuickStartLink
} from "./HelpPage.styles";
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
import { faqPreview, workflows } from "./data/helpPageData";

const quickStartActions = [
  {
    title: "專案 / Projects",
    detail: "前往專案頁面建立或整理專案",
    to: "/projects"
  },
  {
    title: "任務 / Tasks",
    detail: "前往任務頁面安排本週工作",
    to: "/tasks"
  },
  {
    title: "客戶 / Clients",
    detail: "前往客戶頁面管理名單與備註",
    to: "/clients"
  },
  {
    title: "收款紀錄 / Income Records",
    detail: "前往收款頁面追蹤款項狀態",
    to: "/invoices"
  },
  {
    title: "報表 / Reports",
    detail: "前往報表頁面檢視整體摘要",
    to: "/reports"
  }
] as const;

export function HelpPage() {
  return (
    <PageMain aria-labelledby="help-page-title">
      <PageHeader>
        <PageTitle id="help-page-title">說明</PageTitle>
        <PageDescription>
          查看工作區使用指引、常見流程與靜態協助資訊。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="help-start-title">
        <DashboardSectionHeader
          titleId="help-start-title"
          title="快速開始"
          description="點擊下列項目可快速前往對應功能頁面。"
          withDivider
        />
        <List>
          {quickStartActions.map((item) => (
            <ListRow key={item.to}>
              <QuickStartLink to={item.to}>
                <RowTitle as="span">{item.title}</RowTitle>
                <RowMeta>{item.detail}</RowMeta>
              </QuickStartLink>
            </ListRow>
          ))}
        </List>
        <StaticNote>
          可使用快速開始直接跳轉，或透過側邊欄切換其他頁面。
        </StaticNote>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="help-workflow-title">
        <DashboardSectionHeader
          titleId="help-workflow-title"
          title="常用工作流程"
          description="示意常見的專案與客戶管理節奏。"
          withDivider
        />
        <CardGrid>
          {workflows.map((item) => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardDetail>{item.detail}</CardDetail>
            </Card>
          ))}
        </CardGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="help-faq-title">
        <DashboardSectionHeader
          titleId="help-faq-title"
          title="常見問題預覽"
          description="FAQ 內容為靜態示意，未包含互動式展開。"
          withDivider
        />
        <List>
          {faqPreview.map((item) => (
            <ListRow key={item.question}>
              <RowTitle>{item.question}</RowTitle>
              <RowMeta>{item.answer}</RowMeta>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="help-contact-title">
        <DashboardSectionHeader
          titleId="help-contact-title"
          title="支援聯繫（示意）"
          description="目前僅提供靜態說明，尚未接入 ticket 或 chat。"
          withDivider
        />
        <Note>
          後續可擴充為正式支援入口；目前請先透過既有專案流程記錄問題與待辦。
        </Note>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="help-note-title">
        <DashboardSectionHeader
          titleId="help-note-title"
          title="使用提醒"
          description="保持資料一致性的靜態提醒。"
          withDivider
        />
        <Note>
          建議每週固定整理專案、任務與檔案內容，確保交付與溝通資訊同步更新。
        </Note>
      </DashboardPanel>
    </PageMain>
  );
}

const List = PageList;
const ListRow = PageListCard;

const Note = PageNote;
