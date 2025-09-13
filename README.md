# SmartCreate.ai

A powerful AI-powered content creation platform that offers a suite of premium AI tools for generating articles, blog titles, images, and more. Built with React, Express.js, and integrated with multiple AI services.

## 🌐 Live Demo

🔗 **[Visit SmartCreate.ai](https://smart-create-ai.vercel.app)**

## 🚀 Features

- **AI Article Writer**: Generate high-quality, engaging articles on any topic
- **Blog Title Generator**: Create catchy titles for your blog posts
- **AI Image Generation**: Create stunning visuals using AI (Hugging Face FLUX model)
- **Background Removal**: Remove backgrounds from images effortlessly
- **Object Removal**: Remove unwanted objects from images
- **Resume Reviewer**: Get AI-powered feedback on your resume
- **Community**: Share and discover AI-generated content
- **Premium Subscription**: Advanced features with Clerk subscription management

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Clerk** for authentication and subscription management
- **Axios** for API calls
- **React Hot Toast** for notifications
- **React Markdown** for content rendering
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Neon database
- **Clerk** for authentication middleware
- **OpenAI/Gemini** for text generation
- **Hugging Face** for image generation
- **Cloudinary** for image processing and storage
- **Multer** for file uploads
- **PDF Parse** for resume analysis

## 📁 Project Structure

```
SmartCreateAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Static assets
│   │   └── App.jsx         # Main App component
│   ├── public/             # Public assets
│   └── package.json
├── server/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middlewares
│   ├── configs/            # Configuration files
│   └── server.js           # Main server file
└── README.md
```

## 🔑 API Endpoints

### AI Routes (`/api/ai`)
- `POST /generate-article` - Generate articles
- `POST /generate-blog-title` - Generate blog titles
- `POST /generate-image` - Generate images
- `POST /remove-image-background` - Remove image backgrounds
- `POST /remove-image-object` - Remove objects from images
- `POST /resume-review` - Review resumes

### User Routes (`/api/user`)
- `GET /get-user-creations` - Get user's creations
- `GET /get-published-creations` - Get published community creations
- `POST /toggle-like-creations` - Like/unlike creations

## 🔒 Authentication & Authorization

The application uses Clerk for authentication and subscription management:

- **Free Plan**: Limited to 10 AI operations
- **Premium Plan**: Unlimited access to all features
- Authentication is required for all AI operations
- Subscription status is checked via Clerk middleware

## 🎨 Features Overview

### Free Users
- Limited to 10 AI operations
- Access to article and blog title generation
- View community creations

### Premium Users
- Unlimited AI operations
- Image generation and processing
- Resume review functionality
- Publish creations to community

## 🚀 Deployment

### Vercel (Current Hosting)

Both frontend and backend are deployed on Vercel for optimal performance and scalability.

#### Frontend: React + Vite
- Deployed on Vercel with automatic builds from main branch
- Static site generation for optimal performance

#### Backend: Node.js + Express
- Serverless functions on Vercel
- Automatic scaling and global CDN

### Environment Variables
All sensitive configuration is managed through Vercel environment variables including:
- Database connections (Neon PostgreSQL)
- Authentication keys (Clerk)
- AI service API keys (Gemini, Hugging Face)
- Image processing credentials (Cloudinary)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

## 🔄 Updates & Changelog

### Recent Updates
- Migrated from Replicate to Hugging Face for image generation
- Added comprehensive error handling for AI services
- Improved user interface and experience
- Enhanced subscription management
- Deployed on Vercel for better performance and reliability

---

Built with ❤️ using modern web technologies and deployed on Vercel
