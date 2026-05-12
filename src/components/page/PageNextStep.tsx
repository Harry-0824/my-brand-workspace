import { Link } from "react-router-dom";
import styled from "styled-components";
import { DashboardPanel } from "../dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../dashboard/shared/DashboardSectionHeader";

type NextStepLink = {
  label: string;
  to: string;
};

type PageNextStepProps = {
  titleId: string;
  title: string;
  description: string;
  links: NextStepLink[];
  note?: string;
};

export function PageNextStep({
  titleId,
  title,
  description,
  links,
  note
}: PageNextStepProps) {
  return (
    <DashboardPanel aria-labelledby={titleId}>
      <DashboardSectionHeader
        titleId={titleId}
        title={title}
        description={description}
        withDivider
      />

      <LinkList aria-label={`${title}-連結`}>
        {links.map((item) => (
          <LinkItem key={`${item.to}-${item.label}`}>
            <StepLink to={item.to}>{item.label}</StepLink>
          </LinkItem>
        ))}
      </LinkList>

      {note ? <Note>{note}</Note> : null}
    </DashboardPanel>
  );
}

const LinkList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LinkItem = styled.li`
  min-width: 0;
`;

const StepLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgb(98 214 199 / 0.28);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(98 214 199 / 0.08);
  color: ${({ theme }) => theme.textPrimary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
`;

const Note = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.65;
`;
