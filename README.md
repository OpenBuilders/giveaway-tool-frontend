# 🎁 Giveaway Tool - Frontend

## Summary

Giveaway Tool is a Telegram Mini App designed for creating and managing transparent giveaways on the TON blockchain. It allows community managers to set up contests with various requirements and prize distribution methods, ensuring a seamless and engaging experience for participants.

### Key Features

* **Giveaway Creation**: Flexible setup for giveaways including title, duration, and winner count.
* **Prize Management**: Support for various prize types including custom prizes and digital assets (Jettons/Tokens).
* **Requirement System**: Comprehensive requirement verification including:
    * Channel Subscriptions
    * Wallet Connection (TON)
    * Token Holding (TON/Jettons)
    * Telegram Premium Status
    * Referral/Boosts
* **Wallet Integration**: Seamless connection with TON wallets via TonConnect.
* **Winner Selection**: Transparent and automated winner selection process.

### Technology Stack

* **Frontend**: React with TypeScript, built with Vite
* **State Management**: Zustand
* **Styling**: Tailwind CSS, SCSS, CSS Modules
* **Blockchain Integration**: TonConnect UI React
* **Platform Integration**: Telegram Web App SDK (@twa-dev/sdk)

## Installation

To install and run the project, follow these steps:

1. **Prerequisites**:
   * Node.js and npm/yarn installed on your machine.

2. **Setup**:
   * Clone the repository:
     ```bash
     git clone <repository-url>
     ```
   * Navigate to the project directory:
     ```bash
     cd giveaway-tool-frontend
     ```
   * Install dependencies:
     ```bash
     npm install
     # or
     yarn install
     ```

3. **Running locally**:
   * Start the development server:
     ```bash
     npm run dev
     # or
     yarn dev
     ```
   * The application should be accessible at the local URL provided by Vite (typically `http://localhost:5173`).

## Configuration

To deploy or run the application in a production environment, ensure your environment variables are set up correctly. 

Build the application for production:
```bash
npm run build
```

## Usage

### Development
The project uses Vite for a fast development experience. 
* `npm run dev`: Starts the development server.
* `npm run build`: Builds the app for production.
* `npm run preview`: Locally preview the production build.
* `npm run lint`: Runs ESLint to check for code quality issues.

## Contributing

We welcome contributions! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes
4. Commit your changes: `git commit -m "Add some feature"`
5. Push to the branch: `git push origin feat/your-feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Acknowledgements

* Giveaway Tool is developed and maintained by Open Builders
* Built with ❤️ for the Telegram and TON communities
* Special thanks to all contributors who have helped shape this project

## Support

For issues, questions, or contributions, please:
* Open an issue on GitHub
* Submit a pull request
* Try the bot: [@giveaway_app_bot](https://t.me/giveaway_app_bot)
* Contact the maintainers

---

**🤖 Bot**: [@giveaway_app_bot](https://t.me/giveaway_app_bot)

Built by [Open Builders](https://github.com/OpenBuilders) | Part of the [Tools.tg](https://tools.tg) ecosystem
