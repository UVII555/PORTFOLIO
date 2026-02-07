// Scriptable widget: LeetCode Daily Streak
// How to use (macOS):
// 1) Install Scriptable from App Store.
// 2) Open Scriptable -> create new script -> paste this code.
// 3) Add Scriptable widget to desktop and select this script.

const USERNAME = "Uvii555"; // change if needed
const LIMIT = 30;

async function fetchRecent() {
  const url = "https://leetcode.com/graphql";
  const body = {
    query: `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
        }
      }
    `,
    variables: { username: USERNAME, limit: LIMIT }
  };

  const req = new Request(url);
  req.method = "POST";
  req.headers = { "Content-Type": "application/json" };
  req.body = JSON.stringify(body);
  const res = await req.loadJSON();
  return res?.data?.recentAcSubmissionList || [];
}

function calculateStreak(items) {
  if (!items.length) return 0;
  const days = new Set(
    items.map(i => {
      const d = new Date(Number(i.timestamp) * 1000);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    })
  );
  const sorted = Array.from(days).sort((a, b) => b - a);
  let streak = 1;
  let current = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const diff = (current - sorted[i]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak += 1;
      current = sorted[i];
    } else if (diff === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

const widget = new ListWidget();
widget.backgroundColor = new Color("1F2937");

const title = widget.addText("LeetCode Streak");
title.textColor = Color.white();
title.font = Font.semiboldSystemFont(14);

widget.addSpacer(6);

let streak = 0;
try {
  const items = await fetchRecent();
  streak = calculateStreak(items);
} catch (e) {
  streak = 0;
}

const row = widget.addStack();
row.centerAlignContent();

const flame = row.addText("🔥");
flame.font = Font.systemFont(22);

row.addSpacer(6);

const streakText = row.addText(`${streak} days`);
streakText.textColor = Color.white();
streakText.font = Font.boldSystemFont(20);

widget.addSpacer();

const sub = widget.addText(`@${USERNAME}`);
sub.textColor = new Color("9CA3AF");
sub.font = Font.systemFont(12);

Script.setWidget(widget);
Script.complete();
