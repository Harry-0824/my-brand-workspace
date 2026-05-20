import {
  Panel,
  SectionTitle,
  SectionDescription,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  Block,
  BlockTitle,
  BodyText,
  Checklist,
  ChecklistItem,
  StatusDot,
  ChecklistText,
  BottomGrid,
  AttachmentList,
  AttachmentItem
} from "./TaskDetailPanelPreview.styles";

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
