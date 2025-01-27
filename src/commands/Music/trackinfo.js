const { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const error = require("../../functions/error");
module.exports = {
  name: "trackinfo",
  description: "Show details of a track.",
  category: "music",
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  user_permissions: ["SendMessages"],
  bot_permissions: ["SendMessages", "EmbedLinks", "Connect", "Speak"],
  dm_permissions: false,
  only_owner: false,
  only_slash: true,
  only_message: true,
  options: [
    {
      name: "index",
      type: ApplicationCommandOptionType.Number,
      description: "That track index.",
      required: true
    }
  ],

  /**
   * 
   * @param {import("discord.js").Client} client 
   * @param {import("discord.js").CommandInteraction} interaction 
   * @param {Array<string>} args 
   * @returns 
   */
  run: async (client, interaction, args) => {
    const queue = useQueue(interaction.guild.id);
    if (!queue)
      return interaction.reply({
        content: "I’m currently not playing in this server.",
        ephemeral: true
      });

    const memberChannelId = interaction.member?.voice?.channelId;
    const queueChannelId = queue?.channel.id;
    if (!memberChannelId)
      return interaction.reply({
        content: "You need to join a voice channel first!",
        ephemeral: true
      });

    if (memberChannelId !== queueChannelId)
      return interaction.reply({
        content: "You must be in the same voice channel as me!",
        ephemeral: true
      });

    const index = interaction.options.getNumber("index", true) - 1;

    if (index > queue.size || index < 0)
      return interaction.reply("Provided track Index does not exist.");

    const track = queue.tracks.toArray()[index];

    if (!track) return interaction.reply("The track was not found.");

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Trackinfo 🎵" })
      .setTitle(`${track.title}`)
      .setURL(`${track.url}`)
      .setThumbnail(`${track.thumbnail}`)
      .setDescription(`~ Requested by: ${track.requestedBy.toString()}
Duration: ${track.duration}
Position in queue: ${index + 1}`);

    return interaction.reply({ ephemeral: true, embeds: [embed] }).catch(error);
  },
};
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
*/