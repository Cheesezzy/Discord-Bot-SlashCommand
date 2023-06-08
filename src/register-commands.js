const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "erxes",
    description: "erxes ticket pipeline",
    options: [
      {
        name: "board",
        description: "The Board.",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "customer_happy_team",
            value: "Customer Happy Team",
          },
        ],
        required: true,
      },

      {
        name: "pipeline",
        description: "type of tickets",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "erxes_tickets",
            value: "Erxes tickets",
          },
        ],
        required: true,
      },

      {
        name: "stage",
        description: "Support",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "new_ticket",
            value: "New Ticket",
          },
          {
            name: "open_ticket",
            value: "Open Ticket",
          },
          {
            name: "closed_ticket",
            value: "Closed Ticket",
          },
        ],
        required: true,
      },

      {
        name: "title",
        description: "the title of task",
        type: ApplicationCommandOptionType.String,
        required: true,
      },

      {
        name: "assignee",
        description: "Who to assign task to",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "patrick",
            value: "developer_1",
          },
          {
            name: "tom",
            value: "developer_2",
          },
        ],
        required: true,
      },

      {
        name: "label",
        description: "Type of label",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Bug_Mobile",
            value: "Bug - Mobile",
          },
        ],
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands.....");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands were registered successfully!");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
