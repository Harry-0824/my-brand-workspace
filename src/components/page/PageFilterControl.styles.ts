import styled from "styled-components";

export const Field = styled.div`
  display: grid;
  gap: 0.25rem;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.75rem;
  font-weight: 700;
`;

export const Select = styled.select`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(255 255 255 / 0.02);
  font-size: 0.9rem;

  option {
    color: ${({ theme }) => theme.textPrimary};
    background: ${({ theme }) => theme.surface};
  }
`;
