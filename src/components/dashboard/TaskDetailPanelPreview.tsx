import styled from "styled-components";

const taskInfo = [
  { label: "任務名稱", value: "完成首頁線框" },
  { label: "所屬專案", value: "品牌官網重設計" },
  { label: "狀態", value: "進行中" },
  { label: "優先級", value: "高" },
  { label: "到期日", value: "5 月 24 日" },
  { label: "客戶", value: "Bright Studio" }
] as const;

const checklist = [
  { text: "完成首屏 wireframe", done: true },
  { text: "調整服務區塊資訊層級", done: true },
  { text: "整理 CTA 文案", done: false },
  { text: "確認客戶回饋重點", done: false }
] as const;

const attachments = ["wireframe-v2.fig", "client-feedback.md"] as const;

export function TaskDetailPanelPreview() {
  return (
    <Panel aria-labelledby="task-detail-panel-title">
      <SectionTitle id="task-detail-panel-title">任務詳情</SectionTitle>
      <SectionDescription>預覽選取任務的狀態、內容與執行細節。</SectionDescription>

      <InfoGrid>
        {taskInfo.map((item) => (
          <InfoItem key={item.label}>
            <InfoLabel>{item.label}</InfoLabel>
            <InfoValue>{item.value}</InfoValue>
          </InfoItem>
        ))}
      </InfoGrid>

      <Block>
        <BlockTitle>任務說明</BlockTitle>
        <BodyText>
          根據客戶回饋調整首頁首屏、服務區塊與行動呼籲區，確認桌面版資訊層級與視覺節奏。
        </BodyText>
      </Block>

      <Block>
        <BlockTitle>Checklist</BlockTitle>
        <Checklist>
          {checklist.map((item) => (
            <ChecklistItem key={item.text}>
              <StatusDot $done={item.done} aria-hidden="true" />
              <ChecklistText>{item.text}</ChecklistText>
            </ChecklistItem>
          ))}
        </Checklist>
      </Block>

      <BottomGrid>
        <Block>
          <BlockTitle>附件</BlockTitle>
          <AttachmentList>
            {attachments.map((item) => (
              <AttachmentItem key={item}>{item}</AttachmentItem>
            ))}
          </AttachmentList>
        </Block>

        <Block>
          <BlockTitle>備註</BlockTitle>
          <BodyText>
            下一步需將首頁主要訊息收斂成 3 個重點，避免首屏資訊過重。
          </BodyText>
        </Block>
      </BottomGrid>
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

const InfoGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const InfoItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const InfoLabel = styled.dt`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.78rem;
  font-weight: 700;
`;

const InfoValue = styled.dd`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

const Block = styled.section`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const BlockTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.98rem;
  font-weight: 800;
`;

const BodyText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.92rem;
  line-height: 1.75;
`;

const Checklist = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  list-style: none;
  padding: 0;
`;

const ChecklistItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
`;

const StatusDot = styled.span<{ $done: boolean }>`
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: ${({ $done, theme }) => ($done ? theme.success : theme.textSecondary)};
  opacity: ${({ $done }) => ($done ? 1 : 0.6)};
`;

const ChecklistText = styled.span`
  color: ${({ theme }) => theme.textPrimary};
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const AttachmentList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  list-style: none;
  padding: 0;
`;

const AttachmentItem = styled.li`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.88rem;
`;
