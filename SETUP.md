# ERPNext Headless Demo Setup Guide

This guide will help you set up the Next.js ERPNext Headless Demo for educational management.

## Prerequisites

- Node.js 18+ installed
- Access to an ERPNext instance with Education module
- Basic knowledge of ERPNext and Next.js

## Step 1: ERPNext Setup

### Option A: Use ERPNext Cloud (Recommended for beginners)

1. **Sign up for ERPNext Cloud**
   - Visit [frappecloud.com](https://frappecloud.com)
   - Create a new account
   - Choose a plan (free trial available)

2. **Create a new site**
   - Click "New Site"
   - Choose a site name (e.g., `your-school.erpnext.com`)
   - Select region closest to you
   - Wait for site creation (5-10 minutes)

3. **Enable Education Module**
   - Login to your new ERPNext site
   - Go to **Setup > Module Settings**
   - Find and enable **Education** module
   - Refresh the page

4. **Configure Education Settings**
   - Go to **Education > Settings > Education Settings**
   - Set up basic configurations:
     - Academic Year naming
     - Student naming series
     - Default academic term

### Option B: Local ERPNext Installation

1. **Install ERPNext using Docker**
   ```bash
   git clone https://github.com/frappe/frappe_docker.git
   cd frappe_docker
   cp example.env .env
   ```

2. **Edit .env file**
   ```env
   ERPNEXT_VERSION=version-14
   FRAPPE_VERSION=version-14
   DB_PASSWORD=admin
   ```

3. **Start ERPNext**
   ```bash
   docker-compose up -d
   ```

4. **Create a new site**
   ```bash
   docker-compose exec backend bench new-site mysite.local --admin-password admin
   docker-compose exec backend bench --site mysite.local install-app education
   ```

## Step 2: Generate API Credentials

### Method A: API Keys (Recommended)

1. **Login to ERPNext as Administrator**
2. **Go to User Settings**
   - Click on your profile picture
   - Select "My Settings"
3. **Generate API Keys**
   - Scroll down to "API Access" section
   - Click "Generate Keys"
   - Copy both API Key and API Secret
   - Store them securely

### Method B: Create API User

1. **Create a new user**
   - Go to **Setup > Users and Permissions > User**
   - Click "New"
   - Fill in details:
     - Email: `api@yourschool.com`
     - First Name: `API User`
     - Role: System Manager, Education Manager

2. **Set password**
   - Set a strong password
   - Note down the credentials

## Step 3: Next.js Application Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-erpnext-headless-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Edit .env.local**
   ```env
   # Your ERPNext site URL
   NEXT_PUBLIC_ERPNEXT_BASE_URL=https://your-school.erpnext.com
   NEXT_PUBLIC_ERPNEXT_SITE_NAME=your-school

   # API Key method (recommended)
   ERPNEXT_API_KEY=your_api_key_here
   ERPNEXT_API_SECRET=your_api_secret_here

   # OR Username/Password method
   # ERPNEXT_USERNAME=your_username
   # ERPNEXT_PASSWORD=your_password
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Visit http://localhost:3000
   - You should see the login page

## Step 4: Test the Connection

1. **Login to the application**
   - Use your ERPNext credentials
   - For demo: Username: `Administrator`, Password: `admin`

2. **Verify dashboard loads**
   - You should see the dashboard with statistics
   - Check if data is loading from ERPNext

3. **Test CRUD operations**
   - Try creating a new student
   - Verify it appears in ERPNext
   - Test editing and deleting

## Step 5: Configure ERPNext Data

### Create Sample Academic Year

1. **Go to Education > Setup > Academic Year**
2. **Create new Academic Year**
   - Academic Year: `2024-25`
   - Year Start Date: `2024-04-01`
   - Year End Date: `2025-03-31`
   - Check "Is Default"

### Create Sample Programs

1. **Go to Education > Setup > Program**
2. **Create programs like:**
   - Computer Science Engineering
   - Business Administration
   - Elementary Education

### Create Sample Courses

1. **Go to Education > Setup > Course**
2. **Create courses like:**
   - Mathematics
   - English
   - Science
   - History

### Create Student Categories

1. **Go to Education > Setup > Student Category**
2. **Create categories like:**
   - Regular
   - Scholarship
   - International

## Step 6: Troubleshooting

### Common Issues

1. **CORS Errors**
   - Add your Next.js domain to ERPNext CORS settings
   - Go to **Setup > System Settings**
   - Add `http://localhost:3000` to allowed origins

2. **Authentication Failed**
   - Verify API keys are correct
   - Check if user has proper permissions
   - Ensure Education module is enabled

3. **Module Not Found Errors**
   - Install Education app: `bench --site sitename install-app education`
   - Restart ERPNext: `bench restart`

4. **Connection Refused**
   - Check if ERPNext is running
   - Verify the URL in .env.local
   - Check firewall settings

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

### API Testing

Test your ERPNext API directly:
```bash
curl -X GET "https://your-site.erpnext.com/api/resource/Student" \
  -H "Authorization: token api_key:api_secret"
```

## Step 7: Production Deployment

### Vercel Deployment

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables in Vercel dashboard**
4. **Deploy**

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t erpnext-demo .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_ERPNEXT_BASE_URL=https://your-site.com \
     -e ERPNEXT_API_KEY=your_key \
     -e ERPNEXT_API_SECRET=your_secret \
     erpnext-demo
   ```

## Security Best Practices

1. **Use API Keys instead of passwords**
2. **Enable HTTPS for production**
3. **Restrict API user permissions**
4. **Use environment variables for secrets**
5. **Enable rate limiting in ERPNext**
6. **Regular security updates**

## Next Steps

1. **Customize the UI** to match your school branding
2. **Add more ERPNext doctypes** as needed
3. **Implement additional features** like:
   - Fee management
   - Attendance tracking
   - Grade management
   - Parent portal
4. **Set up automated backups**
5. **Configure monitoring and logging**

## Support

- ERPNext Documentation: https://docs.erpnext.com
- ERPNext Community: https://discuss.erpnext.com
- Next.js Documentation: https://nextjs.org/docs

For issues specific to this demo, please open a GitHub issue.
