import { useEffect, useRef } from 'react';

interface TradingChartProps {
  symbol: string;
  height?: number;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingChart = ({ symbol, height = 500 }: TradingChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => createWidget();
      document.head.appendChild(script);
    } else {
      createWidget();
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
      }
    };
  }, [symbol]);

  const createWidget = () => {
    if (!containerRef.current || !window.TradingView) return;

    // Clear previous widget
    if (widgetRef.current) {
      widgetRef.current.remove();
    }

    // Map symbols to TradingView format
    const getSymbolForTradingView = (sym: string) => {
      const symbolMap: Record<string, string> = {
        'NIFTY50': 'NSE:NIFTY',
        'BANKNIFTY': 'NSE:BANKNIFTY',
        'SENSEX': 'BSE:SENSEX',
        'GOLD': 'MCX:GOLD1!',
        'SILVER': 'MCX:SILVER1!',
        'CRUDE': 'MCX:CRUDEOIL1!',
      };
      
      return symbolMap[sym] || `NSE:${sym}`;
    };

    widgetRef.current = new window.TradingView.widget({
      width: '100%',
      height: height,
      symbol: getSymbolForTradingView(symbol),
      interval: '1D',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#141413',
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: containerRef.current.id,
      studies: [
        'MASimple@tv-basicstudies',
        'RSI@tv-basicstudies'
      ],
      overrides: {
        'paneProperties.background': '#141413',
        'paneProperties.vertGridProperties.color': '#3A3935',
        'paneProperties.horzGridProperties.color': '#3A3935',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#FAFAF8',
        'mainSeriesProperties.candleStyle.upColor': '#7EBF8E',
        'mainSeriesProperties.candleStyle.downColor': '#D2886F',
        'mainSeriesProperties.candleStyle.borderUpColor': '#7EBF8E',
        'mainSeriesProperties.candleStyle.borderDownColor': '#D2886F',
        'mainSeriesProperties.candleStyle.wickUpColor': '#7EBF8E',
        'mainSeriesProperties.candleStyle.wickDownColor': '#D2886F',
      },
    });
  };

  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{symbol} Chart</h3>
        <p className="text-sm text-muted-foreground">Live trading data</p>
      </div>
      <div 
        ref={containerRef}
        id={`tradingview_${symbol}_${Date.now()}`}
        className="w-full rounded-lg overflow-hidden"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default TradingChart;