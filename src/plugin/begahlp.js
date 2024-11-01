import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios';

const searchRepo = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['menu', 'help', 'list'];

  if (validCommands.includes(cmd)) {
    const repoUrl = `https://api.github.com/repos/Kingbega/BARAKA-MD`;
    
    await handleRepoCommand(m, Matrix, repoUrl);
  }
};

const handleRepoCommand = async (m, Matrix, repoUrl) => {
  try {
    const response = await axios.get(repoUrl);
    const repoData = response.data;

    const {
      full_name,
      name,
      forks_count,
      stargazers_count,
      created_at,
      updated_at,
      owner,
    } = repoData;

    const messageText = `╭─────═━┈┈━═──━┈⊷
┇ _ʙᴏᴛ ɴᴀᴍᴇ_ : *_ʙᴀʀᴀᴋᴀ-ᴍᴅ_*
┇ _ᴠᴇʀꜱɪᴏɴ_ : *_7.1.0_*     
┇ _ᴘʟᴀᴛғᴏʀᴍ_ : *_ʟɪɴᴜx_*
┇ _ᴅᴇᴠ_ : *_ᴍʀ ʙᴀʀᴀᴋᴀ_*
┇ _ʀᴀᴍ_ : *_20GB.14GB_*
┇ _ᴅᴀɪʟʏ ᴜsᴇʀs_ : *${forks_count}*
┇ _ᴄʀᴇᴀᴛᴇᴅ ᴏɴ_ : *${new Date(created_at).toLocaleDateString()}*
╰─────═━┈┈━═──━┈⊷ 
    `;

    const repoMessage = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: messageText,
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '𝗕𝗘𝗦𝗧 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗕𝗢𝗧\n\n𝗠𝗔𝗗𝗘 𝗕𝗬 𝗕𝗔𝗥𝗔𝗞𝗔 𝗕𝗘𝗚𝗔',
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({
                image: {
                  url: 'https://telegra.ph/file/346b2fb749a7255defe87.jpg',
                },
              }, { upload: Matrix.waUploadToServer })),
              title: '',
              gifPlayback: true,
              subtitle: '',
              hasMediaAttachment: false,
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: "📜 COMMAND LIST",
                    id: ".command",
                  }),
                },
                 {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: "⏳ PING",
                    id: ".ping",
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: "📂 REPO",
                    url: 'https://github.com/Kingbega/BARAKA-MD',
                  }),
                },
                {
                 name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: "📽 BOTS IMAGE",
                    url: 'https://telegra.ph/file/346b2fb749a7255defe87.jpg',
                  }),
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: "🛰 WHATSAPP CHANNEL",
                    url: 'https://whatsapp.com/channel/0029Vail87sIyPtQoZ2egl1h',
                  }),
                },
              ],
            }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9999,
              isForwarded: true,
            },
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(repoMessage.key.remoteJid, repoMessage.message, {
      messageId: repoMessage.key.id,
    });
    await m.React('🚨');
  } catch (error) {
    console.error('Error processing your request:', error);
    m.reply('Error processing your request.');
    await m.React('🚨');
  }
};

export default searchRepo;