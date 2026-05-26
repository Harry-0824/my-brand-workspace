import styled from "styled-components";

const statusTone = [
  {
    color: "#f8d98a",
    background: "rgb(246 200 95 / 0.12)",
    border: "rgb(246 200 95 / 0.32)"
  },
  {
    color: "#ffb4ad",
    background: "rgb(255 107 107 / 0.12)",
    border: "rgb(255 107 107 / 0.32)"
  },
  {
    color: "#a7efc8",
    background: "rgb(92 207 141 / 0.12)",
    border: "rgb(92 207 141 / 0.32)"
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

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const MetricCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const MetricLabel = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.8rem;
  font-weight: 700;
`;

export const ErrorMetricLabel = styled(MetricLabel)`
  color: #ffb4ad;
`;

export const MetricValue = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.1rem;
  font-weight: 800;
`;

export const Rows = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const Row = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const RowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Client = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
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

export const Item = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
`;

export const RowBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const Amount = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

export const DateText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.82rem;
  font-weight: 700;
`;
