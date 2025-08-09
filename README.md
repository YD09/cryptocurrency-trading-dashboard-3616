# Trade Crafter

A comprehensive cryptocurrency trading dashboard built with Java Spring Boot backend and React frontend, featuring MT5-style paper trading, Pine Script strategy support, and real-time market data integration.

## 🚀 Features

### Core Trading Features
- **MT5/cTrader-style Paper Trading**: Complete virtual trading environment with market & limit orders, stop loss/take profit, and realistic execution simulation
- **Pine Script Strategy Management**: Upload, edit, and write Pine Script strategies directly in the UI with syntax highlighting and validation
- **Real-time Backtesting**: Run strategies against historical OHLCV data with immediate next-candle execution logic
- **Performance Analytics**: Comprehensive reports including equity curves, drawdown analysis, win rates, and profit factors

### Market Data Integration
- **Multi-Provider Support**: Integration with Binance, Alpha Vantage, Polygon.io, and Finnhub APIs
- **Real-time Data**: Live market data streaming with WebSocket support
- **Historical Data**: Access to extensive historical data for backtesting and analysis
- **Symbol Management**: Support for crypto, forex, and stocks across multiple timeframes

### Alert System
- **Multi-Channel Notifications**: Email alerts via Gmail SMTP, web push notifications, and webhook support
- **Strategy-Based Alerts**: Define alerts from Pine Script strategy conditions
- **Real-time Triggering**: Instant notifications when conditions are met
- **Delivery Tracking**: Monitor alert delivery status and retry failed notifications

### Team Collaboration
- **Shared Paper Trading Accounts**: Multiple users can collaborate on single trading accounts
- **Role-Based Permissions**: Owner, Trader, and Viewer roles with appropriate access levels
- **Real-time Sync**: Live synchronization of trades and orders between team members
- **Activity Tracking**: Monitor team member activity and performance

### Advanced Features
- **Technical Analysis**: Built-in technical indicators and charting capabilities
- **Risk Management**: Position sizing, margin management, and portfolio tracking
- **Trade Journal**: Comprehensive trade history with notes and analysis
- **Strategy Library**: Public and private strategy sharing and discovery

## 🏗️ Architecture

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.3.2 with Java 17
- **Database**: PostgreSQL with JPA/Hibernate
- **Caching**: Redis for session management and data caching
- **Security**: JWT-based authentication with role-based authorization
- **Real-time**: WebSocket support for live data streaming
- **APIs**: RESTful APIs with OpenAPI documentation

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: React Query for server state
- **Charts**: TradingView charting library integration
- **Code Editor**: Monaco Editor for Pine Script editing
- **Real-time**: WebSocket client for live updates

### Key Technologies
- **Pine Script Engine**: Custom Java implementation for strategy execution
- **Technical Analysis**: TA4J library for technical indicators
- **Market Data**: WebFlux for non-blocking API calls
- **Email**: Spring Mail with Gmail SMTP support
- **Documentation**: SpringDoc OpenAPI for API documentation

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 13 or higher
- Redis 6 or higher
- Maven 3.8 or higher

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd trade-crafter
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb trade_crafter

# Or using Docker
docker run --name postgres-trade-crafter \
  -e POSTGRES_DB=trade_crafter \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Redis Setup
```bash
# Using Docker
docker run --name redis-trade-crafter \
  -p 6379:6379 \
  -d redis:7-alpine
```

### 4. Environment Configuration
Create `.env` file in the root directory:
```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/trade_crafter
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure

# Market Data APIs
BINANCE_API_KEY=your-binance-api-key
BINANCE_SECRET_KEY=your-binance-secret-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
POLYGON_API_KEY=your-polygon-api-key
FINNHUB_API_KEY=your-finnhub-api-key

# Email Configuration
GMAIL_USERNAME=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
ALERT_EMAIL_FROM=noreply@tradecrafter.com

# Web Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 5. Backend Setup
```bash
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080/api`

### 6. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🚀 Quick Start

1. **Register an Account**: Create a new user account through the registration page
2. **Create Paper Trading Account**: Set up your first paper trading account with initial balance
3. **Upload Strategy**: Import a Pine Script strategy or write your own
4. **Run Backtest**: Test your strategy against historical data
5. **Start Paper Trading**: Execute your strategy in the virtual trading environment
6. **Set Up Alerts**: Configure notifications for strategy signals
7. **Invite Team Members**: Collaborate with your trading team

## 📚 API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api/api-docs`

## 🏛️ Project Structure

```
trade-crafter/
├── backend/
│   ├── src/main/java/com/example/trading/
│   │   ├── domain/           # JPA entities
│   │   ├── repository/       # Data access layer
│   │   ├── service/          # Business logic
│   │   ├── web/             # REST controllers
│   │   ├── config/          # Configuration classes
│   │   └── market/          # Market data services
│   ├── src/main/resources/
│   │   └── application.yml  # Application configuration
│   └── pom.xml             # Maven dependencies
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── main.tsx           # Application entry point
├── public/                 # Static assets
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## 🔧 Configuration

### Backend Configuration
The backend configuration is managed through `application.yml` and environment variables:

- **Database**: PostgreSQL connection settings
- **Redis**: Caching and session management
- **Security**: JWT configuration and CORS settings
- **Market Data**: API keys and endpoints for various providers
- **Email**: SMTP configuration for alert notifications
- **Trading**: Default balance, leverage, and slippage settings

### Frontend Configuration
Frontend configuration is handled through environment variables and the Vite configuration:

- **API Endpoints**: Backend service URLs
- **WebSocket**: Real-time data connection settings
- **TradingView**: Chart library configuration
- **Build**: Production build settings

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
npm test
```

### Integration Tests
```bash
# Run with Docker Compose
docker-compose up -d
npm run test:integration
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Production Deployment
1. Build the frontend: `npm run build`
2. Build the backend: `mvn clean package`
3. Deploy to your preferred cloud platform (AWS, GCP, Azure, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation
- Review the configuration examples

## 🔮 Roadmap

- [ ] Advanced order types (OCO, trailing stops)
- [ ] Portfolio optimization algorithms
- [ ] Machine learning strategy suggestions
- [ ] Mobile application
- [ ] Advanced charting indicators
- [ ] Social trading features
- [ ] Multi-exchange support
- [ ] Advanced risk management tools

## 🙏 Acknowledgments

- TradingView for charting library
- Pine Script community for strategy inspiration
- Spring Boot and React communities for excellent frameworks
- All contributors and beta testers

---

**Trade Crafter** - Empowering traders with professional-grade tools and collaborative features.