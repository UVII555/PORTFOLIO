import React from "react";

export const refreshFrequency = 60 * 60 * 1000; // 1 hour

const USERNAME = "Uvii555";
const LIMIT = 30;

export const className = `
  left: 20px;
  bottom: 20px;
  color: #fff;
  font-family: Lato, Helvetica, sans-serif;
`;

const boxStyle = {
  background: "rgba(17, 24, 39, 0.9)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "14px",
  padding: "12px 16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  width: "220px"
};

async function fetchRecent() {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
    })
  });
  const data = await res.json();
  return data?.data?.recentAcSubmissionList || [];
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

export const command = async () => {
  try {
    const items = await fetchRecent();
    const streak = calculateStreak(items);
    return { streak };
  } catch (e) {
    return { streak: 0 };
  }
};

export default function Widget({ output }) {
  const streak = output?.streak ?? 0;
  return (
    <div style={boxStyle}>
      <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "6px" }}>
        LeetCode Streak
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ fontSize: "22px" }}>🔥</div>
        <div style={{ fontSize: "22px", fontWeight: 700 }}>{streak} days</div>
      </div>
      <div style={{ marginTop: "6px", fontSize: "12px", opacity: 0.7 }}>
        @{USERNAME}
      </div>
    </div>
  );
}
