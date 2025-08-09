#!/bin/bash

# Trade Crafter Setup Script
# This script automates the setup of the Trade Crafter application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists java; then
        missing_deps+=("Java 17+")
    else
        java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
        if [ "$java_version" -lt 17 ]; then
            missing_deps+=("Java 17+ (found version $java_version)")
        fi
    fi
    
    if ! command_exists node; then
        missing_deps+=("Node.js 18+")
    else
        node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            missing_deps+=("Node.js 18+ (found version $node_version)")
        fi
    fi
    
    if ! command_exists mvn; then
        missing_deps+=("Maven 3.8+")
    fi
    
    if ! command_exists docker; then
        missing_deps+=("Docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_deps+=("Docker Compose")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing prerequisites:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        print_warning "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    print_success "All prerequisites are satisfied!"
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    if [ -f .env ]; then
        print_warning ".env file already exists. Backing up to .env.backup"
        cp .env .env.backup
    fi
    
    cat > .env << EOF
# Trade Crafter Environment Configuration

# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/trade_crafter
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64)

# Market Data API Keys (Optional - add your own keys)
BINANCE_API_KEY=
BINANCE_SECRET_KEY=
ALPHA_VANTAGE_API_KEY=
POLYGON_API_KEY=
FINNHUB_API_KEY=

# Email Configuration (Optional - for alert notifications)
GMAIL_USERNAME=
GMAIL_APP_PASSWORD=
ALERT_EMAIL_FROM=noreply@tradecrafter.com

# Web Push Notifications (Optional)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=ws://localhost:8080/api/ws
EOF

    print_success "Environment file created at .env"
    print_warning "Please update the API keys and email configuration in .env file"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    if command_exists docker; then
        print_status "Using Docker to setup PostgreSQL..."
        
        # Check if PostgreSQL container is already running
        if docker ps | grep -q postgres-trade-crafter; then
            print_warning "PostgreSQL container is already running"
        else
            # Start PostgreSQL container
            docker run --name postgres-trade-crafter \
                -e POSTGRES_DB=trade_crafter \
                -e POSTGRES_USER=postgres \
                -e POSTGRES_PASSWORD=password \
                -p 5432:5432 \
                -d postgres:15-alpine
            
            print_status "Waiting for PostgreSQL to start..."
            sleep 10
            
            # Wait for PostgreSQL to be ready
            until docker exec postgres-trade-crafter pg_isready -U postgres; do
                print_status "Waiting for PostgreSQL to be ready..."
                sleep 2
            done
        fi
        
        print_status "Setting up Redis..."
        if docker ps | grep -q redis-trade-crafter; then
            print_warning "Redis container is already running"
        else
            docker run --name redis-trade-crafter \
                -p 6379:6379 \
                -d redis:7-alpine
        fi
        
        print_success "Database setup completed!"
    else
        print_error "Docker is required for database setup"
        exit 1
    fi
}

# Function to build and start backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Build the application
    print_status "Building backend application..."
    mvn clean install -DskipTests
    
    print_success "Backend build completed!"
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    print_success "Frontend setup completed!"
}

# Function to start the application
start_application() {
    print_status "Starting Trade Crafter application..."
    
    # Start backend
    print_status "Starting backend..."
    cd backend
    mvn spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    sleep 30
    
    # Check if backend is running
    if curl -f http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
        print_success "Backend is running at http://localhost:8080/api"
    else
        print_error "Backend failed to start. Check backend.log for details."
        exit 1
    fi
    
    # Start frontend
    print_status "Starting frontend..."
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    sleep 10
    
    print_success "Frontend is running at http://localhost:5173"
    
    # Save PIDs for cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    print_success "Trade Crafter is now running!"
    echo ""
    echo "Access the application at: http://localhost:5173"
    echo "API documentation at: http://localhost:8080/api/swagger-ui.html"
    echo ""
    echo "To stop the application, run: ./stop.sh"
}

# Function to setup with Docker Compose
setup_docker() {
    print_status "Setting up with Docker Compose..."
    
    # Build and start all services
    docker-compose up -d --build
    
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    if curl -f http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
        print_success "Backend is running at http://localhost:8080/api"
    else
        print_error "Backend failed to start"
        exit 1
    fi
    
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        print_success "Frontend is running at http://localhost:5173"
    else
        print_error "Frontend failed to start"
        exit 1
    fi
    
    print_success "Trade Crafter is now running with Docker!"
    echo ""
    echo "Access the application at: http://localhost:5173"
    echo "API documentation at: http://localhost:8080/api/swagger-ui.html"
    echo ""
    echo "To stop the application, run: docker-compose down"
}

# Function to show usage
show_usage() {
    echo "Trade Crafter Setup Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  --check-prerequisites    Check if all prerequisites are installed"
    echo "  --create-env             Create environment configuration file"
    echo "  --setup-database         Setup PostgreSQL and Redis databases"
    echo "  --setup-backend          Build and setup backend application"
    echo "  --setup-frontend         Setup frontend application"
    echo "  --start                  Start the application (backend + frontend)"
    echo "  --docker                 Setup and start with Docker Compose"
    echo "  --all                    Complete setup (recommended)"
    echo "  --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --all                 # Complete setup"
    echo "  $0 --docker              # Setup with Docker"
    echo "  $0 --check-prerequisites # Check prerequisites only"
}

# Main script logic
main() {
    case "${1:-}" in
        --check-prerequisites)
            check_prerequisites
            ;;
        --create-env)
            create_env_file
            ;;
        --setup-database)
            setup_database
            ;;
        --setup-backend)
            setup_backend
            ;;
        --setup-frontend)
            setup_frontend
            ;;
        --start)
            start_application
            ;;
        --docker)
            check_prerequisites
            create_env_file
            setup_docker
            ;;
        --all)
            check_prerequisites
            create_env_file
            setup_database
            setup_backend
            setup_frontend
            start_application
            ;;
        --help|"")
            show_usage
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"