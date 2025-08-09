# Trade Crafter

**Trade Crafter** is a comprehensive cryptocurrency trading dashboard with MT5-style paper trading and Pine Script strategy support. Built with Java Spring Boot backend and React frontend, it provides a powerful platform for developing, testing, and executing trading strategies.

## 🚀 Features

### Core Features
- **Pine Script Strategy Management**: Upload, edit, or write Pine Script strategies directly in the web-based code editor
- **MT5/cTrader-like Paper Trading**: Virtual trading environment with realistic execution simulation
- **Real-Time Backtesting**: Run Pine scripts against historical OHLCV data with immediate next-candle execution logic
- **Market Data Integration**: Connect to multiple free chart APIs (Binance, Alpha Vantage, Finnhub, Polygon.io)
- **Alert System**: Real-time alerts via Google SMTP email and web notifications
- **Team Collaboration**: Multiple users can share the same paper trading account with role-based permissions

### Technical Features
- **Modern UI**: Clean, responsive interface with TradingView-style charts
- **Real-time Updates**: WebSocket integration for live data and collaboration
- **Performance Analytics**: Comprehensive trading metrics and equity curves
- **Risk Management**: Built-in risk controls and position management
- **Code Editor**: Monaco Editor with Pine Script syntax highlighting

## 🛠 Tech Stack

### Backend
- **Java Spring Boot 3.3.2** - Main application framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **WebSocket** - Real-time communication
- **Spring Security** - Authentication and authorization
- **Spring Mail** - Email notifications
- **Maven** - Dependency management

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Monaco Editor** - Code editor for Pine Script
- **Recharts** - Chart components
- **React Query** - Data fetching and caching
- **React Router** - Navigation

### APIs & Integrations
- **Binance API** - Cryptocurrency market data
- **Alpha Vantage** - Stock and forex data
- **Finnhub** - Market data and news
- **Polygon.io** - Real-time and historical data
- **Google SMTP** - Email notifications

## 📁 Project Structure

```
trade-crafter/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/tradecrafter/
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Data access layer
│   │   ├── service/        # Business logic
│   │   ├── controller/     # REST API endpoints
│   │   ├── config/         # Configuration classes
│   │   ├── websocket/      # WebSocket handlers
│   │   ├── pinescript/     # Pine Script engine
│   │   ├── trading/        # Trading simulation
│   │   ├── market/         # Market data integration
│   │   └── alerts/         # Alert management
│   └── src/main/resources/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
└── docs/                  # Documentation
```

## 🗄 Database Schema

### Core Entities
- **Users** - User accounts with roles and team associations
- **Pine Scripts** - Strategy code storage and management
- **Trading Accounts** - Paper trading account information
- **Trades** - Executed trade records
- **Orders** - Pending order management
- **Alerts** - Alert configurations and history
- **Teams** - Team collaboration management
- **Backtest Results** - Strategy performance analytics

## 🚦 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Maven 3.8+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd trade-crafter
```

2. **Set up the database**
```bash
# Create PostgreSQL database
createdb tradecrafter

# Start Redis server
redis-server
```

3. **Configure environment variables**
```bash
# Backend environment variables
export DB_URL=jdbc:postgresql://localhost:5432/tradecrafter
export DB_USER=postgres
export DB_PASSWORD=your_password
export REDIS_HOST=localhost
export REDIS_PORT=6379
export GMAIL_USERNAME=your_gmail@gmail.com
export GMAIL_PASSWORD=your_app_password
export ALPHA_VANTAGE_API_KEY=your_api_key
export FINNHUB_API_KEY=your_api_key
export POLYGON_API_KEY=your_api_key
```

4. **Install dependencies and start the application**

Backend:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Frontend:
```bash
cd ..
npm install
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## 📊 Usage

### Creating a Strategy
1. Navigate to the **Strategies** page
2. Click **New Strategy** to create a new Pine Script strategy
3. Use the Monaco editor to write or paste your Pine Script code
4. Configure strategy parameters and risk management settings
5. Save and run backtests to validate performance

### Paper Trading
1. Go to the **Trading** page
2. Select a trading pair and timeframe
3. Use the order panel to place market or limit orders
4. Monitor your positions and P&L in real-time
5. Close positions manually or let your strategy handle exits

### Team Collaboration
1. Create or join a team in the **Teams** section
2. Share trading accounts with team members
3. Set role-based permissions (Owner, Trader, Viewer)
4. Collaborate in real-time with synchronized updates

### Setting Up Alerts
1. Navigate to the **Alerts** page
2. Create price-based or strategy-based alerts
3. Configure delivery methods (email/web notifications)
4. Set trigger conditions and expiration rules

## 🔧 Configuration

### Application Properties
Key configuration options in `application.yml`:

```yaml
app:
  trading:
    paper:
      initial-balance: 100000.0
      commission-rate: 0.001
      slippage-rate: 0.0001
  
  pine-script:
    max-execution-time: 30000
    max-bars: 5000
  
  alerts:
    max-per-user: 100
    email:
      rate-limit: 10
```

### Market Data APIs
Configure API keys for market data providers:
- **Binance**: Free tier with rate limits
- **Alpha Vantage**: Free tier with 5 calls/minute
- **Finnhub**: Free tier with 60 calls/minute
- **Polygon.io**: Free tier with delayed data

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd ..
npm test
```

### Building for Production
```bash
# Backend
cd backend
mvn clean package

# Frontend
cd ..
npm run build
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic project structure and UI
- ✅ Database schema and entities
- ✅ Frontend dashboard and trading interface
- 🔄 Pine Script interpreter implementation
- 🔄 Paper trading engine
- 🔄 Market data integration

### Phase 2 (Next)
- 🔮 Real-time backtesting engine
- 🔮 Alert system with notifications
- 🔮 WebSocket real-time updates
- 🔮 Team collaboration features
- 🔮 Advanced analytics and reporting

### Phase 3 (Future)
- 🔮 Machine learning strategy optimization
- 🔮 Social trading features
- 🔮 Mobile application
- 🔮 Advanced charting tools
- 🔮 Strategy marketplace

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions and support:
- Create an issue on GitHub
- Join our Discord community
- Email: support@tradecrafter.dev

## 🙏 Acknowledgments

- [TradingView](https://tradingview.com) for Pine Script inspiration
- [MT5](https://www.metatrader5.com) for trading interface design
- [Binance](https://binance.com) for market data API
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components

---

**Trade Crafter** - Empowering traders with sophisticated paper trading and strategy development tools.