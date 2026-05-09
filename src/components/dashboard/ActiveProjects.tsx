import styled from "styled-components";

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

const Panel = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.052), rgb(255 255 255 / 0.018)),
    ${({ theme }) => theme.surface};
  box-shadow: 0 22px 55px rgb(0 0 0 / 0.18);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
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

const ProjectCount = styled.span`
  flex: 0 0 auto;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textSecondary};
  background: rgb(255 255 255 / 0.035);
  font-size: 0.82rem;
  font-weight: 700;
`;

const ProjectList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ProjectRow = styled.article`
  display: grid;
  grid-template-columns:
    minmax(13rem, 1.4fr) minmax(6rem, 0.55fr) minmax(7rem, 0.65fr)
    minmax(9rem, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const ProjectIdentity = styled.div`
  min-width: 0;
`;

const ProjectName = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
`;

const ClientName = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
`;

const StatusBadge = styled.span<{ $tone: ProjectTone }>`
  justify-self: start;
  padding: 0.45rem 0.7rem;
  border: 1px solid ${({ $tone }) => statusTone[$tone].border};
  border-radius: 999px;
  color: ${({ $tone }) => statusTone[$tone].color};
  background: ${({ $tone }) => statusTone[$tone].background};
  font-size: 0.8rem;
  font-weight: 800;
  white-space: nowrap;
`;

const DueDateGroup = styled.div`
  min-width: 0;
`;

const MetaLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.72rem;
  font-weight: 700;
`;

const DueDate = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 700;
`;

const ProgressGroup = styled.div`
  min-width: 0;
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProgressValue = styled.span`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.86rem;
  font-weight: 800;
`;

const ProgressTrack = styled.span`
  display: block;
  height: 0.48rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
`;

const ProgressFill = styled.span<{ $progress: number }>`
  display: block;
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.accent},
    ${({ theme }) => theme.success}
  );
`;
