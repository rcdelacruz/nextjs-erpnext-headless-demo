# Next.js ERPNext Headless Demo

A professional demonstration application showing how to use Next.js as a frontend for ERPNext running as a headless ERP backend for educational management.

## Features

- **Headless ERPNext Integration**: Connect to ERPNext via REST API
- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Authentication**: Login/logout with ERPNext user credentials
- **Student Management**: CRUD operations for students using ERPNext Student doctype
- **Academic Management**: Programs, courses, and academic year management
- **Customer/Supplier Management**: Manage business partners
- **Real-time Data**: Live connection to ERPNext database
- **Responsive Design**: Mobile-friendly interface

## Prerequisites

1. **Running ERPNext Instance**: You need ERPNext running with Education module enabled
2. **Node.js**: Version 18 or higher
3. **npm/yarn**: Package manager

## Quick Start

### Method 1: Use Your Existing ERPNext (Recommended)

If you already have ERPNext running:

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/nextjs-erpnext-headless-demo.git
cd nextjs-erpnext-headless-demo

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local

# 4. Edit .env.local with your ERPNext settings
nano .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_ERPNEXT_BASE_URL=https://your-erpnext-site.com
NEXT_PUBLIC_ERPNEXT_SITE_NAME=your-site-name

# Option 1: API Key Authentication (Recommended)
ERPNEXT_API_KEY=your-api-key
ERPNEXT_API_SECRET=your-api-secret

# Option 2: Username/Password Authentication
ERPNEXT_USERNAME=your-username
ERPNEXT_PASSWORD=your-password
```

```bash
# 5. Start the Next.js app
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and login with your ERPNext credentials.

### Method 2: ERPNext Cloud Setup

If you want to use ERPNext Cloud:

1. Sign up for ERPNext Cloud at [frappecloud.com](https://frappecloud.com)
2. Create a new site with Education module enabled
3. Generate API keys from your ERPNext site
4. Use the cloud URL in your `.env.local`

### Method 3: Local ERPNext with Docker

If you want to run ERPNext locally:

```bash
# 1. Clone ERPNext
git clone https://github.com/frappe/frappe_docker.git
cd frappe_docker

# 2. Start ERPNext with Docker
cp example.env .env
# Edit .env file with your settings
docker-compose up -d

# 3. Setup ERPNext
docker-compose exec backend bench new-site your-site.local --admin-password admin
docker-compose exec backend bench --site your-site.local install-app education
```

## ERPNext Configuration

### Enable Education Module

1. Login to your ERPNext instance
2. Go to **Setup > Module Settings**
3. Enable the **Education** module
4. Go to **Education > Settings > Education Settings**
5. Configure basic education settings

### Generate API Keys

1. Go to **Settings > API Access**
2. Click **Generate Keys**
3. Copy the API Key and API Secret
4. Use these in your `.env.local` file

### Required Doctypes

The application uses these ERPNext doctypes:
- **Student**: For student management
- **Program**: For academic programs
- **Course**: For individual courses
- **Academic Year**: For academic year management
- **Customer**: For customer management
- **Supplier**: For supplier management

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── erpnext/      # ERPNext API proxy
│   ├── dashboard/         # Dashboard pages
│   ├── students/         # Student management
│   ├── programs/         # Program management
│   ├── courses/          # Course management
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── ui/              # UI components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── dashboard/       # Dashboard components
├── lib/                 # Utilities and services
│   ├── erpnext/        # ERPNext API service
│   ├── store/          # Zustand store
│   └── utils/          # Helper functions
└── types/              # TypeScript types
```

## API Integration

The app connects to ERPNext using:
- **REST API**: For standard CRUD operations
- **API Keys**: For secure authentication
- **Proxy Routes**: To avoid CORS issues

### Key API Services:
- `ERPNextAPIService`: Core API operations
- `StudentService`: Student-specific operations
- `ProgramService`: Program management
- `CourseService`: Course management
- `CustomerService`: Customer management
- `SupplierService`: Supplier management

## Demo Features

### 1. Authentication
- Login with ERPNext credentials
- API key or username/password support
- Session management
- Logout functionality

### 2. Dashboard
- Overview of key metrics
- System status indicators
- Quick actions
- Navigation shortcuts

### 3. Student Management
- List all students from ERPNext
- Add new students
- Edit student information
- View detailed student profiles

### 4. Academic Management
- Program management
- Course creation and editing
- Academic year configuration

### 5. Business Partner Management
- Customer listing and management
- Supplier management
- Contact information

## Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t nextjs-erpnext-demo .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_ERPNEXT_BASE_URL=https://your-erpnext.com \
  -e ERPNEXT_API_KEY=your_api_key \
  -e ERPNEXT_API_SECRET=your_api_secret \
  nextjs-erpnext-demo
```

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## Security Considerations

- **Environment Variables**: Never expose ERPNext credentials in client-side code
- **API Routes**: Use Next.js API routes to proxy ERPNext requests
- **Authentication**: Implement proper session management
- **CORS**: Configure ERPNext CORS settings properly
- **API Keys**: Use API keys instead of passwords when possible

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your ERPNext site allows requests from your Next.js domain
2. **Authentication Failed**: Verify your API keys or credentials
3. **Module Not Found**: Ensure Education module is installed and enabled
4. **Connection Refused**: Check if ERPNext is running and accessible

### Debug Mode

Set `NODE_ENV=development` to enable debug logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions and support:
- Open an issue on GitHub
- Check ERPNext documentation
- Visit ERPNext community forums

---

**Built for professional ERP integration demonstrations**

Powered by ERPNext • Built with Next.js • Styled with Tailwind CSS
