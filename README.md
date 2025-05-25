# EduCore ERP - ERPNext Headless Demo

A professional educational management system demonstrating how to use Next.js as a modern frontend for ERPNext running as a headless ERP backend. This project showcases a complete 4-phase ERP implementation with Phase 1 (Student Management) fully functional.

## 🎯 Project Overview

**EduCore ERP** is a comprehensive educational management system built as a headless ERPNext implementation. This demo represents **Phase 1** of a 4-phase development plan:

- **Phase 1**: Student Management (✅ **COMPLETED** - 3-4 months)
- **Phase 2**: Finance & Accounting with BIR compliance (📋 Planned - 3-4 months)
- **Phase 3**: HRIS (Human Resource Information System) (📋 Planned - 2-3 months)
- **Phase 4**: Supply Chain Management (📋 Planned - 2-3 months)

## ✨ Features

### 🎓 **Educational Management**
- **Student Management**: Complete CRUD operations with ERPNext Student doctype
- **Academic Year Management**: Configure and manage academic periods
- **Course Management**: Create and manage educational courses
- **Program Management**: Academic program administration
- **Partner Management**: Customer and supplier relationship management

### 🚀 **Technical Features**
- **Headless ERPNext Integration**: Seamless REST API connectivity
- **Modern UI/UX**: Professional design with Tailwind CSS and custom components
- **Real-time Authentication**: Secure login/logout with ERPNext credentials
- **Responsive Design**: Mobile-first, fully responsive interface
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for efficient state handling
- **API Proxy**: Next.js API routes to handle CORS and security

## 📋 Prerequisites

1. **ERPNext Instance**: Running ERPNext v13+ with Education module enabled
2. **Node.js**: Version 18 or higher
3. **Package Manager**: npm, yarn, or pnpm
4. **API Access**: ERPNext API keys or user credentials

## 🚀 Quick Start

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

**Environment Configuration:**
```env
# ERPNext Connection
NEXT_PUBLIC_ERPNEXT_BASE_URL=https://your-erpnext-site.com
NEXT_PUBLIC_ERPNEXT_SITE_NAME=your-site-name

# Authentication (Choose one method)

# Option 1: API Key Authentication (Recommended for production)
ERPNEXT_API_KEY=your-api-key
ERPNEXT_API_SECRET=your-api-secret

# Option 2: Username/Password Authentication (For development)
ERPNEXT_USERNAME=your-username
ERPNEXT_PASSWORD=your-password

# Optional: Debug settings
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

```bash
# 5. Start the development server
npm run dev
```

🎉 **Visit [http://localhost:3000](http://localhost:3000)** and login with your ERPNext credentials!

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

## ⚙️ ERPNext Configuration

### 1. Enable Education Module

```bash
# If using Docker/Bench
bench --site your-site.local install-app education

# Or via ERPNext UI:
```

1. Login to your ERPNext instance as Administrator
2. Go to **Setup > Module Settings**
3. Enable the **Education** module
4. Go to **Education > Settings > Education Settings**
5. Configure basic education settings

### 2. Generate API Keys (Recommended)

1. Go to **Settings > Integrations > API Access**
2. Click **Generate Keys**
3. Copy the **API Key** and **API Secret**
4. Add these to your `.env.local` file

### 3. Configure CORS (If needed)

Add your Next.js domain to ERPNext's allowed origins:

```python
# In ERPNext site_config.json
{
  "allow_cors": "*",
  "cors_headers": [
    "Authorization",
    "Content-Type",
    "X-Frappe-CSRF-Token"
  ]
}
```

### 4. Required Doctypes & Permissions

The application uses these ERPNext doctypes:

| Doctype | Purpose | Permissions Needed |
|---------|---------|-------------------|
| **Student** | Student management | Read, Write, Create, Delete |
| **Program** | Academic programs | Read, Write, Create |
| **Course** | Individual courses | Read, Write, Create |
| **Academic Year** | Academic periods | Read, Write, Create |
| **Customer** | Customer management | Read, Write |
| **Supplier** | Supplier management | Read, Write |

### 5. Sample Data Setup (Optional)

```bash
# Create sample academic year
bench --site your-site.local execute frappe.desk.page.setup_wizard.setup_wizard.setup_complete

# Or manually create via UI:
# - Academic Year: 2024-2025
# - Programs: Computer Science, Business Administration
# - Courses: Programming 101, Mathematics, etc.
```

## 📁 Project Structure

```
nextjs-erpnext-headless-demo/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes & middleware
│   │   ├── auth/         # Authentication endpoints
│   │   └── erpnext/      # ERPNext API proxy routes
│   ├── dashboard/         # Main dashboard
│   ├── students/         # Student management pages
│   ├── courses/          # Course management pages
│   ├── academic-years/   # Academic year management
│   ├── partners/         # Customer/Supplier management
│   ├── login/            # Authentication pages
│   ├── globals.css       # Global styles & custom CSS
│   └── layout.tsx        # Root layout with navigation
├── components/           # Reusable React components
│   ├── ui/              # Shadcn/ui components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components (Header, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   ├── students/        # Student management components
│   ├── courses/         # Course management components
│   └── academic/        # Academic year components
├── lib/                 # Core utilities and services
│   ├── erpnext/        # ERPNext API service layer
│   ├── store/          # Zustand state management
│   ├── utils/          # Helper functions
│   └── validations/    # Form validation schemas
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── public/             # Static assets
```

## 🔌 API Integration Architecture

### Connection Layer
- **REST API**: Standard ERPNext REST endpoints
- **Authentication**: API key or session-based auth
- **Proxy Routes**: Next.js API routes to handle CORS and security
- **Error Handling**: Comprehensive error handling and retry logic

### Service Layer
| Service | Purpose | Key Methods |
|---------|---------|-------------|
| `ERPNextAPIService` | Core API operations | `get()`, `post()`, `put()`, `delete()` |
| `AuthService` | Authentication | `login()`, `logout()`, `validateSession()` |
| `StudentService` | Student operations | `getStudents()`, `createStudent()`, `updateStudent()` |
| `CourseService` | Course management | `getCourses()`, `createCourse()` |
| `AcademicYearService` | Academic periods | `getAcademicYears()`, `createAcademicYear()` |
| `PartnerService` | Customer/Supplier | `getCustomers()`, `getSuppliers()` |

## 🎯 Demo Features & Capabilities

### 🔐 1. Authentication & Security
- **Multi-auth Support**: API keys (production) or username/password (development)
- **Session Management**: Secure session handling with automatic refresh
- **Role-based Access**: Respects ERPNext user permissions
- **Logout Functionality**: Clean session termination

### 📊 2. Modern Dashboard
- **System Overview**: Real-time connection status and user information
- **Key Metrics**: Student count, course count, academic year status
- **Quick Actions**: Direct access to common tasks
- **Visual Indicators**: Status badges and progress indicators
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🎓 3. Student Management (Phase 1 - Complete)
- **Student Listing**: Paginated view with search and filtering
- **CRUD Operations**: Create, read, update, delete students
- **Form Validation**: Client-side and server-side validation
- **Student Profiles**: Detailed student information display
- **Bulk Operations**: Import/export capabilities (planned)

### 📚 4. Academic Management
- **Academic Years**: Create and manage academic periods
- **Course Management**: Define courses with descriptions and credits
- **Program Administration**: Academic program setup and management
- **Curriculum Planning**: Course-program relationships (planned)

### 🤝 5. Partner Management
- **Customer Management**: Track educational institution customers
- **Supplier Management**: Manage educational suppliers and vendors
- **Contact Information**: Comprehensive contact details
- **Dynamic Icons**: Visual differentiation between companies and individuals

### 🎨 6. UI/UX Features
- **Professional Design**: Clean, modern interface optimized for educational institutions
- **Consistent Styling**: Unified design system across all components
- **Interactive Elements**: Hover effects, animations, and transitions
- **Accessibility**: WCAG compliant design patterns
- **Loading States**: Skeleton loaders and progress indicators

## 🚀 Deployment Options

### 🔧 Local Development
```bash
# Development server with hot reload
npm run dev

# Production build testing
npm run build && npm start
```

### 🐳 Docker Deployment
```bash
# Build Docker image
docker build -t educore-erp .

# Run with environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_ERPNEXT_BASE_URL=https://your-erpnext.com \
  -e ERPNEXT_API_KEY=your_api_key \
  -e ERPNEXT_API_SECRET=your_api_secret \
  educore-erp
```

### ☁️ Cloud Deployment

**Vercel (Recommended)**
```bash
# Deploy to Vercel
vercel --prod

# Or connect GitHub repo to Vercel dashboard
```

**Environment Variables for Production:**
```env
NEXT_PUBLIC_ERPNEXT_BASE_URL=https://your-erpnext.com
ERPNEXT_API_KEY=your_production_api_key
ERPNEXT_API_SECRET=your_production_api_secret
NODE_ENV=production
```

## 🔒 Security Best Practices

### 🛡️ Production Security
- **API Keys**: Always use API keys instead of passwords in production
- **Environment Variables**: Never expose credentials in client-side code
- **HTTPS**: Use HTTPS for all ERPNext connections
- **CORS**: Configure ERPNext CORS settings properly
- **Rate Limiting**: Implement API rate limiting (planned)

### 🔐 Authentication Security
- **Session Management**: Secure session handling with automatic expiry
- **Role-based Access**: Respects ERPNext user permissions and roles
- **API Proxy**: All ERPNext requests go through Next.js API routes
- **Input Validation**: Client and server-side validation for all forms

## 🐛 Troubleshooting Guide

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **CORS Errors** | ERPNext not allowing Next.js domain | Configure CORS in ERPNext site_config.json |
| **Authentication Failed** | Invalid credentials/API keys | Verify API keys in ERPNext settings |
| **Module Not Found** | Education module not installed | Install education app: `bench install-app education` |
| **Connection Refused** | ERPNext not accessible | Check ERPNext status and network connectivity |
| **404 API Errors** | Incorrect ERPNext URL | Verify NEXT_PUBLIC_ERPNEXT_BASE_URL |

### 🔍 Debug Mode
```bash
# Enable debug logging
NODE_ENV=development NEXT_PUBLIC_DEBUG=true npm run dev

# Check API calls in browser network tab
# Check Next.js API route logs in terminal
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

### Get Help
- 📖 **Documentation**: Check this README and inline code comments
- 🐛 **Issues**: [Open an issue](https://github.com/your-repo/issues) on GitHub
- 💬 **Discussions**: Join our [GitHub Discussions](https://github.com/your-repo/discussions)

### ERPNext Resources
- 📚 [ERPNext Documentation](https://docs.erpnext.com/)
- 🌐 [ERPNext Community Forum](https://discuss.erpnext.com/)
- 🎓 [ERPNext School](https://frappe.school/)

---

## 🎯 Roadmap & Future Phases

### Phase 2: Finance & Accounting (Q2 2024)
- 💰 Fee management and billing
- 🧾 BIR compliance for Philippines
- 📊 Financial reporting
- 💳 Payment gateway integration

### Phase 3: HRIS (Q3 2024)
- 👥 Employee management
- 📅 Attendance tracking
- 💼 Payroll integration
- 📈 Performance management

### Phase 4: Supply Chain (Q4 2024)
- 📦 Inventory management
- 🛒 Procurement workflows
- 📋 Asset management
- 📊 Supply chain analytics

---

<div align="center">

**🎓 EduCore ERP - Professional Educational Management**

*Powered by ERPNext • Built with Next.js • Styled with Tailwind CSS*

**[⭐ Star this repo](https://github.com/your-repo) • [🐛 Report Bug](https://github.com/your-repo/issues) • [💡 Request Feature](https://github.com/your-repo/issues)**

</div>
