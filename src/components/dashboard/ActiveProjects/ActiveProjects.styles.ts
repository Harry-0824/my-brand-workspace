import styled from "styled-components";

type ProjectTone = keyof typeof statusTone;

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
} as const;

export const Panel = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.052), rgb(255 255 255 / 0.018)),
    ${({ theme }) => theme.surface};
  box-shadow: 0 22px 55px rgb(0 0 0 / 0.18);
`;

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

export const ProjectCount = styled.span`
  flex: 0 0 auto;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textSecondary};
  background: rgb(255 255 255 / 0.035);
  font-size: 0.82rem;
  font-weight: 700;
`;

export const ProjectList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const ProjectRow = styled.article`
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

export const ProjectIdentity = styled.div`
  min-width: 0;
`;

export const ProjectName = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
`;

export const ClientName = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
`;

export const StatusBadge = styled.span<{ $tone: ProjectTone }>`
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

export const DueDateGroup = styled.div`
  min-width: 0;
`;

export const MetaLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.72rem;
  font-weight: 700;
`;

export const DueDate = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
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

export const ProgressGroup = styled.div`
  min-width: 0;
`;

export const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ProgressValue = styled.span`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.86rem;
  font-weight: 800;
`;

export const ProgressTrack = styled.span`
  display: block;
  height: 0.48rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
`;

export const ProgressFill = styled.span<{ $progress: number }>`
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
