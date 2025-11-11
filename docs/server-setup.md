# Server Setup - Deploy User & SSH Keys

This is a **one-time setup** for your server to enable automated deployments via GitHub Actions.

## Prerequisites

- A server or VPS with SSH access (Ubuntu/Debian recommended)
- Root or sudo access to the server
- Basic command line knowledge

## Step 1: Create the Deploy User

SSH into your server and create a dedicated `deploy` user:

```bash
# Create the deploy user with a home directory
sudo useradd -m -s /bin/bash deploy

# Verify the user was created
id deploy
# Should output: uid=1001(deploy) gid=1001(deploy) groups=1001(deploy)
```

**Important:** The deploy user does NOT need sudo access for most operations. We'll configure specific nginx permissions later.

## Step 2: Configure Sudoers for Nginx

Allow the `deploy` user to reload nginx without a password:

```bash
# Edit sudoers file (always use visudo for safety)
sudo visudo
```

Add this line at the end of the file:

```
deploy ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx, /bin/systemctl restart nginx
```

Save and exit:
- In nano: `Ctrl+X`, then `Y`, then `Enter`
- In vim: `Esc`, then `:wq`, then `Enter`

**Security Note:** This allows the `deploy` user to run ONLY these two specific nginx commands with sudo. They cannot run any other sudo commands.

## Step 3: Generate SSH Key Pair

On your **local machine** (not the server), generate a new SSH key pair:

```bash
# Generate ED25519 SSH key (recommended - more secure and faster)
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -C "github-actions-deploy"

# OR use RSA if your server doesn't support ED25519
ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key -C "github-actions-deploy"
```

When prompted:
- **Enter passphrase:** Leave blank (press Enter) - GitHub Actions needs passwordless keys
- **Enter same passphrase again:** Press Enter

This creates two files:
- `~/.ssh/deploy_key` - **Private key** (keep secret!)
- `~/.ssh/deploy_key.pub` - **Public key** (safe to share)

## Step 4: Install Public Key on Server

Copy the public key to your server:

### Option A: Using ssh-copy-id (easiest)

```bash
# Replace YOUR_SERVER_IP with your actual server IP
ssh-copy-id -i ~/.ssh/deploy_key.pub deploy@YOUR_SERVER_IP
```

### Option B: Manual installation

If `ssh-copy-id` doesn't work:

```bash
# 1. Display your public key
cat ~/.ssh/deploy_key.pub

# 2. Copy the output (it's one long line starting with ssh-ed25519 or ssh-rsa)

# 3. SSH into your server as root or sudo user
ssh root@YOUR_SERVER_IP

# 4. Create .ssh directory for deploy user
sudo mkdir -p /home/deploy/.ssh

# 5. Create and edit authorized_keys file
sudo nano /home/deploy/.ssh/authorized_keys

# 6. Paste the public key (right-click or Ctrl+Shift+V)
# Save and exit (Ctrl+X, Y, Enter)

# 7. Set correct permissions (very important!)
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

## Step 5: Test SSH Connection

From your local machine, test the SSH connection:

```bash
# Replace YOUR_SERVER_IP with your actual server IP
ssh -i ~/.ssh/deploy_key deploy@YOUR_SERVER_IP

# You should be logged in as the deploy user without a password
# You should see a prompt like: deploy@servername:~$

# Test that you're the deploy user
whoami
# Should output: deploy

# Exit the SSH session
exit
```

If this works, your SSH setup is complete!

## Step 6: Add SSH Key to GitHub Secrets

1. **Copy your private key** (not the .pub file!):
   ```bash
   # Display the private key
   cat ~/.ssh/deploy_key

   # Copy everything from -----BEGIN OPENSSH PRIVATE KEY-----
   # to -----END OPENSSH PRIVATE KEY----- (inclusive)
   ```

2. **Add to GitHub:**
   - Go to your GitHub repository
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `SSH_PRIVATE_KEY`
   - Value: Paste the entire private key
   - Click **Add secret**

3. **Add your server IP:**
   - Click **New repository secret**
   - Name: `SERVER_IP`
   - Value: Your server's IP address (e.g., `192.168.1.100`)
   - Click **Add secret**

## Verification Checklist

- [ ] `deploy` user created on server
- [ ] Sudoers configured for nginx reload (deploy user can run ONLY nginx commands)
- [ ] SSH key pair generated on local machine
- [ ] Public key installed in `/home/deploy/.ssh/authorized_keys`
- [ ] Permissions set correctly (700 for .ssh, 600 for authorized_keys)
- [ ] SSH connection tested and working
- [ ] `SSH_PRIVATE_KEY` added to GitHub Secrets
- [ ] `SERVER_IP` added to GitHub Secrets

## What Happens During Deployment

With this setup complete, when you push to the `master` branch:

1. GitHub Actions builds your React app
2. Connects to your server as the `deploy` user via SSH
3. **Automatically creates** `/home/deploy/YOUR-REPO-NAME/` directory (no manual creation needed!)
4. Copies built files to that directory
5. Reloads nginx to serve the new files

## Troubleshooting

### "Permission denied (publickey)"

```bash
# Check permissions on server
ls -la /home/deploy/.ssh/
# .ssh should be 700, authorized_keys should be 600

# Fix permissions if needed
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

### "Connection refused"

```bash
# Check if SSH service is running
sudo systemctl status sshd

# Start if not running
sudo systemctl start sshd
```

### "deploy is not in the sudoers file"

This is normal! The deploy user should NOT be a full sudoer. They only need the specific sudoers entry for nginx commands (see Step 2).

## Next Steps

Once this server setup is complete, proceed to:
- [Nginx & SSL Setup](nginx-setup.md) - Configure nginx and SSL certificates

## Security Best Practices

### Disable Password Authentication (Recommended)

After confirming SSH key authentication works:

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Find and set these values:
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no

# Save and restart SSH
sudo systemctl restart sshd
```

**Warning:** Make sure SSH key authentication works BEFORE disabling password auth!

### Set Up a Firewall

```bash
# Install ufw (Uncomplicated Firewall)
sudo apt update
sudo apt install ufw

# Allow SSH (important - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Keep Server Updated

```bash
# Update package lists and upgrade packages
sudo apt update && sudo apt upgrade -y

# Enable automatic security updates (Ubuntu/Debian)
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```
