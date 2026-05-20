import styled from "styled-components";
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
} from "./ActiveProjects.styles";
import { type ProjectRecord } from "../../lib/projects";

const StateText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.92rem;
  line-height: 1.65;
`;

const ErrorText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: #ffb4ad;
  font-size: 0.92rem;
  line-height: 1.65;
`;

type ProjectTone = "accent" | "warning" | "success";

function getStatusTone(status: ProjectRecord["status"]): ProjectTone {
  if (status === "active") return "accent";
  if (status === "completed") return "success";
  return "warning";
}

function getStatusLabel(status: ProjectRecord["status"]): string {
  if (status === "active") return "進行中";
  if (status === "paused") return "暫停中";
  if (status === "completed") return "已完成";
  return "已封存";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

type ActiveProjectsProps = {
  projects: ProjectRecord[];
  isLoading: boolean;
  error: string | null;
};

export function ActiveProjects({
  projects,
  isLoading,
  error,
}: ActiveProjectsProps) {
  const activeProjects = projects.filter((p) => p.status === "active");

  return (
    <Panel aria-labelledby="active-projects-title">
      <SectionHeader>
        <div>
          <SectionTitle id="active-projects-title">進行中專案</SectionTitle>
          <SectionDescription>
            目前正在推進的接案專案與完成進度。
          </SectionDescription>
        </div>
        {!isLoading && !error ? (
          <ProjectCount>{activeProjects.length} 個專案</ProjectCount>
        ) : null}
      </SectionHeader>

      {isLoading ? (
        <StateText>載入中…</StateText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : activeProjects.length === 0 ? (
        <StateText>目前沒有進行中的專案。</StateText>
      ) : (
        <ProjectList>
          {activeProjects.map((project) => {
            const tone = getStatusTone(project.status);
            return (
              <ProjectRow key={project.id}>
                <ProjectIdentity>
                  <ProjectName>{project.name}</ProjectName>
                  <ClientName>{project.client_name ?? "—"}</ClientName>
                </ProjectIdentity>

                <StatusBadge $tone={tone}>
                  {getStatusLabel(project.status)}
                </StatusBadge>

                <DueDateGroup>
                  <MetaLabel>到期日</MetaLabel>
                  <DueDate>
                    {project.due_date ? formatDate(project.due_date) : "—"}
                  </DueDate>
                </DueDateGroup>
              </ProjectRow>
            );
          })}
        </ProjectList>
      )}
    </Panel>
  );
}
