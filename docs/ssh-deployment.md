# SSH Deployment to Physical Server

This guide covers setting up automated deployment to a physical server using SSH/SCP via GitHub Actions.

## Overview

The SSH deployment workflow will:
1. Build your React application
2. Copy the built files to your remote server via SCP
3. Reload nginx to serve the new files

## Server Setup (One-time Configuration)

### 1. Create Deploy User

On your remote server, create a dedicated `deploy` user:

```bash
# Create the deploy user
sudo useradd -m -s /bin/bash deploy

# Create the web directory
sudo mkdir -p /var/www/myapp/html
sudo chown -R deploy:deploy /var/www/myapp
```

### 2. Generate and Configure SSH Keys

On your local machine (or any machine), generate an SSH key pair:

```bash
# Generate ED25519 SSH key (recommended)
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -C "github-actions-deploy"

# OR generate RSA key if ED25519 is not supported
ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key -C "github-actions-deploy"
```

This will create two files:
- `deploy_key` - Private key (keep this secret!)
- `deploy_key.pub` - Public key

### 3. Set Up Authorized Keys on Server

Copy the public key to your server:

```bash
# Copy public key to server
ssh-copy-id -i ~/.ssh/deploy_key.pub deploy@YOUR_SERVER_IP

# OR manually:
# 1. Copy the contents of deploy_key.pub
cat ~/.ssh/deploy_key.pub

# 2. On the server, add it to authorized_keys
sudo mkdir -p /home/deploy/.ssh
sudo nano /home/deploy/.ssh/authorized_keys
# Paste the public key, save and exit

# 3. Set correct permissions
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

### 4. Configure Sudoers for Nginx Reload

The `deploy` user needs permission to reload nginx without entering a password:

```bash
# Edit sudoers file
sudo visudo

# Add this line at the end:
deploy ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx, /bin/systemctl restart nginx
```

Save and exit (Ctrl+X, then Y, then Enter in nano).

### 5. Configure Nginx

Create an nginx configuration for your site:

```bash
sudo nano /etc/nginx/sites-available/myapp
```

Add the following configuration (adjust domain name as needed):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/myapp/html;
    index index.html;

    # Handle React Router (SPA routing)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site and test configuration:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 6. Configure DNS

Point your domain to your server:

1. Log in to your DNS provider (e.g., Cloudflare, Route53, Namecheap)
2. Create an A record:
   - **Name**: `@` (or your subdomain)
   - **Type**: A
   - **Value**: Your server's IP address
   - **TTL**: 300 (or auto)
3. If using `www` subdomain, create another A record:
   - **Name**: `www`
   - **Type**: A
   - **Value**: Your server's IP address

DNS propagation can take up to 24-48 hours, but usually completes within a few minutes to hours.

### 7. Set Up SSL/TLS Certificate (HTTPS)

Use Let's Encrypt for free SSL certificates:

```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain and install certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

# Test automatic renewal
sudo certbot renew --dry-run
```

Certbot will automatically:
- Obtain the SSL certificate
- Modify your nginx configuration
- Set up automatic renewal (certificates expire every 90 days)

Your nginx config will be updated to listen on port 443 (HTTPS) with SSL enabled.

## GitHub Configuration

### Secrets

Add these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions → Secrets):

1. **`SSH_PRIVATE_KEY`**: Your SSH private key
   ```bash
   # Display your private key
   cat ~/.ssh/deploy_key

   # Copy the entire output including:
   # -----BEGIN OPENSSH PRIVATE KEY-----
   # ... (key content) ...
   # -----END OPENSSH PRIVATE KEY-----
   ```

   Paste the entire private key (including header and footer) into the GitHub secret.

2. **`SERVER_IP`**: Your server's IP address
   - Example: `192.168.1.100` or `203.0.113.10`

### Variables

If you're also using the permaweb deployment, you may already have these variables set:

1. **`GA4_MEASUREMENT_ID`** (optional): Your Google Analytics 4 measurement ID
   - Format: `G-XXXXXXXXXX`

## Customization

### Change Deploy Path

If you want to deploy to a different directory:

1. Update the workflow file (`.github/workflows/deploy-ssh.yml`):
   ```yaml
   # Change this line (around line 57)
   scp -i ~/.ssh/deploy_key -r ./dist/* deploy@$SERVER_IP:/your/custom/path/
   ```

2. Update your nginx configuration to point to the new path:
   ```nginx
   root /your/custom/path;
   ```

### Change Deploy User

If you want to use a different username:

1. Update the workflow file to use your username instead of `deploy`
2. Follow the same setup steps but replace `deploy` with your chosen username

## Deployment

Once configured, deployment is automatic:
- Every push to the `master` branch triggers the deployment
- The app is built with environment variables injected
- Files are copied to your server via SCP
- Nginx is reloaded to serve the new files

## Troubleshooting

### SSH Connection Issues

```bash
# Test SSH connection from your local machine
ssh -i ~/.ssh/deploy_key deploy@YOUR_SERVER_IP

# If this works, the GitHub Action should work too
```

### Permission Issues

```bash
# Verify deploy user owns the web directory
ls -la /var/www/myapp
# Should show: drwxr-xr-x deploy deploy

# Fix if needed
sudo chown -R deploy:deploy /var/www/myapp
```

### Nginx Issues

```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test nginx configuration
sudo nginx -t
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

## Security Considerations

- ✅ The `deploy` user has minimal permissions (only nginx reload)
- ✅ SSH key is stored as a GitHub secret (encrypted)
- ✅ Server IP is stored as a secret to avoid exposing it publicly
- ✅ Use strong SSH keys (ED25519 or RSA 4096-bit)
- ✅ Keep your server and packages updated
- ✅ Consider setting up a firewall (ufw) to only allow SSH, HTTP, and HTTPS
- ✅ Use SSH key authentication only (disable password authentication)

### Recommended: Harden SSH

Edit SSH configuration:

```bash
sudo nano /etc/ssh/sshd_config
```

Recommended settings:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Restart SSH:

```bash
sudo systemctl restart sshd
```
