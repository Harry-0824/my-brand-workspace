import {
  Container,
  Description,
  Title
} from "./PageListEmptyState.styles";

type PageListEmptyStateProps = {
  title: string;
  description: string;
  testId?: string;
};

export function PageListEmptyState({
  title,
  description,
  testId
}: PageListEmptyStateProps) {
  return (
    <Container data-testid={testId}>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Container>
  );
}
