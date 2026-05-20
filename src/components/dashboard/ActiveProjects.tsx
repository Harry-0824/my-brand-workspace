import {
  Panel,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  ProjectCount,
  ProjectList,
  ProjectRow,
  ProjectIdentity,
  ProjectName,
  ClientName,
  StatusBadge,
  DueDateGroup,
  MetaLabel,
  DueDate,
  ProgressGroup,
  ProgressHeader,
  ProgressValue,
  ProgressTrack,
  ProgressFill
} from "./ActiveProjects.styles";

const activeProjects = [
  {
    name: "品牌官網重設計",
    client: "Bright Studio",
    status: "進行中",
    progress: 75,
    dueDate: "5 月 24 日",
    tone: "accent"
  },
  {
    name: "電商功能開發",
    client: "FlowMart",
    status: "開發中",
    progress: 60,
    dueDate: "5 月 28 日",
    tone: "accent"
  },
  {
    name: "客戶提案製作",
    client: "Northwind Co.",
    status: "待確認",
    progress: 35,
    dueDate: "5 月 30 日",
    tone: "warning"
  },
  {
    name: "個人作品網站",
    client: "Internal",
    status: "優化中",
    progress: 90,
    dueDate: "6 月 02 日",
    tone: "success"
  }
] as const;

type ProjectTone = (typeof activeProjects)[number]["tone"];

const statusTone = {
  accent: {
    color: "#8be4db",
    background: "rgb(98 214 199 / 0.1)",
    border: "rgb(98 214 199 / 0.34)"
  },
  warning: {
    color: "#f8d98a",
    background: "rgb(246 200 95 / 0.1)",
    border: "rgb(246 200 95 / 0.32)"
  },
  success: {
    color: "#93e3b4",
    background: "rgb(92 207 141 / 0.1)",
    border: "rgb(92 207 141 / 0.3)"
  }
} as const satisfies Record<ProjectTone, { color: string; background: string; border: string }>;

export function ActiveProjects() {
  return (
    <Panel aria-labelledby="active-projects-title">
      <SectionHeader>
        <div>
          <SectionTitle id="active-projects-title">進行中專案</SectionTitle>
          <SectionDescription>
            目前正在推進的接案專案與完成進度。
          </SectionDescription>
        </div>
        <ProjectCount>{activeProjects.length} 個專案</ProjectCount>
      </SectionHeader>

      <ProjectList>
        {activeProjects.map((project) => (
          <ProjectRow key={project.name}>
            <ProjectIdentity>
              <ProjectName>{project.name}</ProjectName>
              <ClientName>{project.client}</ClientName>
            </ProjectIdentity>

            <StatusBadge $tone={project.tone}>{project.status}</StatusBadge>

            <DueDateGroup>
              <MetaLabel>到期日</MetaLabel>
              <DueDate>{project.dueDate}</DueDate>
            </DueDateGroup>

            <ProgressGroup>
              <ProgressHeader>
                <MetaLabel>進度</MetaLabel>
                <ProgressValue>{project.progress}%</ProgressValue>
              </ProgressHeader>
              <ProgressTrack
                aria-label={`${project.name} 完成進度`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={project.progress}
                role="progressbar"
              >
                <ProgressFill $progress={project.progress} />
              </ProgressTrack>
            </ProgressGroup>
          </ProjectRow>
        ))}
      </ProjectList>
    </Panel>
  );
}
