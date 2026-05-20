import styled from "styled-components";

type StateType = keyof typeof cardTone;

const cardTone = {
  loading: {
    border: "rgb(255 255 255 / 0.08)",
    badgeColor: "#b9d6f8",
    badgeBorder: "rgb(121 179 255 / 0.32)",
    badgeBg: "rgb(121 179 255 / 0.12)",
  },
  empty: {
    border: "rgb(255 255 255 / 0.08)",
    badgeColor: "#b7c2d0",
    badgeBorder: "rgb(154 167 183 / 0.28)",
    badgeBg: "rgb(154 167 183 / 0.1)",
  },
  error: {
    border: "rgb(255 107 107 / 0.2)",
    badgeColor: "#ffb4ad",
    badgeBorder: "rgb(255 107 107 / 0.3)",
    badgeBg: "rgb(255 107 107 / 0.12)",
  },
  ready: {
    border: "rgb(92 207 141 / 0.2)",
    badgeColor: "#a7efc8",
    badgeBorder: "rgb(92 207 141 / 0.32)",
    badgeBg: "rgb(92 207 141 / 0.1)",
  },
} as const;

export const StateGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

export const StateCard = styled.article<{ $type: StateType }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ $type }) => cardTone[$type].border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const StateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const StateBadge = styled.span<{ $type: StateType }>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ $type }) => cardTone[$type].badgeBorder};
  border-radius: 999px;
  color: ${({ $type }) => cardTone[$type].badgeColor};
  background: ${({ $type }) => cardTone[$type].badgeBg};
  font-size: 0.72rem;
  font-weight: 800;
`;

export const StateTitle = styled.h3`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

export const StateDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.7;
`;

export const PlaceholderBlock = styled.div<{ $type: StateType }>`
  margin-top: ${({ theme }) => theme.spacing.sm};
  height: 2.2rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $type }) =>
    $type === "loading"
      ? "linear-gradient(90deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.02))"
      : "rgb(255 255 255 / 0.03)"};
  border: 1px solid rgb(255 255 255 / 0.07);
`;
