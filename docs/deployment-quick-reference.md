# Deployment Quick Reference

This document provides a quick reference for all secrets, variables, and configuration needed for both deployment methods.

## GitHub Secrets and Variables

### Permaweb Deployment (Arweave/ArNS)

**Secrets** (Settings → Secrets and variables → Actions → Secrets):
- `DEPLOY_KEY` - Your base64-encoded Arweave wallet keyfile
  ```bash
  # Generate on Mac/Linux:
  base64 wallet.json | pbcopy

  # Generate on Windows:
  base64 wallet.json | clip
  ```

**Variables** (Settings → Secrets and variables → Actions → Variables):
- `DEPLOY_ARNS_NAME` - Your ArNS name's ANT process ID (required)
  - Get from: [arns.app/#/manage/names](https://arns.app/#/manage/names)
- `DEPLOY_UNDERNAME` - Optional undername to deploy to (e.g., `staging`, `dev`)
- `GA4_MEASUREMENT_ID` - Your Google Analytics 4 measurement ID (optional)
  - Format: `G-XXXXXXXXXX`

### SSH Deployment (Physical Server)

**Secrets** (Settings → Secrets and variables → Actions → Secrets):
- `SSH_PRIVATE_KEY` - Your SSH private key for the deploy user
  ```bash
  # Display your private key:
  cat ~/.ssh/deploy_key

  # Copy everything including:
  # -----BEGIN OPENSSH PRIVATE KEY-----
  # ...
  # -----END OPENSSH PRIVATE KEY-----
  ```
- `SERVER_IP` - Your server's IP address
  - Example: `192.168.1.100` or `203.0.113.10`

**Hardcoded Values**:
- SSH User: `deploy` (hardcoded in workflow)
- Deploy Path: `/var/www/myapp/html` (customizable in workflow)

## Server Setup Checklist (SSH Deployment)

### One-Time Server Configuration

- [ ] Create `deploy` user on server
- [ ] Generate SSH key pair
- [ ] Add public key to `~deploy/.ssh/authorized_keys`
- [ ] Set correct permissions on `.ssh` directory (700) and `authorized_keys` file (600)
- [ ] Create deploy directory: `/var/www/myapp/html`
- [ ] Set ownership: `chown -R deploy:deploy /var/www/myapp`
- [ ] Configure sudoers to allow `deploy` user to reload nginx without password
- [ ] Install and configure nginx
- [ ] Create nginx site configuration
- [ ] Enable nginx site
- [ ] Test nginx configuration: `sudo nginx -t`

### DNS Configuration (One-Time)

- [ ] Create A record pointing to server IP
- [ ] Create www subdomain A record (if needed)
- [ ] Wait for DNS propagation (up to 48 hours, usually minutes)

### SSL/TLS Certificate Setup (One-Time)

- [ ] Install certbot: `sudo apt install certbot python3-certbot-nginx`
- [ ] Obtain certificate: `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`
- [ ] Test auto-renewal: `sudo certbot renew --dry-run`
- [ ] Certificates auto-renew every 90 days

## Workflow Files

- `.github/workflows/deploy.yml` - Permaweb deployment to Arweave/ArNS
- `.github/workflows/deploy-ssh.yml` - SSH deployment to physical server

Both workflows trigger on push to `master` branch.

## Quick Links

- [Full Permaweb Deployment Guide](deployment.md)
- [Full SSH Deployment Guide](ssh-deployment.md)
- [Development Guide](development.md)

## Common Commands

### Server Management (SSH Deployment)

```bash
# Check nginx status
sudo systemctl status nginx

# Reload nginx configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Test nginx configuration
sudo nginx -t

# View nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check SSL certificate status
sudo certbot certificates

# Renew SSL certificates manually
sudo certbot renew

# Check disk usage
df -h

# Check deploy directory
ls -la /var/www/myapp/html
```

### Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Troubleshooting

### Permaweb Deployment Issues

1. Check GitHub Actions logs for error messages
2. Verify `DEPLOY_KEY` is base64-encoded correctly
3. Verify `DEPLOY_ARNS_NAME` is correct ANT process ID
4. Ensure wallet has sufficient Turbo Credits
5. Ensure wallet owns/controls the ArNS name

### SSH Deployment Issues

1. Check GitHub Actions logs for SSH connection errors
2. Test SSH connection manually: `ssh -i ~/.ssh/deploy_key deploy@SERVER_IP`
3. Verify `SSH_PRIVATE_KEY` includes header and footer
4. Verify `SERVER_IP` is correct
5. Check server firewall allows SSH (port 22)
6. Verify deploy user has correct permissions
7. Check nginx error logs on server

## Security Notes

- Never commit SSH private keys or wallet keys to git
- Store all sensitive data in GitHub Secrets (encrypted)
- Use strong SSH keys (ED25519 or RSA 4096-bit)
- Keep server packages updated
- Use firewall to restrict access (ufw)
- Disable SSH password authentication
- Use minimal permissions for deploy user
- Monitor server logs regularly
