import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  PageDescription,
  PageHeader,
  PageMain,
  PageTitle
} from "../components/page/PageShell";

export function NotFoundPage() {
  return (
    <PageMain aria-labelledby="not-found-page-title">
      <PageHeader>
        <PageTitle id="not-found-page-title">找不到頁面</PageTitle>
        <PageDescription>
          你目前造訪的路徑不存在，請確認網址是否正確。
        </PageDescription>
      </PageHeader>

      <NoticeCard role="status" aria-label="找不到頁面提示">
        <NoticeTitle>404</NoticeTitle>
        <NoticeText>
          此頁面目前沒有對應內容。你可以返回儀表板繼續查看工作區資訊。
        </NoticeText>
        <BackHomeLink to="/">回到儀表板</BackHomeLink>
      </NoticeCard>
    </PageMain>
  );
}

const NoticeCard = styled.section`
  max-width: 38rem;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.surfaceElevated};
`;

const NoticeTitle = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 2rem;
  font-weight: 800;
`;

const NoticeText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.75;
`;

const BackHomeLink = styled(Link)`
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: 0.5rem 0.9rem;
  border: 1px solid rgb(98 214 199 / 0.35);
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.textPrimary};
  background: rgb(98 214 199 / 0.12);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 700;
`;
