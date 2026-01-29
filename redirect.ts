// ===================== CONFIG =====================
const REDIRECT_LINK = "https://www.youtube.com";
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1466362286951104643/Jsm9HpSe-2vh2eDLjFcoQLdug_4Fe-iOd5rSCNWIZPVGdisDj_gZl9M9fH_yWErJVwph";
// ==================================================

function generateFakeIP(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256)
  ).join(".");
}

export async function handler(event: any, context: any) {
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

  // Netlify redirect response
  return {
    statusCode: 302,
    headers: {
      Location: REDIRECT_LINK,
    },
  };
}
