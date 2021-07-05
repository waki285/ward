// Packages
const Discord = require('discord.js');
const { Signale } = require('signale');
const pool = require('./pool');
// Config
const config = require('./config.json');

// Variables
const intents = new Discord.Intents();
const client = new Discord.Client({ ws: { intents: intents.ALL } });
const logger = new Signale({ scope: 'Discord' });
const disbtn = require("discord.js-buttons")(client);


function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
client.on('ready', () => {
  logger.success('ログイン完了！');
});
  client.on('message', message => {
    if (message.author.bot) return;
  const args = message.content
    .slice(5)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
//  logger.info("HA=HA!")
  if (message.content.startsWith("!!!!!verifybutton") && message.author.id === "1234567890"/*あなたのID*/) {
    logger.star("認証ボタンを作成しました。");
    const botan = new disbtn.MessageButton()
      .setID("verify")
      .setStyle("green")
      .setLabel("認証")
    message.channel.send({embed: {
      title: "認証について",
      description: "下のボタンを押すと認証のためのhCaptchaリンクがDMに送信されます。\nDMが届かない方は、下画像の設定を「オン」にしてください。\n(DMで届いたサイト先で「安全ではありません」という表示が出ることがありますが、サイトは安全なので、「詳細」→「安全でないこのサイトにアクセス」をお選びください。)",
      image: {url: "https://media.discordapp.net/attachments/798922824349646938/860768481245790248/unknown.png" },
      color: 0x00ff00
    }, buttons: [botan]});
  } else if (message.content.startsWith("!!!!!verifybutton")) {
    logger.warn("他の人が認証コマンドを実行しました。")
  }
})


// Events
// Send user the captcha when they join the server
client.on('clickButton', async button => {
  await button.think(true);
    const linkID = pool.createLink(button.clicker.user.id);
    const embed = new Discord.MessageEmbed()
        .setTitle('認証システム')
        .setDescription(`次のリンクを15分以内に訪れて、認証してください。.\nhttps://${config.domain}/verify/${linkID}`)
        .setColor('BLUE');
    button.clicker.user.send(embed).then(() => {
      button.reply.edit("DMに送信しました。")
      logger.pending("DMにリンクを送信しました。認証を待っています。");
    }).catch(async () => {
        logger.error(`${button.clicker.user.tag}にメッセージを送れませんでした！`);
        button.reply.edit(`<@!${button.clicker.user.id}>さんにメッセージを送れませんでした。代わりにここにリンクを表示します。\nhttps://${config.domain}/verify/${linkID}`)
        return;
    });
});

// Add verified role to user
async function addRole(userID) {
    try {
        const guild = await client.guilds.fetch(config.discord['guild-id']);
        const member = await guild.members.fetch(userID);
        config.discord['verified-role-id'].forEach(async role => {
          const roll = await guild.roles.fetch(role)
        member.roles.add(roll).catch((err) => {
            logger.error(`${member.user.tag}にロールを付与できませんでした！Reason: ${err}`);
            return;
        });
        await sleep(1000)
        });
        logger.success(`${member.user.tag}にロールを付与しました。`);
        member.send("認証が完了しました。")
    } catch (e) {
        logger.error(`${userID}にロールを付与できませんでした！!Reason: ${e}`);
    }
}

module.exports = {
//    run: main,
    addRole,
//    message: message,
//    button
};

logger.pending('ログイン中...');
client.login(config.discord.token).catch(() => {
  logger.fatal('ログインに失敗しました！');
  process.exit(1);
}).then(() => {});
