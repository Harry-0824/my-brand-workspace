import { ResetButton } from "./PageResetControl.styles";

type PageResetControlProps = {
  onClick: () => void;
  disabled: boolean;
  testId?: string;
};

export function PageResetControl({
  onClick,
  disabled,
  testId
}: PageResetControlProps) {
  return (
    <ResetButton
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      清除條件
    </ResetButton>
  );
}
