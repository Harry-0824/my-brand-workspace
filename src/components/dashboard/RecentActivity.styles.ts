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

export const TimelineList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const TimelineRow = styled.article`
  display: grid;
  grid-template-columns: auto minmax(13rem, 1.5fr) minmax(6rem, 0.7fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
`;

export const TimelineMarker = styled.span`
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  border: 1px solid rgb(98 214 199 / 0.5);
  background: rgb(98 214 199 / 0.18);
  box-shadow: 0 0 0 0.3rem rgb(98 214 199 / 0.08);
`;

export const ActivityDetails = styled.div`
  min-width: 0;
`;

export const ActivityAction = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 800;
`;

export const ActivityProject = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.88rem;
`;

export const ActivityError = styled(ActivityProject)`
  color: #ffb4ad;
`;

export const ActivityTime = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 700;
`;

export const TypeBadge = styled.span`
  justify-self: end;
  padding: 0.45rem 0.72rem;
  border: 1px solid rgb(98 214 199 / 0.26);
  border-radius: 999px;
  color: ${({ theme }) => theme.accent};
  background: rgb(98 214 199 / 0.08);
  font-size: 0.8rem;
  font-weight: 800;
  white-space: nowrap;
`;
