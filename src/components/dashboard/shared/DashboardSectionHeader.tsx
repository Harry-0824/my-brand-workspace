import {
  HeaderRoot,
  SectionTitle,
  SectionDescription
} from "./DashboardSectionHeader.styles";

type DashboardSectionHeaderProps = {
  title: string;
  description: string;
  titleId: string;
  withDivider?: boolean;
};

export function DashboardSectionHeader({
  title,
  description,
  titleId,
  withDivider = false
}: DashboardSectionHeaderProps) {
  return (
    <HeaderRoot $withDivider={withDivider}>
      <div>
        <SectionTitle id={titleId}>{title}</SectionTitle>
        <SectionDescription>{description}</SectionDescription>
      </div>
    </HeaderRoot>
  );
}
