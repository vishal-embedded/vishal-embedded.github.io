# 🚀 Hosting Your Portfolio on GitHub Pages

This guide walks you through deploying your personal portfolio website to **GitHub Pages** completely free, with global CDN delivery, automated HTTPS (SSL), and support for custom domains.

---

## 📋 What You Get with GitHub Pages
- **Zero Cost**: 100% free hosting permanently with no credit card required.
- **Fast Global CDN**: Backed by Fastly & GitHub global edge servers.
- **Instant Deployment**: Every `git push` deploys your latest updates in under 60 seconds.
- **Print-Perfect PDF Resume**: Direct high-speed download of `Vishal_Nagarajan_Resume.pdf`.
- **Fully Working Secret Admin & CRM**: Accessible via `/#admin` and `Alt + A` on your live site.
- **Custom Domain Ready**: Point any domain (e.g., `vishalnagarajan.in` or `vishal.dev`) whenever you want.

---

## 🛠️ Step 1: Create a Repository on GitHub

1. Open your browser and go to [github.com/new](https://github.com/new) (sign in to your GitHub account).
2. Choose your repository name:
   - **Option A (Sub-path URL)**: Name it `portfolio`.
     - Your site URL will be: `https://<your-username>.github.io/portfolio/`
   - **Option B (Root User Domain — Recommended)**: Name it `<your-username>.github.io`.
     - Your site URL will be clean and direct: `https://<your-username>.github.io/`
3. Set the repository visibility to **Public**.
4. **Do not** check "Add a README file", ".gitignore", or "license" (we already have everything set up locally).
5. Click **Create repository**.

---

## 💻 Step 2: Push Your Local Files to GitHub

Open **Terminal** on your Mac and run the following commands one by one:

```bash
# 1. Navigate to your portfolio directory
cd /Users/vishal/Documents/portfolio

# 2. Initialize git repository
git init
s

# 3. Add all files to git tracking
git add .

# 4. Create your initial commit
git commit -m "Initial commit: Vishal Nagarajan Embedded Portfolio"

# 5. Set default branch to main
git branch -M main

# 6. Link to your GitHub repository (replace with your actual GitHub username & repo name)
git remote add origin https://github.com/<your-username>/portfolio.git

# 7. Push all files to GitHub
git push -u origin main
```

*(If prompted by GitHub for credentials, use your GitHub username and a **Personal Access Token** or authenticate via GitHub CLI / browser).*

---

## ⚙️ Step 3: Enable GitHub Pages

Once your files are pushed to GitHub:

1. On your GitHub repository page, click the **Settings** tab (the gear icon at the top).
2. In the left-hand navigation sidebar, scroll down to **Code and automation** and click **Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Under **Branch**:
   - Select **`main`** from the branch dropdown.
   - Keep the folder set to **`/(root)`**.
5. Click **Save**.
6. Wait 1 to 2 minutes. Refresh the page until you see a green banner:
   > **Your site is live at `https://<your-username>.github.io/portfolio/`**

---

## 🌐 Step 4: (Optional) Adding a Custom Domain

If you own a custom domain (e.g., `vishalnagarajan.in` or `vishal.dev`):

1. Go to **Settings > Pages** in your GitHub repository.
2. In the **Custom domain** box, type your domain (e.g., `vishalnagarajan.in`) and click **Save**.
3. Check the box for **Enforce HTTPS** (GitHub will automatically provision a free Let's Encrypt SSL certificate).
4. In your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains):
   - Add a `CNAME` record: `www` pointing to `<your-username>.github.io`
   - Add `A` records for the apex domain pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

---

## 🔒 Accessing Your Secret Admin Console on GitHub Pages

The admin panel and CRM are completely invisible to public visitors on your live website:

### How to Open the Console:
You can use any of these 3 discreet methods on your live URL:
1. **Keyboard Shortcut**: Press **`Alt + A`** or **`Cmd + Shift + A`** (on Mac) from anywhere on the page.
2. **URL Hash**: Add `#admin` to your website URL:
   ```
   https://<your-username>.github.io/portfolio/#admin
   ```
3. **Discreet Footer Click**: Click the copyright text **`© 2026 Vishal Nagarajan`** at the bottom of the page.

### Admin Passcode:
```
Vishal2004!
```
*(Enter this passcode and click "Unlock Console". Password is required every time the console opens for security).*

---

## ⚡ Live CRM Features on Your Hosted Site

- **Inbound Leads CRM**: Inquiries sent through your portfolio contact form are automatically captured inside the CRM tab with 1-click **Export Leads (CSV)**.
- **Live Skills & Silicon Manager**: Add new chips, microcontrollers, protocols, or languages in the `⚡ Skills & Silicon` tab at any time; changes sync instantly.
- **Projects & Work Experience**: Add or edit projects and career milestones as you complete them.
- **Full JSON Backup**: Go to `Google Sites & Sync` > **Download Full Backup (JSON)** to save your customized configuration anytime.

---

## 🔄 How to Push Updates in the Future

Whenever you update your code or add new files locally, deploy your updates with these 3 quick commands:

```bash
cd /Users/vishal/Documents/portfolio
git add .
git commit -m "Update portfolio content"
git push
```

Your live GitHub Pages website will automatically rebuild and update within 60 seconds!
