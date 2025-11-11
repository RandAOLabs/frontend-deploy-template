# ArcAO Front End Template

This template is part of [ArcAO Templates](https://github.com/orgs/ArcAOGaming/repositories?q=template%3Atrue+archived%3Afalse), designed to help you get your game idea up and running fast!

<div align="center">

[![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge)](https://frontendtemplate_game.ar.io/)

[View Live Demo](https://frontendtemplate_game.ar.io/) • [Development Guide](docs/development.md) • [Deployment Guide](docs/deployment.md)

</div>

A modern web application template built with:
- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [ArNS](https://ar.io/arns/) - The Permaweb Name System for permanent web deployment

This template provides a minimal setup to get started with React development and automated deployment to both the permaweb (via ArNS) and traditional hosting servers.

## Getting Started

For development setup instructions, please see our [Development Guide](docs/development.md).

## Deployment Options

This template supports two deployment methods, both automated via GitHub Actions:

### 1. Permaweb Deployment (Arweave/ArNS)
Deploy your application to the permanent web using Arweave's decentralized storage and ArNS for permanent, censorship-resistant hosting.

**Requirements:**
- Arweave wallet with Turbo Credits
- ArNS name ownership or controller access
- GitHub secrets: `DEPLOY_KEY`
- GitHub variables: `DEPLOY_ARNS_NAME`, `DEPLOY_UNDERNAME` (optional)

📖 [Full Permaweb Deployment Guide](docs/deployment.md)

### 2. Traditional Server Deployment (SSH/SCP)
Deploy your application to a physical server or VPS via SSH/SCP with automatic nginx reload.

**One-Time Setup (choose what applies):**
- 📋 [Server Setup](docs/server-setup.md) - Create deploy user & configure SSH keys
- 🌐 [Nginx & SSL Setup](docs/nginx-setup.md) - Configure nginx web server & SSL certificates

**GitHub Configuration:**
- GitHub secrets: `SSH_PRIVATE_KEY`, `SERVER_IP`

**What's Automated:**
- ✅ Build process
- ✅ Directory creation on server (`/home/deploy/YOUR-REPO-NAME/`)
- ✅ File transfer via SCP
- ✅ Nginx reload

📖 [Complete SSH Deployment Documentation](docs/ssh-deployment.md)

### Deployment Triggers

Both deployments are triggered automatically on every push to the `master` branch. You can disable either workflow by deleting or disabling the respective workflow file in `.github/workflows/`.

### Quick Reference

Need a quick summary of all secrets, variables, and setup steps? Check out the [Deployment Quick Reference](docs/deployment-quick-reference.md).

## License

See [LICENSE](LICENSE) for more information.
