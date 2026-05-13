import styled from "styled-components";

export const PageListSummaryRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;
