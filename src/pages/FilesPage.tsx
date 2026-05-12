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
  PageMetricCard,
  PageMetricGrid,
  PageMetricLabel,
  PageMetricValue,
  PageNote
} from "../components/page/PageContentPrimitives";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";

const summaryMetrics = [
  { label: "檔案總數（示意）", value: "48" },
  { label: "近 7 日新增", value: "9" },
  { label: "客戶素材", value: "22" },
  { label: "交付檔案", value: "17" }
] as const;

const recentFiles = [
  { name: "homepage-wireframe-v3.fig", owner: "Bright Studio", type: "設計稿", status: "已整理" },
  { name: "checkout-test-report.pdf", owner: "FlowMart", type: "測試報告", status: "待確認" },
  { name: "proposal-final-draft.docx", owner: "Northwind Co.", type: "提案文件", status: "審閱中" },
  { name: "brand-assets-2026.zip", owner: "Internal", type: "素材包", status: "可交付" }
] as const;

const categories = [
  { title: "設計素材", count: "14" },
  { title: "合約文件", count: "8" },
  { title: "交付檔案", count: "17" },
  { title: "參考資料", count: "9" }
] as const;

const deliveryPreview = [
  "首頁設計稿與標註說明",
  "功能測試結果摘要",
  "交付清單與版本紀錄"
] as const;

export function FilesPage() {
  return (
    <PageMain aria-labelledby="files-page-title">
      <PageHeader>
        <PageTitle id="files-page-title">檔案</PageTitle>
        <PageDescription>
          集中查看專案文件、素材與交付檔案的靜態頁面殼層。
        </PageDescription>
      </PageHeader>

      <DashboardPanel aria-labelledby="files-summary-title">
        <DashboardSectionHeader
          titleId="files-summary-title"
          title="檔案摘要"
          description="以下為檔案狀態概覽的靜態示意。"
          withDivider
        />
        <MetricGrid>
          {summaryMetrics.map((item) => (
            <MetricCard key={item.label}>
              <MetricLabel>{item.label}</MetricLabel>
              <MetricValue>{item.value}</MetricValue>
            </MetricCard>
          ))}
        </MetricGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="files-recent-title">
        <DashboardSectionHeader
          titleId="files-recent-title"
          title="最近檔案"
          description="靜態示意最近更新的文件與素材。"
          withDivider
        />
        <List>
          {recentFiles.map((file) => (
            <ListRow key={file.name}>
              <RowTitle>{file.name}</RowTitle>
              <RowMeta>{file.owner} ・ {file.type} ・ {file.status}</RowMeta>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="files-categories-title">
        <DashboardSectionHeader
          titleId="files-categories-title"
          title="檔案分類"
          description="分類僅為靜態佔位，尚未接入資料儲存。"
          withDivider
        />
        <CategoryGrid>
          {categories.map((item) => (
            <CategoryCard key={item.title}>
              <CategoryTitle>{item.title}</CategoryTitle>
              <CategoryCount>{item.count}</CategoryCount>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="files-delivery-title">
        <DashboardSectionHeader
          titleId="files-delivery-title"
          title="交付包預覽"
          description="示意本次可交付給客戶的檔案項目。"
          withDivider
        />
        <List>
          {deliveryPreview.map((item) => (
            <ListRow key={item}>
              <RowTitle>{item}</RowTitle>
            </ListRow>
          ))}
        </List>
      </DashboardPanel>

      <DashboardPanel aria-labelledby="files-note-title">
        <DashboardSectionHeader
          titleId="files-note-title"
          title="檔案提醒"
          description="交付前檔案整理提醒（靜態文案示意）。"
          withDivider
        />
        <Note>
          建議交付前先統一檔名版本與資料夾結構，避免客戶端誤用舊版檔案。
        </Note>
      </DashboardPanel>
    </PageMain>
  );
}

const MetricGrid = PageMetricGrid;
const MetricCard = PageMetricCard;
const MetricLabel = PageMetricLabel;
const MetricValue = PageMetricValue;
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

const CategoryGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const CategoryCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const CategoryTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 800;
`;

const CategoryCount = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
`;

const Note = PageNote;
