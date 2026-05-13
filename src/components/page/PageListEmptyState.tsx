import styled from "styled-components";

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

const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(255 255 255 / 0.02);
`;

const Title = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.92rem;
  font-weight: 700;
`;

const Description = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.86rem;
  line-height: 1.7;
`;
