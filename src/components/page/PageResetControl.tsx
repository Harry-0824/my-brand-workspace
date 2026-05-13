import styled from "styled-components";

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

const ResetButton = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.35rem 0.65rem;
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(255 255 255 / 0.03);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
