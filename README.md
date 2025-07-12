# Skill Swap Platform

A modern full-stack web application built with Next.js that allows users to exchange skills with each other. Users can create profiles, list their skills, search for others, and request skill swaps.

## Features

### 🔐 Authentication
- User login with email and password
- Session management with localStorage
- Secure logout functionality

### 👤 User Profiles
- Complete profile management
- Skills offered and wanted tracking
- Availability settings (weekends, weekdays, evenings)
- Public/private profile visibility
- Profile photo placeholder

### 🔍 Search & Discovery
- Search users by name or skills
- Filter by availability
- Responsive pagination
- Real-time filtering

### 🤝 Skill Swap Requests
- Send skill swap requests to other users
- Accept or reject incoming requests
- Request status tracking (pending, accepted, rejected)
- Message system for requests

### 📱 Responsive Design
- Mobile-first design approach
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Accessible components

## Technology Stack

- **Frontend**: Next.js 15.3.5, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Data**: Mock data store (simulates database)
- **Styling**: Tailwind CSS with custom components
- **Fonts**: Geist Sans and Geist Mono

## Getting Started

### Prerequisites
- Node.js (18+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd skillshare
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

Use these credentials to test the application:

- **Email**: marc@demo.com, **Password**: password123
- **Email**: michell@demo.com, **Password**: password123  
- **Email**: joe@demo.com, **Password**: password123

## Project Structure

```
skillshare/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── users/          # User management endpoints
│   │   └── requests/       # Skill request endpoints
│   ├── components/         # Reusable React components
│   ├── lib/               # Utility functions and data
│   ├── login/             # Login page
│   ├── profile/           # Profile management page
│   ├── requests/          # Requests management page
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── public/                # Static assets
└── .github/              # GitHub configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/[id]` - Get user by ID
- `PATCH /api/users/[id]` - Update user profile

### Requests
- `GET /api/requests` - Get skill requests
- `POST /api/requests` - Create new skill request
- `PATCH /api/requests` - Update request status

## Key Features in Detail

### Home Page
- Displays all users with their skills
- Search functionality by name or skills
- Filter by availability
- Pagination (3 users per page)
- Request modal for skill swaps

### Login Page
- Simple email/password authentication
- Demo credentials provided
- Responsive design
- Error handling

### Profile Page
- Complete profile editing
- Add/remove skills (offered and wanted)
- Update availability and visibility settings
- Save/discard changes functionality

### Requests Page
- View incoming skill swap requests
- Accept/reject requests
- Filter by status (pending, accepted, rejected)
- Pagination for large lists

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- Uses ESLint for code quality
- Follows React best practices
- Responsive design principles
- Accessibility considerations

## Future Enhancements

- Real database integration (PostgreSQL/MongoDB)
- User registration functionality
- Email notifications for requests
- Real-time messaging
- File upload for profile photos
- Advanced search filters
- Skill ratings and reviews
- Calendar integration for scheduling
- Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
