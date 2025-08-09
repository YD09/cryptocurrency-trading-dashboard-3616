#!/bin/bash

# Trade Crafter Stop Script
# This script stops the Trade Crafter application and cleans up processes

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

# Function to stop processes by PID file
stop_process() {
    local pid_file=$1
    local process_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            print_status "Stopping $process_name (PID: $pid)..."
            kill "$pid"
            
            # Wait for process to stop
            local count=0
            while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                print_warning "Force killing $process_name..."
                kill -9 "$pid"
            fi
            
            rm -f "$pid_file"
            print_success "$process_name stopped"
        else
            print_warning "$process_name is not running"
            rm -f "$pid_file"
        fi
    else
        print_warning "PID file for $process_name not found"
    fi
}

# Function to stop Docker containers
stop_docker() {
    print_status "Stopping Docker containers..."
    
    if command -v docker-compose >/dev/null 2>&1; then
        if [ -f docker-compose.yml ]; then
            docker-compose down
            print_success "Docker containers stopped"
        else
            print_warning "docker-compose.yml not found"
        fi
    else
        print_warning "Docker Compose not found"
    fi
    
    # Stop individual containers if they exist
    if docker ps | grep -q postgres-trade-crafter; then
        print_status "Stopping PostgreSQL container..."
        docker stop postgres-trade-crafter
        docker rm postgres-trade-crafter
    fi
    
    if docker ps | grep -q redis-trade-crafter; then
        print_status "Stopping Redis container..."
        docker stop redis-trade-crafter
        docker rm redis-trade-crafter
    fi
}

# Function to clean up log files
cleanup_logs() {
    print_status "Cleaning up log files..."
    
    if [ -f backend.log ]; then
        rm -f backend.log
        print_status "Removed backend.log"
    fi
    
    if [ -f frontend.log ]; then
        rm -f frontend.log
        print_status "Removed frontend.log"
    fi
}

# Function to show usage
show_usage() {
    echo "Trade Crafter Stop Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  --processes              Stop only the application processes"
    echo "  --docker                 Stop only Docker containers"
    echo "  --cleanup                Clean up log files"
    echo "  --all                    Stop everything and cleanup (default)"
    echo "  --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       # Stop everything"
    echo "  $0 --docker              # Stop only Docker containers"
    echo "  $0 --cleanup             # Clean up log files only"
}

# Main script logic
main() {
    case "${1:-}" in
        --processes)
            stop_process ".backend.pid" "Backend"
            stop_process ".frontend.pid" "Frontend"
            ;;
        --docker)
            stop_docker
            ;;
        --cleanup)
            cleanup_logs
            ;;
        --all|"")
            print_status "Stopping Trade Crafter application..."
            
            # Stop processes
            stop_process ".backend.pid" "Backend"
            stop_process ".frontend.pid" "Frontend"
            
            # Stop Docker containers
            stop_docker
            
            # Cleanup logs
            cleanup_logs
            
            print_success "Trade Crafter stopped successfully!"
            ;;
        --help)
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