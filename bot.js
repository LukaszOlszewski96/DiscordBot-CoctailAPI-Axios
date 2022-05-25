const config = require("./config/keys");
const axios = require("axios");
const Discord = require("discord.js");
const { Client, MessageEmbed } = require("discord.js");

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(config.DISCORDJS_BOT_TOKEN);

const getRandomCoctail = async () => {
  const response = await axios.get(
    `https://www.thecocktaildb.com/api/json/v1/1/random.php`
  );
  const drink = response.data.drinks[0];

  return {
    name: drink.strDrink,
    alcoholic: drink.strAlcoholic,
    instructions: drink.strInstructions,
    image: drink.strDrinkThumb,
    url: `http://localhost:3000/coctail/details?id=${drink.idDrink}`,
  };
};

client.on("messageCreate", async (message) => {
  if (message.content === "!drunk") {
    try {
      const response = await getRandomCoctail();

      if (response) {
        const embMsg = new MessageEmbed({
          color: 3447003,
          image: {
            url: response.image,
          },
          title: response.name,
          url: response.url,
          description: "Quit your job and go get drunk!",
          fields: [
            {
              name: "Instruction?",
              value: `Go to: http://localhost:3000/coctail`,
              inline: false,
            },
            {
              name: "Type",
              value: response.alcoholic,
              inline: true,
            },
            {
              name: "\u200b",
              value: "\u200b",
            },
          ],
        });

        message.channel.send({
          embeds: [embMsg],
        });
      }
    } catch (error) {
      message.channel.send("Oops, there was an error fetching the API");
      console.log(error);
    }
  }
});
