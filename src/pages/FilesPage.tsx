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
import { PageNextStep } from "../components/page/PageNextStep";
import { DashboardPanel } from "../components/dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../components/dashboard/shared/DashboardSectionHeader";
import {
  categories,
  deliveryPreview,
  recentFiles,
  summaryMetrics
} from "./data/filesPageData";

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

      <PageNextStep
        titleId="files-next-step-title"
        title="下一步建議"
        description="檔案整理完成後，建議直接銜接專案與說明頁面的後續動作。"
        links={[
          { label: "前往專案頁面，更新交付進度", to: "/projects" },
          { label: "前往說明頁面，確認交付流程提醒", to: "/help" }
        ]}
        note="交付前先比對檔名與版本，能有效降低返工機率。"
      />
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
