# 🔑 ward
A Discord verification bot using hCaptcha.

## 🧳 Requirements
* node.js (I used v12.18.1)

## 🔌 Installation
```
npm i
```

## 📘 Setup
Register a site with hCaptcha and choose reCAPTCHA v2 "I'm not a robot" Checkbox. Now on your reCAPTCHA dashboard copy the secret and public key into the config.json file. Add your Discord bot token, guild ID, and role ID into config.json aswell. If you are using a domain add it in the config.json file, if you are using HTTPS, enable it in the config add your certificate and private key file with the names: `certificate.pem` and `private.pem`.

.envに`hcaptchasitekey`と`hcaptchasecret`を追加してください

## 🕹️ Usage
```
npm start
```

## ❓ Issues
### Not receiving a DM when joining my server
If you are not receiving a DM when joining your server, set `privileged-intents` to `true` in the config, and go to your Discord bot dashboard and enable both intents. Note: If your bot is more than 100 servers, you will have to verify your bot.
### Bot failing to login
If you have `privileged-intents` set to `true` in the config, you must go to your Discord bot dashboard and enable both intents. Note: If your bot is more than 100 servers, you will have to verify your bot.

![Intents](https://i.imgur.com/D2fDMjE.png)


## 📷 Preview
![Embed](https://i.imgur.com/zomEnpw.png)
![Website](https://i.imgur.com/tmrcyjF.png)
