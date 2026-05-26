import styled from "styled-components";

export const Panel = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.05), rgb(255 255 255 / 0.018)),
    ${({ theme }) => theme.surface};
  box-shadow: 0 22px 55px rgb(0 0 0 / 0.18);
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

export const InfoGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const InfoItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const InfoLabel = styled.dt`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.78rem;
  font-weight: 700;
`;

export const InfoValue = styled.dd`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.95rem;
  font-weight: 800;
`;

export const ErrorInfoValue = styled(InfoValue)`
  color: #ffb4ad;
`;

export const Block = styled.section`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const BlockTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.98rem;
  font-weight: 800;
`;

export const BodyText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.92rem;
  line-height: 1.75;
`;

export const Checklist = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  list-style: none;
  padding: 0;
`;

export const ChecklistItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
`;

export const StatusDot = styled.span<{ $done: boolean }>`
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: ${({ $done, theme }) => ($done ? theme.success : theme.textSecondary)};
  opacity: ${({ $done }) => ($done ? 1 : 0.6)};
`;

export const ChecklistText = styled.span`
  color: ${({ theme }) => theme.textPrimary};
`;

export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const AttachmentList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  list-style: none;
  padding: 0;
`;

export const AttachmentItem = styled.li`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.88rem;
`;
