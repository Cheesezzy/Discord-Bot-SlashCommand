const { Client, IntentsBitField, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { DISCORD_TOKEN } = require("./config");
const { MONGODB_URL } = require("./config");
const Ticket = require("./model");
const { CLIENT_ID } = require("./config");

require("dotenv").config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online.`);
});

client.on("ready", () => {
  const express = require("express");
  const app = express();
  const port = 3000;
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
});

const saveTicketToDatabase = async (ticketDetails) => {
  try {
    console.log("Saving ticket to the database:", ticketDetails);

    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const newTicket = new Ticket(ticketDetails);
    await newTicket.save();
    console.log("Ticket saved:", newTicket);
  } catch (error) {
    console.error("Error saving ticket to the database:", error);
  }
};

app.use(express.json());

client.on("interactionCreate", async (interaction) => {
  // if (!interaction.isCommand()) return;
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "erxes") {
    const tableHeaders = [
      "board",
      "pipeline",
      "stage",
      "title",
      "assignee",
      "label",
    ];
    const ticketDetails = {
      board: interaction.options.get("board").value,
      pipeline: interaction.options.get("pipeline").value,
      stage: interaction.options.get("stage").value,
      title: interaction.options.get("title").value,
      assignee: interaction.options.getUser("assignee").id,
      label: interaction.options.get("label").value,
    };

    const table = `\`\`\`${tableHeaders.join(
      " | "
    )}\n-----------------------------------\n${" ".repeat(10)} | ${" ".repeat(
      7
    )} | ${" ".repeat(10)} | ${" ".repeat(7)}\`\`\``;

    const processResponse = async (response) => {
      const column = tableHeaders[Object.keys(ticketDetails).length];
      ticketDetails[column] = response.content;

      if (Object.values(ticketDetails).length === tableHeaders.length) {
        const ticketRow = Object.values(ticketDetails).join(" | ");
        const ticketRowString = `| ${ticketRow} |`;
        const updatedTable = `${table}\n${ticketRowString}`;

        // All inputs collected, proceed with creating the ticket
        await interaction.followUp({ content: updatedTable });

        // Save ticketDetails to the database or perform any other required actions

        await interaction.followUp({
          content: "Ticket creation complete!",
          ephemeral: true,
        });
      }
    };

    // Send initial response with the table headers and the first input
    const nextColumn = tableHeaders[Object.keys(ticketDetails).length];
    await interaction.reply({
      content: `Here is the ticket table:\n${table}\nTicket details: ${JSON.stringify(
        ticketDetails
      ).split(" ")}`,
      ephemeral: true,
    });

    const filter = (response) => response.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
      max: tableHeaders.length,
      time: 60000,
    });
    await saveTicketToDatabase(ticketDetails);

    await interaction.followUp({
      content: "Ticket creation complete!",
      ephemeral: true,
    });
  }
});

app.get("/tickets/:id", async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Find the ticket by its ID using the Ticket model
    const ticket = await Ticket.findById(ticketId);

    // If the ticket is not found, return a 404 response
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error retrieving ticket:", error);
    res.status(500).json({ error: "Failed to retrieve ticket" });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

client.login(DISCORD_TOKEN);
