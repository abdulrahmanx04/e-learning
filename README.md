# E-Learning Platform API

A comprehensive NestJS-based e-learning platform API with authentication, course management, enrollment, payments, and admin features.

## 🚀 Features

### Authentication & Users
- User registration with email verification
- JWT-based authentication
- Password reset and change functionality
- User profile management with avatar upload
- Role-based access control (Student, Instructor, Admin)

### Courses
- Create, read, update, and delete courses
- Course categorization and leveling system
- Thumbnail and materials upload support
- Publish/unpublish courses
- Course filtering by category, level, price, and rating

### Lessons
- Create lessons within courses
- Support for multiple lesson types (Video, Text, Quiz, Assignment)
- Upload lesson videos and materials
- Lesson ordering and duration tracking
- Free and paid lesson management

### Enrollments
- Student course enrollment
- Enrollment status tracking (Pending, Active, Completed, Dropped)
- Enrollment filtering and pagination
- Certificate earning tracking

### Progress Tracking
- Track lesson completion status
- Monitor watched duration and progress percentage
- Pagination and filtering of progress records
- Completion date tracking

### Payments
- Stripe integration for course payments
- Payment status tracking
- Refund processing with reason tracking
- Webhook support for Stripe events
- Payment history and filtering

### Admin Dashboard
- User management and ban/unban functionality
- Role assignment and management
- Course publishing controls
- Enrollment monitoring
- Statistics for users, courses, and enrollments

### File Management
- Cloudinary integration for file uploads
- Support for images, videos, and documents
- Automatic file validation and size limits
- Secure file deletion

## 📋 Prerequisites

- Node.js >= 18
- PostgreSQL >= 12
- Cloudinary account for file storage
- Stripe account for payment processing
- Mailtrap account for email sending

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd e-learning
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_DATABASE=elearning

# JWT
JWT=your_jwt_secret_key

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Mailtrap Email
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Payment URLs
PAYMENT_SUCCESS_URL=http://localhost:3000/payment/success
PAYMENT_CANCEL_URL=http://localhost:3000/payment/cancel

# Port
PORT=3000
```

5. **Run database migrations**
```bash
npm run start:dev
```

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## 📊 API Endpoints

### Authentication (`/auth`)
- `POST /register` - User registration
- `GET /verify-email/:token` - Email verification
- `POST /resend-email` - Resend verification email
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password
- `PUT /change-password` - Change password (Protected)

### Users (`/users`)
- `GET /me` - Get current user profile (Protected)
- `PUT /me` - Update user profile (Protected)
- `DELETE /me` - Delete user account (Protected)

### Courses (`/courses`)
- `POST /` - Create course (Protected: Instructor/Admin)
- `GET /` - List all published courses
- `GET /:id` - Get course details
- `PUT /:id` - Update course (Protected: Instructor/Admin)
- `DELETE /:id` - Delete course (Protected: Instructor/Admin)

### Lessons (`/courses/:courseId/lessons`)
- `POST /` - Create lesson (Protected: Instructor/Admin)
- `GET /` - List course lessons (Protected: Enrolled users)
- `GET /:id` - Get lesson details (Protected: Enrolled users)
- `PUT /:id` - Update lesson (Protected: Instructor/Admin)
- `DELETE /:id` - Delete lesson (Protected: Instructor/Admin)

### Progress (`/courses/:courseId/lessons/:lessonId/progress`)
- `POST /` - Create/update lesson progress (Protected)
- `GET /` - List user progress (Protected)
- `GET /:id` - Get progress details (Protected)
- `PUT /:id` - Update progress (Protected)
- `DELETE /:id` - Delete progress (Protected)

### Enrollments (`/enrollments`, `/courses/:courseId/enroll`)
- `POST /enroll` - Enroll in course (Protected)
- `GET /me` - List user enrollments (Protected)
- `GET /:id` - Get enrollment details (Protected)

### Payments (`/payments`)
- `POST /checkout` - Create payment session (Protected)
- `POST /:id/refund` - Refund payment (Protected)
- `POST /webhook` - Stripe webhook handler
- `GET /` - List user payments (Protected)
- `GET /:id` - Get payment details (Protected)
- `DELETE /:id` - Delete payment (Protected)

### Admin Routes (`/admin`)

**Users** (`/admin/users`)
- `GET /` - List all users
- `GET /stats` - User statistics
- `GET /:id` - Get user details
- `PATCH /:id/role` - Update user role
- `PATCH /:id/ban` - Ban/unban user

**Courses** (`/admin/courses`)
- `POST /` - Create course
- `GET /` - List all courses
- `GET /stats` - Course statistics
- `GET /:id` - Get course details
- `PATCH /:id/publish` - Publish/unpublish course
- `DELETE /:id` - Delete course

**Enrollments** (`/admin/enrollments`)
- `GET /` - List all enrollments
- `GET /stats` - Enrollment statistics
- `PATCH /:id` - Update enrollment status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **Student** - Can enroll in courses, track progress, make payments
- **Instructor** - Can create and manage courses and lessons
- **Admin** - Can manage users, courses, enrollments, and system settings

## 📁 Project Structure

```
src/
├── admin/              # Admin management features
├── auth/               # Authentication logic
├── cloudinary/         # File upload service
├── common/             # Shared utilities, guards, decorators
├── courses/            # Course management
├── enrollment/         # Enrollment management
├── lessons/            # Lesson management
├── payments/           # Payment processing
├── progress/           # Progress tracking
├── stripe/             # Stripe integration
└── users/              # User profile management
```

## 🗄️ Database Schema

### Core Entities
- **Users** - User accounts with roles and authentication
- **Courses** - Course information and metadata
- **Lessons** - Lesson content within courses
- **Enrollments** - User course enrollments
- **Payments** - Payment records and status
- **LessonProgress** - User progress tracking per lesson

## 🔄 Payment Flow

1. User initiates checkout → Creates payment record with Stripe
2. Stripe checkout session created with success/cancel URLs
3. User completes payment on Stripe
4. Stripe webhook confirms payment
5. Enrollment status updated to ACTIVE
6. Confirmation email sent to user

## 📧 Email Templates

- **Verification** - Email verification on registration
- **Reset Password** - Password reset link
- **Payment Success** - Payment confirmation
- **Payment Failed** - Payment failure notification
- **Payment Refunded** - Refund confirmation

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

## 📝 Validation

All DTOs include comprehensive validation using `class-validator`:
- Email format validation
- String length validation
- Number range validation
- Enum validation for statuses and types
- Custom error messages

## ⚙️ Configuration

### File Upload Limits
- **Images**: 5MB max
- **Documents/Videos**: 100MB max

### Supported File Types
- **Images**: PNG, JPG, JPEG, WebP
- **Videos**: MP4, MOV
- **Documents**: PDF

## 🚨 Error Handling

The API implements global exception filters:
- **HttpExceptionFilter** - Handles HTTP exceptions
- **TypeOrmExceptionFilter** - Handles database errors with proper status codes

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Cloudinary API Documentation](https://cloudinary.com/documentation)
- [TypeORM Documentation](https://typeorm.io)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For questions or issues, please open an issue on the repository.