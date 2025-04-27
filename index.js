import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const {
  DISCORD_TOKEN,
  GITLAB_PROJECT_ID,
  GITLAB_TRIGGER_TOKEN,
  GITLAB_ACCESS_TOKEN,
  GITLAB_REF,
} = process.env;

client.once('ready', () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore les bots

  if (message.content === '/build') {
    await message.channel.send('🚀 Déclenchement du pipeline GitLab...');

    try {
      // Déclencher le pipeline
      const triggerResponse = await fetch(
        `https://gitlab.com/api/v4/projects/${GITLAB_PROJECT_ID}/trigger/pipeline`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            token: GITLAB_TRIGGER_TOKEN,
            ref: GITLAB_REF,
          }),
        }
      );

      const triggerData = await triggerResponse.json();

      if (!triggerData.id) {
        console.error(triggerData);
        return message.channel.send(
          '❌ Erreur lors du déclenchement du build.'
        );
      }

      const pipelineId = triggerData.id;
      await message.channel.send(
        `✅ Pipeline #${pipelineId} déclenché. Suivi en cours...`
      );

      // Suivre l'état du pipeline
      let status = 'running';
      while (status === 'running' || status === 'pending') {
        await new Promise((r) => setTimeout(r, 5000)); // attendre 5 secondes

        const statusResponse = await fetch(
          `https://gitlab.com/api/v4/projects/${GITLAB_PROJECT_ID}/pipelines/${pipelineId}`,
          {
            headers: { 'PRIVATE-TOKEN': GITLAB_ACCESS_TOKEN },
          }
        );

        const statusData = await statusResponse.json();
        status = statusData.status;
      }

      if (status === 'success') {
        await message.channel.send(
          `🎉 Pipeline #${pipelineId} terminé avec succès !`
        );
      } else {
        await message.channel.send(
          `❌ Pipeline #${pipelineId} échoué. Statut final: ${status}`
        );
      }
    } catch (error) {
      console.error(error);
      await message.channel.send(
        '❌ Une erreur est survenue lors du déclenchement ou du suivi du pipeline.'
      );
    }
  }
});

client.login(DISCORD_TOKEN);
