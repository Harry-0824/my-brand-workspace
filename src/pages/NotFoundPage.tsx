import {
  NoticeCard,
  NoticeTitle,
  NoticeText,
  BackHomeLink
} from "./NotFoundPage.styles";
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
