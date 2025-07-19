import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

const CryptoChart = () => {
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
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove();
        } catch (error) {
          console.warn('Error removing TradingView widget:', error);
        }
      }
      // Clear the container manually as fallback
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  const createWidget = () => {
    if (!containerRef.current || !window.TradingView) return;

    // Clear previous widget safely
    if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
      try {
        widgetRef.current.remove();
      } catch (error) {
        console.warn('Error removing previous TradingView widget:', error);
      }
    }
    
    // Clear container manually as fallback
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    widgetRef.current = new window.TradingView.widget({
      width: '100%',
      height: 400,
      symbol: 'BINANCE:BTCUSDT',
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
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Bitcoin Price</h2>
      </div>
      <div 
        ref={containerRef}
        id={`crypto_chart_${Date.now()}`}
        className="h-[400px] w-full"
      />
    </div>
  );
};

export default CryptoChart;