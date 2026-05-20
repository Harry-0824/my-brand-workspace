import { CountText } from "./PageResultCount.styles";

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
