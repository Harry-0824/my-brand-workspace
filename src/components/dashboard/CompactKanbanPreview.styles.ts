import styled from "styled-components";

type Priority = "高" | "中" | "低";

const priorityTone = {
  高: {
    color: "#ffb4ad",
    background: "rgb(255 107 107 / 0.1)",
    border: "rgb(255 107 107 / 0.28)"
  },
  中: {
    color: "#f8d98a",
    background: "rgb(246 200 95 / 0.1)",
    border: "rgb(246 200 95 / 0.28)"
  },
  低: {
    color: "#b7c2d0",
    background: "rgb(154 167 183 / 0.1)",
    border: "rgb(154 167 183 / 0.24)"
  }
} as const satisfies Record<Priority, { color: string; background: string; border: string }>;

export const SectionHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.35rem;
  font-weight: 800;
`;

export const SectionDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
`;

export const ColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const Column = styled.section`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ColumnTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.98rem;
  font-weight: 800;
`;

export const ColumnCount = styled.span`
  min-width: 1.75rem;
  padding: 0.25rem 0.45rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 999px;
  color: ${({ theme }) => theme.textSecondary};
  background: rgb(255 255 255 / 0.035);
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
`;

export const TaskList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const TaskCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgb(255 255 255 / 0.02);
`;

export const TaskName = styled.h4`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

export const ProjectName = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
`;

export const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const PriorityBadge = styled.span<{ $priority: Priority }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $priority }) => priorityTone[$priority].border};
  border-radius: 999px;
  color: ${({ $priority }) => priorityTone[$priority].color};
  background: ${({ $priority }) => priorityTone[$priority].background};
  font-size: 0.72rem;
  font-weight: 800;
`;

export const DueDate = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.75rem;
  font-weight: 700;
`;

export const StateText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.92rem;
  line-height: 1.65;
`;

export const ErrorText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: #ffb4ad;
  font-size: 0.92rem;
  line-height: 1.65;
`;
