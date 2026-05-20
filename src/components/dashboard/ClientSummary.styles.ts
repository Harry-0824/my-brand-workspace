import styled from "styled-components";

const statusTone = [
  {
    color: "#a7efc8",
    border: "rgb(92 207 141 / 0.32)",
    background: "rgb(92 207 141 / 0.12)"
  },
  {
    color: "#f8d98a",
    border: "rgb(246 200 95 / 0.32)",
    background: "rgb(246 200 95 / 0.12)"
  },
  {
    color: "#ffb4ad",
    border: "rgb(255 107 107 / 0.32)",
    background: "rgb(255 107 107 / 0.12)"
  },
  {
    color: "#b9d6f8",
    border: "rgb(121 179 255 / 0.32)",
    background: "rgb(121 179 255 / 0.12)"
  }
] as const;

const getStatusTone = (value: string) => {
  const seed = [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return statusTone[Math.abs(seed) % statusTone.length];
};

export const ClientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const ClientRow = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const ClientTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ClientName = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
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

export const ClientMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const MetaItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const MetaLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.78rem;
  font-weight: 700;
`;

export const MetaValue = styled.span`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.88rem;
  font-weight: 700;
`;

export const NextStepText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  line-height: 1.7;
`;
