import styled from "styled-components";

const priorityTone = [
  {
    color: "#ffb4ad",
    background: "rgb(255 107 107 / 0.1)",
    border: "rgb(255 107 107 / 0.28)"
  },
  {
    color: "#f8d98a",
    background: "rgb(246 200 95 / 0.1)",
    border: "rgb(246 200 95 / 0.28)"
  },
  {
    color: "#b7c2d0",
    background: "rgb(154 167 183 / 0.1)",
    border: "rgb(154 167 183 / 0.24)"
  }
] as const;

const getPriorityTone = (value: string) => {
  const seed = [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return priorityTone[Math.abs(seed) % priorityTone.length];
};

export const Panel = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.018)),
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

export const DeadlineCount = styled.span`
  flex: 0 0 auto;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textSecondary};
  background: rgb(255 255 255 / 0.035);
  font-size: 0.82rem;
  font-weight: 700;
`;

export const DeadlineList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const DeadlineRow = styled.article`
  display: grid;
  grid-template-columns: minmax(7rem, 0.65fr) minmax(14rem, 1.4fr) auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const DateBlock = styled.div`
  min-width: 0;
`;

export const DateLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.72rem;
  font-weight: 700;
`;

export const DateText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

export const DeadlineDetails = styled.div`
  min-width: 0;
`;

export const DeadlineTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
`;

export const ProjectName = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
`;

export const TypeBadge = styled.span`
  justify-self: start;
  padding: 0.45rem 0.72rem;
  border: 1px solid rgb(98 214 199 / 0.26);
  border-radius: 999px;
  color: ${({ theme }) => theme.accent};
  background: rgb(98 214 199 / 0.08);
  font-size: 0.8rem;
  font-weight: 800;
  white-space: nowrap;
`;

export const PriorityBadge = styled.span<{ $priority: string }>`
  justify-self: end;
  min-width: 2.25rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid ${({ $priority }) => getPriorityTone($priority).border};
  border-radius: 999px;
  color: ${({ $priority }) => getPriorityTone($priority).color};
  background: ${({ $priority }) => getPriorityTone($priority).background};
  font-size: 0.8rem;
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
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
