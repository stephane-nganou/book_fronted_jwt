# BookFrontendJwt

## Overview
BookFrontendJwt is a modern, user-friendly bookstore web application built with Angular. It integrates with a Spring Boot 3 backend utilizing JSON Web Token (JWT) authentication to provide secure and seamless user interactions. The application serves as a reference implementation, demonstrating best practices for front-end development, API integration, containerization, and testing in a professional software development environment.

## Project Objectives
This project showcases the following technologies, tools, and practices:
1. **Angular Framework**: Leveraging Angular's dependency injection, component-based architecture, reactive forms, and routing for a robust front-end.
2. **TypeScript, HTML, and CSS**: Utilizing TypeScript for type-safe development, alongside HTML and CSS for responsive and accessible user interfaces.
3. **OpenAPI Integration**: Automatically generating TypeScript service classes from an OpenAPI specification for seamless communication with the backend API.
4. **Docker**: Containerizing the application for consistent development, testing, and deployment environments.
5. **Testing**: Implementing unit tests using Jasmine and Karma to ensure code quality and reliability.
6. **Modern Development Practices**: Following modular design, code organization, and best practices for scalability and maintainability.

## Features
- **User Authentication**: Secure login and registration using JWT-based authentication.
- **Bookstore Functionality**: Browse, search, and manage books with a clean and intuitive interface.
- **Responsive Design**: Built with Bootstrap and custom CSS to ensure compatibility across devices.
- **API Integration**: Efficiently communicates with a Spring Boot backend via auto-generated services.
- **Containerized Deployment**: Ready for deployment in containerized environments using Docker.

## Prerequisites
To run this project locally, ensure you have the following installed:
- **Node.js**: Version 20.x or later
- **Angular CLI**: Version 19.2.12 or later
- **Docker**: (Optional) For containerized deployment
- **Backend API**: A running instance of the Spring Boot 3 JWT Authentication API

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/bookfrontendjwt.git
   cd bookfrontendjwt
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Generate API Services**:
   Ensure the `openapi.json` file is available in `src/openapi/`. Run the following command to generate service classes:
   ```bash
   npm run api-gen
   ```

4. **Start the Development Server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The output will be generated in the `dist/` directory.

6. **Run Unit Tests**:
   ```bash
   npm test
   ```
   Tests are executed using Karma and Jasmine, with coverage reports generated.

7. **Docker Setup** (Optional):
   - Build the Docker image:
     ```bash
     docker build -t bookfrontendjwt .
     ```
   - Run the container:
     ```bash
     docker run -p 8080:80 bookfrontendjwt
     ```

## Project Structure
```
bookfrontendjwt/
├── src/
│   ├── app/
│   │   ├── components/        # Reusable Angular components
│   │   ├── services/          # Auto-generated API services
│   │   ├── models/            # TypeScript interfaces
│   │   ├── app.module.ts      # Root module
│   │   └── app.component.ts   # Root component
│   ├── assets/                # Static assets (images, etc.)
│   ├── openapi/               # OpenAPI specification file
│   └── styles/                # Global styles (CSS/SCSS)
├── Dockerfile                 # Docker configuration
├── package.json               # Node.js dependencies and scripts
├── angular.json               # Angular CLI configuration
└── README.md                  # Project documentation
```

## Dependencies
The project relies on the following key dependencies (see `package.json` for the complete list):
- **Angular**: Version 19.2.0 for core framework functionality.
- **Bootstrap**: Version 5.3.3 for responsive styling.
- **FontAwesome**: Version 7.0.0 for icons.
- **RxJS**: Version 7.8.0 for reactive programming.
- **Testing Tools**: Jasmine, Karma, and related packages for unit testing.

## Development Workflow
- **Code Style**: Follow Angular's style guide for consistent and maintainable code.
- **Version Control**: Use Git with meaningful commit messages and branch naming conventions (e.g., `feature/`, `bugfix/`).
- **Testing**: Write unit tests for components and services to maintain code quality.
- **API Updates**: Re-run `npm run api-gen` whenever the backend OpenAPI specification changes.

## Future Enhancements
The following improvements are planned to enhance the project:
1. **CI/CD Pipeline**: Implement a continuous integration and continuous deployment pipeline using tools like GitHub Actions or Jenkins for automated testing and deployment to cloud platforms such as AWS or Google Cloud.
2. **End-to-End Testing**: Add Cypress or Playwright for comprehensive end-to-end testing.
3. **Performance Optimization**: Implement lazy loading for Angular modules and optimize assets for faster load times.
4. **Accessibility Improvements**: Enhance WCAG compliance for better accessibility.
5. **Internationalization (i18n)**: Support multiple languages for a global user base.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For questions or feedback, please contact the project maintainers at [your-email@example.com](mailto:your-email@example.com).