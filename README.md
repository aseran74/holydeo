# Free React Tailwind Admin Dashboard

A free React admin dashboard template built with Tailwind CSS and TypeScript, featuring a comprehensive booking management system with role-based access control.

## Features

- Modern and clean design with Tailwind CSS
- Responsive layout for all devices
- Dark mode support
- TypeScript support for type safety
- Role-based access control (Admin, Owner, Guest)
- Property and experience booking system
- Social network integration
- Real-time notifications for guest users
- Firebase authentication with Google OAuth
- Supabase backend integration
- Dynamic sidebar navigation based on user role

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see Configuration section)
4. Start development server: `npm run dev`
5. Build for production: `npm run build`

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## User Roles

### Admin
- Full access to all features
- User management
- Social media management
- Property and experience oversight

### Owner
- Property management
- Booking management
- Analytics dashboard

### Guest
- Limited dashboard with "Mis Reservas" and "Red Social"
- Property and experience search
- Booking management
- Real-time notifications for booking changes and social updates

## Features in Detail

### Notification System for Guest Users

The application includes a comprehensive notification system specifically designed for guest users:

- **Real-time Updates**: Notifications are updated every 5 minutes automatically
- **Booking Notifications**: 
  - New booking confirmations
  - Status changes (confirmed, pending, cancelled, completed)
  - Booking updates and modifications
- **Social Media Notifications**: 
  - New posts in the community
  - Updates from followed categories
- **Smart Filtering**: Only shows relevant notifications from the last 24 hours
- **Visual Indicators**: Different icons and colors for different notification types
- **Mark as Read**: Users can mark notifications as read to manage their notification list

### Dashboard Features

- **Guest Dashboard**: Simplified view with essential features
- **Quick Search**: Direct access to property and experience search
- **Recent Bookings**: Overview of latest reservations
- **Social Feed**: Latest community updates
- **Responsive Design**: Works seamlessly on all devices

## Technical Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Authentication**: Firebase Authentication with Google OAuth
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **State Management**: React Context API
- **UI Components**: Custom components with Framer Motion animations
- **Build Tool**: Vite

## License

This project is licensed under the MIT License.

---

**Last Updated**: March 8, 2025
**Version**: 2.0.2
