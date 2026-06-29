import { PageShell } from "~/components/shared/page-shell";
import { LeaderboardPageContent } from "~/components/leaderboard/leaderboard-page";

export default function LeaderboardPage() {
  return (
    <PageShell
      title="جدول امتیازات"
      subtitle="برترین چیدمان‌های ثبت‌شده — بالاتر بهتر"
    >
      <LeaderboardPageContent />
    </PageShell>
  );
}
