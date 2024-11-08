![Alt text](/.github/preview.png)

<div style="">
      <div style="display: flex; align-items: center">
        <img src="https://cdn.iconscout.com/icon/free/png-512/free-buymeacoffee-3521318-2944737.png?f=webp&w=256" width="17" height="17">
        <span style="padding-left: 15px"><strong>Like my bot? Buy me a coffee. Thanks for your support!</strong></span>
    </div>
    <div style="display: flex;margin-top: 5px; align-items: center">
        <img src="https://metamask.io/images/metamask-logo.png" width="17" height="17">
        <span style="padding-left: 15px"><strong>0x251d1EA8113549B6874cF30e32C2030f423BB655</strong></span>
    </div>
</div>


### 📜 **Script features**
- caching telegram web data for 24 hours to avoid flood ban
- real user agents (android)
- proxy binding to an account
- support running on multiple accounts (single-threaded execution in parallel mode)
---
### 🤖 **Automator functionality**
- claim
---
### 📝 Settings via .env file
| Property                 | Description                                                                             |
|--------------------------|-----------------------------------------------------------------------------------------|
| 🔑 **API_ID / API_HASH** | Telegram client app credentials ([FYI](https://core.telegram.org/api/obtaining_api_id)) |
---
### 📥 Installation

1. Download & install nodejs >= 16 (preferably 16.20.2):
 - [link for Windows](https://nodejs.org/dist/v16.20.2/node-v16.20.2-x64.msi)
 - [link for Linux & macOS](https://nodejs.org/en/download/package-manager)
2. Clone the repository
3. Create an .env file and insert your values (variables in .env-example)
4. `npm install`

### 🚀 Startup

##### Create account
1. `npm run start`
2. Select **Add new account** and follow the instructions
##### Run automator
- `npm run start` --> Select **Run automator**
-  **either**
- `npm run start:au`

### 🤝 For contributors
- before creating a pull request, run the following commands and fix the errors if necessary:
  - `npm run type-check` (typescript typing check)
  - `npm run lint` (running eslint)
