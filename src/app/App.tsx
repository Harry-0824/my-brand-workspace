import styled from "styled-components";

export function App() {
  return (
    <PageShell>
      <HeroCard aria-labelledby="workspace-title">
        <Eyebrow>專案基礎已啟動</Eyebrow>
        <Title id="workspace-title">My Brand Workspace</Title>
        <Subtitle>單人接案任務管理工作區</Subtitle>
      </HeroCard>
    </PageShell>
  );
}

const PageShell = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const HeroCard = styled.section`
  width: min(100%, 720px);
  padding: clamp(2rem, 5vw, 4rem);
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.02)),
    ${({ theme }) => theme.surfaceElevated};
  box-shadow: 0 32px 80px rgb(0 0 0 / 0.35);
`;

const Eyebrow = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.accent};
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.16em;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  font-size: clamp(2.5rem, 7vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.08em;
`;

const Subtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.textSecondary};
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
`;
