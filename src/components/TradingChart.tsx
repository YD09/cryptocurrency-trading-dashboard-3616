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
  }, [symbol]);

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

    // Clean and format the symbol for TradingView
    const cleanSymbol = symbol.replace(/[^a-zA-Z0-9:]/g, '');
    
    widgetRef.current = new window.TradingView.widget({
      width: '100%',
      height: height,
      symbol: cleanSymbol,
      interval: '1D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#141413',
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: containerRef.current.id,
      studies: [], // No default indicators - let users add their own
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
        'mainSeriesProperties.volumeColor': '#8989DE',
        'mainSeriesProperties.volumeColor0': '#D2886F',
      },
      disabled_features: [
        'use_localstorage_for_settings',
        'volume_force_overlay',
        'create_volume_indicator_by_default'
      ],
      enabled_features: [
        'study_templates',
        'side_toolbar_in_fullscreen_mode',
        'use_localstorage_for_settings'
      ],
    });
  };

  // Format symbol for display
  const formatSymbolForDisplay = (symbol: string) => {
    if (symbol.includes('BINANCE:')) {
      const crypto = symbol.replace('BINANCE:', '').replace('USDT', '');
      return `${crypto} vs USD`;
    }
    if (symbol.includes('FX:')) {
      const forex = symbol.replace('FX:', '');
      return `${forex.slice(0, 3)} vs ${forex.slice(3)}`;
    }
    if (symbol.includes('NASDAQ:') || symbol.includes('NYSE:')) {
      return symbol.split(':')[1];
    }
    return symbol;
  };

  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{formatSymbolForDisplay(symbol)}</h3>
        <p className="text-sm text-muted-foreground">Live trading data - Add indicators from the toolbar</p>
      </div>
      <div 
        ref={containerRef}
        id={`tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`}
        className="w-full rounded-lg overflow-hidden"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default TradingChart;