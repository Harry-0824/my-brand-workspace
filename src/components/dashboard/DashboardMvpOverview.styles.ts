import styled from "styled-components";

export const SnapshotGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SnapshotCard = styled.article`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const SnapshotLabel = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  font-weight: 700;
`;

export const SnapshotValue = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.35rem;
  font-weight: 800;
`;

export const SnapshotNote = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  line-height: 1.6;
`;

export const FocusSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(255 255 255 / 0.025);
`;

export const FocusTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 800;
`;

export const FocusList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-left: 1rem;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const FocusItem = styled.li`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
  line-height: 1.65;
`;
