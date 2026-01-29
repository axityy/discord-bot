// ===================== CONFIG =====================
const REDIRECT_LINK = "https://www.youtube.com";
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN";
// ==================================================

export const config = {
  runtime: "edge",
};

function generateFakeIP(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256)
  ).join(".");
}

export default async function handler() {
  const fakeIP = generateFakeIP();

  // Send fake data to Discord
  await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Logger",
      content: `Fake IP: \`${fakeIP}\``,
    }),
  });

  // Universal redirect (works everywhere)
  return new Response(null, {
    status: 302,
    headers: {
      Location: REDIRECT_LINK,
    },
  });
}
