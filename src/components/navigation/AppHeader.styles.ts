import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const HeaderShell = styled.header`
  min-height: 5.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.xxl};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: rgb(16 23 33 / 0.86);
  backdrop-filter: blur(18px);
`;

export const TitleGroup = styled.div`
  min-width: 0;
`;

export const PageTitle = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.45rem;
  line-height: 1.1;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

export const SearchLabel = styled.label`
  width: 22rem;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textSecondary};
`;

export const SearchIcon = styled.span`
  width: 0.85rem;
  height: 0.85rem;
  flex: 0 0 auto;
  border: 2px solid currentColor;
  border-radius: 999px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 0.42rem;
    height: 2px;
    right: -0.34rem;
    bottom: -0.16rem;
    border-radius: 999px;
    background: currentColor;
    transform: rotate(45deg);
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.9;
  }
`;

export const CreateHint = styled.span`
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border: 1px solid rgb(98 214 199 / 0.24);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgb(98 214 199 / 0.1);
  color: ${({ theme }) => theme.accent};
  font-size: 0.92rem;
  font-weight: 800;
  cursor: default;
`;

export const NotificationIcon = styled.span`
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textSecondary};
  cursor: default;

  &::before {
    content: "";
    width: 0.76rem;
    height: 0.9rem;
    border: 2px solid currentColor;
    border-bottom-width: 3px;
    border-radius: 999px 999px 0.45rem 0.45rem;
  }
`;

export const SettingsLink = styled(NavLink)`
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.textPrimary};
  }

  &.active {
    border-color: rgb(98 214 199 / 0.36);
    background: rgb(98 214 199 / 0.12);
    color: ${({ theme }) => theme.accent};
  }
`;

export const GearIcon = styled.span`
  width: 1rem;
  height: 1rem;
  display: block;
  border: 2px solid currentColor;
  border-radius: 999px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 50%;
    transform: translate(-50%, -50%);
    width: 0.36rem;
    height: 0.36rem;
    border: 1.5px solid currentColor;
    border-radius: 999px;
    background: transparent;
  }
`;
