import styled from "styled-components";

export const FloatingButton = styled.button`
  position: fixed;
  right: ${({ theme }) => theme.spacing.lg};
  bottom: ${({ theme }) => theme.spacing.lg};
  min-width: 3rem;
  min-height: 3rem;
  border: 1px solid rgb(98 214 199 / 0.34);
  border-radius: 999px;
  background: rgb(98 214 199 / 0.16);
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 0.5rem 1.4rem rgb(0 0 0 / 0.28);

  &:hover {
    background: rgb(98 214 199 / 0.24);
  }
`;