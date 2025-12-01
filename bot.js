import {
    Client,
    GatewayIntentBits,
    Partials,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import fetch from "node-fetch";

const TOKEN = process.env.TOKEN;
const API_URL = process.env.API_URL || "https://fluffyhair100.onrender.com/reset-hwid";

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// -------------------------
// SEND THE RESET MESSAGE
// -------------------------
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "resetmenu") return;

    const button = new ButtonBuilder()
        .setCustomId("reset_hwid")
        .setLabel("Reset HWID")
        .setStyle(ButtonStyle.Primary); // purple-ish on Discord

    await interaction.reply({
        content: "If your HWID doesn’t match anymore, click the button below to reset it.",
        components: [new ActionRowBuilder().addComponents(button)]
    });
});

// -------------------------
// SHOW LICENSE INPUT MODAL
// -------------------------
client.on("interactionCreate", async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "reset_hwid") return;

    const modal = new ModalBuilder()
        .setCustomId("hwid_reset_modal")
        .setTitle("Reset HWID");

    const keyInput = new TextInputBuilder()
        .setCustomId("license")
        .setLabel("License Key")
        .setPlaceholder("XXXX-XXXX-XXXX")
        .setStyle(TextInputStyle.Short);

    modal.addComponents(
        new ActionRowBuilder().addComponents(keyInput)
    );

    await interaction.showModal(modal);
});

// -------------------------
// HANDLE RESET REQUEST
// -------------------------
client.on("interactionCreate", async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "hwid_reset_modal") return;

    const key = interaction.fields.getTextInputValue("license");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key })
        });

        const data = await response.json();

        if (data.success) {
            await interaction.reply({
                content: `✅ HWID reset for key: **${key}**`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: "❌ Invalid license key.",
                ephemeral: true
            });
        }
    } catch (err) {
        await interaction.reply({
            content: "⚠️ Server error. Try again later.",
            ephemeral: true
        });
    }
});

client.login(TOKEN);
