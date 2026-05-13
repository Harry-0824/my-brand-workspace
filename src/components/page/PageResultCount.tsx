import styled from "styled-components";

type PageResultCountProps = {
  visible: number;
  total: number;
  noun: string;
  testId?: string;
};

export function PageResultCount({
  visible,
  total,
  noun,
  testId
}: PageResultCountProps) {
  return (
    <CountText data-testid={testId}>
      顯示 {visible} / {total} 個{noun}
    </CountText>
  );
}

const CountText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.84rem;
  font-weight: 700;
`;
