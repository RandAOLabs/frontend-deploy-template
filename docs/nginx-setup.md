# Nginx & SSL Setup

This is a **one-time setup** for configuring nginx web server and SSL certificates for your deployment.

## Prerequisites

- Server setup completed ([Server Setup Guide](server-setup.md))
- A domain name pointing to your server's IP address
- Root or sudo access to the server

## Step 1: Install Nginx

SSH into your server and install nginx:

```bash
# Update package lists
sudo apt update

# Install nginx
sudo apt install nginx -y

# Start nginx and enable it to start on boot
sudo systemctl start nginx
sudo systemctl enable nginx

# Check nginx status
sudo systemctl status nginx
# Should show: active (running)
```

Test that nginx is working:
- Open your browser and go to `http://YOUR_SERVER_IP`
- You should see the default nginx welcome page

## Step 2: Configure DNS

Before setting up nginx, ensure your domain points to your server.

### On Your DNS Provider (e.g., Cloudflare, Route53, Namecheap):

1. **Create an A record for your domain:**
   - **Type:** A
   - **Name:** `@` (for root domain like `example.com`)
   - **Value:** Your server's IP address
   - **TTL:** 300 or Auto

2. **Create an A record for www subdomain** (optional but recommended):
   - **Type:** A
   - **Name:** `www`
   - **Value:** Your server's IP address
   - **TTL:** 300 or Auto

3. **Wait for DNS propagation** (usually 5-60 minutes, can take up to 48 hours)

### Verify DNS Propagation

```bash
# Check if your domain resolves to your server IP
nslookup yourdomain.com

# OR
dig yourdomain.com

# The output should show your server's IP address
```

## Step 3: Create Nginx Configuration

Now create a nginx configuration for your site.

**Important:** You need to hardcode your actual GitHub repository name in this config.

### Find Your Repository Name

Your repository name is the last part of your GitHub URL:
- GitHub URL: `https://github.com/username/my-awesome-app`
- Repository name: `my-awesome-app`

The workflow will deploy to: `/home/deploy/my-awesome-app/`

### Create the Config File

```bash
# Replace YOUR-REPO-NAME with your actual repository name
# Example: If repo is "my-awesome-app", use that name
sudo nano /etc/nginx/sites-available/YOUR-REPO-NAME
```

### Nginx Configuration Template

Paste this configuration, **replacing the placeholders**:

```nginx
server {
    listen 80;
    listen [::]:80;

    # REPLACE with your actual domain(s)
    server_name yourdomain.com www.yourdomain.com;

    # REPLACE 'YOUR-REPO-NAME' with your actual GitHub repository name
    # This must match your repository name exactly!
    # Example: If your repo is "github.com/username/my-game"
    # Then use: root /home/deploy/my-game;
    root /home/deploy/YOUR-REPO-NAME;

    index index.html;

    # Handle React Router (SPA routing)
    # This ensures all routes go to index.html for client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets for better performance
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression for faster loading
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Log files
    access_log /var/log/nginx/YOUR-REPO-NAME_access.log;
    error_log /var/log/nginx/YOUR-REPO-NAME_error.log;
}
```

Save and exit (Ctrl+X, Y, Enter).

### Configuration Breakdown

- **`server_name`**: Your domain name(s)
- **`root`**: Where your built React app files are deployed
- **`try_files $uri $uri/ /index.html`**: Handles React Router - all routes serve index.html
- **Cache control**: Static assets cached for 1 year for better performance
- **Security headers**: Basic security headers for XSS, clickjacking protection
- **Gzip**: Compresses files for faster loading

## Step 4: Enable the Site

```bash
# Create symbolic link to enable the site
# Replace YOUR-REPO-NAME with your actual repository name
sudo ln -s /etc/nginx/sites-available/YOUR-REPO-NAME /etc/nginx/sites-enabled/

# Test nginx configuration for syntax errors
sudo nginx -t
# Should output: syntax is ok, test is successful

# If there are errors, go back and fix your config file
# Common issues: missing semicolons, wrong paths, typos

# Reload nginx to apply changes
sudo systemctl reload nginx
```

## Step 5: Test Initial Setup

At this point, you should be able to access your site via HTTP (not HTTPS yet).

```bash
# Check nginx is serving your domain
curl -I http://yourdomain.com

# Should return "200 OK" or "404 Not Found" (404 is ok - no files deployed yet)
```

If you get errors, check nginx logs:

```bash
# Check error logs
sudo tail -f /var/log/nginx/YOUR-REPO-NAME_error.log

# Check nginx status
sudo systemctl status nginx
```

## Step 6: Set Up SSL with Certbot (Let's Encrypt)

Now let's add HTTPS with a free SSL certificate from Let's Encrypt.

### Install Certbot

```bash
# Install certbot and nginx plugin
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Verify installation
certbot --version
```

### Obtain SSL Certificate

```bash
# Replace with your actual domain(s)
# Include both root domain and www subdomain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:

1. **Enter email address**: Your email for renewal notifications
   ```
   Enter email address: you@example.com
   ```

2. **Agree to Terms of Service**: Type `Y`
   ```
   Please read the Terms of Service at...
   (Y)es/(N)o: Y
   ```

3. **Share email with EFF** (optional): Type `Y` or `N`
   ```
   (Y)es/(N)o: N
   ```

4. **Redirect HTTP to HTTPS**: Choose option 2 (recommended)
   ```
   Please choose whether or not to redirect HTTP traffic to HTTPS...
   1: No redirect
   2: Redirect - Make all requests redirect to secure HTTPS access
   Select the appropriate number [1-2] then [enter]: 2
   ```

Certbot will:
- Verify you own the domain
- Obtain SSL certificate
- Automatically modify your nginx config
- Set up auto-renewal

You should see:
```
Congratulations! Your certificate and chain have been saved...
```

### Verify SSL is Working

1. Open your browser and go to `https://yourdomain.com`
2. You should see a padlock icon in the address bar
3. No files are deployed yet, so you might see a 404 or nginx error page - this is normal

Check certificate details:
```bash
sudo certbot certificates
```

## Step 7: Test Auto-Renewal

SSL certificates expire every 90 days. Certbot sets up automatic renewal, but let's test it:

```bash
# Test renewal process (dry run - doesn't actually renew)
sudo certbot renew --dry-run

# Should output: Congratulations, all simulated renewals succeeded
```

If successful, certbot will automatically renew your certificates before they expire.

### Manual Renewal (if needed)

```bash
# Manually renew all certificates
sudo certbot renew

# Reload nginx after renewal
sudo systemctl reload nginx
```

## Step 8: View Your Updated Nginx Config

After certbot modifies your config, view it:

```bash
# View your updated config
sudo cat /etc/nginx/sites-available/YOUR-REPO-NAME
```

**Certbot automatically adds SSL configuration.** Your config will now look like this:

```nginx
# HTTP - Redirects to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Certbot adds this redirect
    return 301 https://$server_name$request_uri;
}

# HTTPS - Serves your app with SSL
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificate paths - Certbot adds these
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Your original configuration
    root /home/deploy/YOUR-REPO-NAME;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    access_log /var/log/nginx/YOUR-REPO-NAME_access.log;
    error_log /var/log/nginx/YOUR-REPO-NAME_error.log;
}
```

**Key changes certbot made:**
- ✅ Split into two server blocks (HTTP redirect + HTTPS serving)
- ✅ Added SSL certificate paths: `ssl_certificate` and `ssl_certificate_key`
- ✅ Added `listen 443 ssl http2;` for HTTPS
- ✅ HTTP (port 80) now redirects to HTTPS (port 443)
- ✅ Included Let's Encrypt's recommended SSL settings

## Verification Checklist

- [ ] Nginx installed and running
- [ ] DNS configured (domain points to server IP)
- [ ] DNS propagation complete (domain resolves correctly)
- [ ] Nginx config created with hardcoded repository name
- [ ] Nginx config enabled and syntax tested
- [ ] Site accessible via HTTP
- [ ] Certbot installed
- [ ] SSL certificate obtained for your domain
- [ ] Site accessible via HTTPS with padlock icon
- [ ] HTTP automatically redirects to HTTPS
- [ ] Auto-renewal test successful

## Final Test

Once you push code to the `master` branch, your GitHub Action will:

1. Build your React app
2. SSH into your server as `deploy` user
3. Create `/home/deploy/YOUR-REPO-NAME/` (automatically)
4. Copy files to that directory
5. Reload nginx

Then visit `https://yourdomain.com` to see your deployed app!

## Troubleshooting

### "502 Bad Gateway" Error

This usually means nginx can't find the files:

```bash
# Check if the deployment directory exists
ls -la /home/deploy/YOUR-REPO-NAME/

# Check if files are there
ls -la /home/deploy/YOUR-REPO-NAME/

# Check nginx error logs
sudo tail -f /var/log/nginx/YOUR-REPO-NAME_error.log
```

### "404 Not Found" on All Routes Except Home

The `try_files` directive might be missing or incorrect. Check your nginx config has:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### "Permission Denied" in Nginx Logs

```bash
# Ensure deploy user owns the directory
ls -la /home/deploy/

# Fix ownership if needed
sudo chown -R deploy:deploy /home/deploy/YOUR-REPO-NAME

# Ensure nginx can read the files (check permissions)
sudo chmod 755 /home/deploy/YOUR-REPO-NAME
```

### SSL Certificate Errors

```bash
# Check certificate status
sudo certbot certificates

# Check certificate expiry date
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Renew certificate manually
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### Nginx Won't Reload After Deployment

```bash
# Check if deploy user can reload nginx
sudo -u deploy sudo systemctl reload nginx

# If this fails, verify sudoers file has:
deploy ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx, /bin/systemctl restart nginx

# Re-edit sudoers if needed
sudo visudo
```

## Useful Nginx Commands

```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx (picks up config changes)
sudo systemctl reload nginx

# Restart nginx (full restart)
sudo systemctl restart nginx

# Stop nginx
sudo systemctl stop nginx

# Start nginx
sudo systemctl start nginx

# Check nginx status
sudo systemctl status nginx

# View error logs (live)
sudo tail -f /var/log/nginx/error.log

# View access logs (live)
sudo tail -f /var/log/nginx/access.log

# View your site's error logs
sudo tail -f /var/log/nginx/YOUR-REPO-NAME_error.log

# View your site's access logs
sudo tail -f /var/log/nginx/YOUR-REPO-NAME_access.log
```

## Next Steps

Your server is now fully configured!

To deploy your app:
1. Commit and push your code to the `master` branch
2. GitHub Actions will automatically build and deploy
3. Visit `https://yourdomain.com` to see your live site

## Security Hardening (Optional but Recommended)

### Add More Security Headers

Edit your nginx config and add these headers for better security:

```nginx
# Add these to your server block
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### Enable Fail2Ban (Prevents Brute Force Attacks)

```bash
# Install fail2ban
sudo apt install fail2ban -y

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

### Regular Maintenance

```bash
# Keep server updated (run monthly)
sudo apt update && sudo apt upgrade -y

# Check disk usage
df -h

# Check memory usage
free -h

# View system logs for issues
sudo journalctl -xe
```
