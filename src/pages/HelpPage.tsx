import styled from "styled-components";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";

const gettingStarted = [
  "建立第一個專案並設定交付目標",
  "新增任務並安排本週工作重點",
  "建立客戶資料與溝通備註",
  "更新收款與發票追蹤狀態"
] as const;

const workflows = [
  {
    title: "專案規劃",
    detail: "先定義交付內容，再拆解成可追蹤任務清單。"
  },
  {
    title: "客戶追蹤",
    detail: "固定記錄回饋時間點，避免關鍵訊息遺漏。"
  },
  {
    title: "收款管理",
    detail: "每週檢查待收款項目與發票進度示意。"
  },
  {
    title: "檔案交付",
    detail: "交付前確認版本、命名與文件完整度。"
  }
] as const;

const faqPreview = [
  {
    question: "如何開始新的接案流程？",
    answer: "可先建立專案，再新增任務與客戶資料。"
  },
  {
    question: "如何追蹤本週交付項目？",
    answer: "使用任務與行事曆頁面查看近期安排。"
  },
  {
    question: "如何整理交付檔案？",
    answer: "在檔案頁集中管理素材與交付清單。"
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
          description="以下為建立工作區流程的靜態檢查清單。"
          withDivider
        />
        <List>
          {gettingStarted.map((item) => (
            <ListRow key={item}>
              <RowTitle>{item}</RowTitle>
            </ListRow>
          ))}
        </List>
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

const List = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ListRow = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

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

const CardGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const Card = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 800;
`;

const CardDetail = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  line-height: 1.65;
`;

const Note = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(98 214 199 / 0.25);
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(98 214 199 / 0.08);
  font-size: 0.9rem;
  line-height: 1.7;
`;
