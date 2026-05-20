import styled from "styled-components";

const statusTone = [
  {
    color: "#a7efc8",
    background: "rgb(92 207 141 / 0.12)",
    border: "rgb(92 207 141 / 0.32)"
  },
  {
    color: "#f8d98a",
    background: "rgb(246 200 95 / 0.12)",
    border: "rgb(246 200 95 / 0.32)"
  },
  {
    color: "#b9d6f8",
    background: "rgb(121 179 255 / 0.12)",
    border: "rgb(121 179 255 / 0.32)"
  }
] as const;

const getStatusTone = (value: string) => {
  const seed = [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return statusTone[Math.abs(seed) % statusTone.length];
};

export const FocusList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const FocusItem = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const FocusTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Time = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $status }) => getStatusTone($status).border};
  border-radius: 999px;
  color: ${({ $status }) => getStatusTone($status).color};
  background: ${({ $status }) => getStatusTone($status).background};
  font-size: 0.72rem;
  font-weight: 800;
`;

export const Title = styled.h3`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.98rem;
  font-weight: 800;
`;

export const Project = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  font-weight: 700;
`;

export const Description = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  line-height: 1.7;
`;

export const SuggestionBlock = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(255 255 255 / 0.025);
`;

export const SuggestionText = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  line-height: 1.7;
`;
