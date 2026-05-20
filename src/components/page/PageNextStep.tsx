import { DashboardPanel } from "../dashboard/shared/DashboardPanel";
import { DashboardSectionHeader } from "../dashboard/shared/DashboardSectionHeader";
import { LinkItem, LinkList, Note, StepLink } from "./PageNextStep.styles";

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
