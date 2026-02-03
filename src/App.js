import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Newspaper, Clock, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('conectando');
  
  // Dados reais das APIs
  const [ibovespa, setIbovespa] = useState(null);
  const [dolar, setDolar] = useState(null);
  const [acoes, setAcoes] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Função para buscar cotação do Ibovespa
  const fetchIbovespa = useCallback(async () => {
    try {
      const response = await fetch('https://brapi.dev/api/quote/%5EBVSP?range=1d&interval=1d');
      const data = await response.json();
      if (data.results && data.results[0]) {
        const result = data.results[0];
        setIbovespa({
          valor: result.regularMarketPrice,
          variacao: result.regularMarketChangePercent,
          maximo: result.regularMarketDayHigh,
          minimo: result.regularMarketDayLow,
          volume: result.regularMarketVolume
        });
      }
    } catch (error) {
      console.error('Erro ao buscar Ibovespa:', error);
    }
  }, []);

  // Função para buscar cotação do Dólar
  const fetchDolar = useCallback(async () => {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
      const data = await response.json();
      if (data.USDBRL) {
        setDolar({
          valor: parseFloat(data.USDBRL.bid),
          variacao: parseFloat(data.USDBRL.pctChange),
          maximo: parseFloat(data.USDBRL.high),
          minimo: parseFloat(data.USDBRL.low),
          timestamp: data.USDBRL.timestamp
        });
      }
    } catch (error) {
      console.error('Erro ao buscar Dólar:', error);
    }
  }, []);

  // Função para buscar ações populares
  const fetchAcoes = useCallback(async () => {
    try {
      // Ações mais populares da bolsa brasileira
      const tickers = 'PETR4,VALE3,ITUB4,BBDC4,MGLU3,WEGE3,RENT3,ELET3,SUZB3,ABEV3';
      const response = await fetch(`https://brapi.dev/api/quote/${tickers}?range=1d&interval=1d`);
      const data = await response.json();
      
      if (data.results) {
        const acoesFormatadas = data.results.map(acao => ({
          ticker: acao.symbol,
          nome: acao.longName || acao.shortName,
          preco: acao.regularMarketPrice,
          variacao: acao.regularMarketChangePercent,
          volume: acao.regularMarketVolume,
          tipo: 'Ações',
          setor: acao.sector || 'N/A'
        }));
        setAcoes(acoesFormatadas);
      }
    } catch (error) {
      console.error('Erro ao buscar ações:', error);
    }
  }, []);

  // Função para buscar notícias (usando uma API pública de exemplo)
  const fetchNoticias = useCallback(async () => {
    try {
      // Usando API de notícias sobre economia brasileira
      const response = await fetch('https://brapi.dev/api/v2/news');
      const data = await response.json();
      
      if (data.news) {
        const noticiasFormatadas = data.news.slice(0, 5).map(noticia => ({
          titulo: noticia.title,
          resumo: noticia.text,
          url: noticia.link,
          fonte: noticia.source,
          data: new Date(noticia.updatedAt),
          impacto: determinarImpacto(noticia.title + ' ' + noticia.text)
        }));
        setNoticias(noticiasFormatadas);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      // Fallback com notícias de exemplo
      setNoticias([
        {
          titulo: "Dados não disponíveis no momento",
          resumo: "Tente atualizar novamente em alguns instantes.",
          impacto: "neutro",
          data: new Date()
        }
      ]);
    }
  }, [determinarImpacto]);

  // Determina o impacto da notícia baseado em palavras-chave
  const determinarImpacto = useCallback((texto) => {
    const textoLower = texto.toLowerCase();
    const palavrasPositivas = ['alta', 'crescimento', 'lucro', 'recorde', 'positivo', 'valoriza', 'sobe', 'dividendos'];
    const palavrasNegativas = ['queda', 'crise', 'prejuízo', 'negativo', 'desvaloriza', 'cai', 'risco'];
    
    const temPositivo = palavrasPositivas.some(p => textoLower.includes(p));
    const temNegativo = palavrasNegativas.some(p => textoLower.includes(p));
    
    if (temPositivo && !temNegativo) return 'positivo';
    if (temNegativo && !temPositivo) return 'negativo';
    return 'neutro';
  }, []);

  // Calcular análise técnica simplificada
  const calcularAnalise = (preco, variacao) => {
    if (!preco || !variacao) return null;
    
    // RSI simulado baseado na variação
    const rsi = 50 + (variacao * 2);
    
    // Sinal baseado em múltiplos fatores
    let sinal = 'neutro';
    if (variacao > 2 && rsi < 70) sinal = 'compra';
    else if (variacao < -2 && rsi > 30) sinal = 'venda';
    else if (variacao > 0.5) sinal = 'compra_fraca';
    else if (variacao < -0.5) sinal = 'venda_fraca';
    
    return {
      rsi: Math.min(100, Math.max(0, rsi)).toFixed(0),
      sinal,
      recomendacao: gerarRecomendacao(sinal, rsi, variacao)
    };
  };

  const gerarRecomendacao = (sinal, rsi, variacao) => {
    if (sinal === 'compra') {
      return `Forte tendência de alta (${variacao > 0 ? '+' : ''}${variacao.toFixed(2)}%). RSI em ${rsi} indica espaço para valorização.`;
    } else if (sinal === 'venda') {
      return `Tendência de baixa (${variacao.toFixed(2)}%). RSI em ${rsi} sugere cautela ou realização de lucros.`;
    } else if (sinal === 'compra_fraca') {
      return `Leve tendência positiva. Aguardar confirmação antes de entrar.`;
    } else if (sinal === 'venda_fraca') {
      return `Leve pressão vendedora. Monitorar níveis de suporte.`;
    }
    return 'Mercado lateral. Aguardar definição de tendência.';
  };

  // Atualizar todos os dados
  const atualizarDados = useCallback(async () => {
    setLoading(true);
    setConnectionStatus('atualizando');
    
    await Promise.all([
      fetchIbovespa(),
      fetchDolar(),
      fetchAcoes(),
      fetchNoticias()
    ]);
    
    setLastUpdate(new Date());
    setLoading(false);
    setConnectionStatus('conectado');
  }, [fetchIbovespa, fetchDolar, fetchAcoes, fetchNoticias]);

  // Carregar dados inicialmente
  useEffect(() => {
    atualizarDados();
    
    // Atualizar a cada 60 segundos
    const interval = setInterval(atualizarDados, 60000);
    
    return () => clearInterval(interval);
  }, [atualizarDados]);

  const formatarHora = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatarData = (date) => {
    const agora = new Date();
    const diff = agora - date;
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    
    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `Há ${minutos} min`;
    if (horas < 24) return `Há ${horas}h`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                InvestSmart Pro
              </h1>
              <p className="text-slate-300">Dados reais do mercado financeiro</p>
            </div>
            <button
              onClick={atualizarDados}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-4 py-2 rounded-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
          
          {/* Status de Conexão */}
          <div className="flex items-center gap-2 mt-2 text-sm">
            {connectionStatus === 'conectado' ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Conectado</span>
              </>
            ) : connectionStatus === 'atualizando' ? (
              <>
                <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-yellow-400">Atualizando...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Desconectado</span>
              </>
            )}
            <span className="text-slate-400 ml-2">
              Última atualização: {formatarHora(lastUpdate)}
            </span>
          </div>
        </div>

        {/* Cotações em Tempo Real */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Ibovespa */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-slate-400 text-sm mb-1">Ibovespa (^BVSP)</h3>
                {ibovespa ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{ibovespa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                      <span className={`flex items-center text-sm ${ibovespa.variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {ibovespa.variacao >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {ibovespa.variacao >= 0 ? '+' : ''}{ibovespa.variacao.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Min: {ibovespa.minimo.toLocaleString('pt-BR', { minimumFractionDigits: 0 })} | 
                      Max: {ibovespa.maximo.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400">Carregando...</div>
                )}
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          {/* Dólar */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-slate-400 text-sm mb-1">Dólar (USD/BRL)</h3>
                {dolar ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">R$ {dolar.valor.toFixed(3)}</span>
                      <span className={`flex items-center text-sm ${dolar.variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {dolar.variacao >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {dolar.variacao >= 0 ? '+' : ''}{dolar.variacao.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Min: R$ {dolar.minimo.toFixed(3)} | Max: R$ {dolar.maximo.toFixed(3)}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400">Carregando...</div>
                )}
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['acoes', 'analises', 'noticias'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {tab === 'acoes' && '📊 Ações em Alta'}
              {tab === 'analises' && '📈 Análises Técnicas'}
              {tab === 'noticias' && '📰 Notícias do Mercado'}
            </button>
          ))}
        </div>

        {/* Conteúdo Principal */}
        {activeTab === 'acoes' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Principais Ações da B3
            </h2>
            {loading && acoes.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                Carregando dados das ações...
              </div>
            ) : (
              <div className="grid gap-4">
                {acoes.map((acao, idx) => (
                  <div key={idx} className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{acao.ticker}</h3>
                        <p className="text-sm text-slate-400">{acao.nome}</p>
                        <span className="text-xs text-slate-500">{acao.setor}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">R$ {acao.preco.toFixed(2)}</div>
                        <div className={`text-sm font-medium ${acao.variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {acao.variacao >= 0 ? '+' : ''}{acao.variacao.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-400">
                      <div>
                        Volume: {(acao.volume / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analises' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Análises Técnicas em Tempo Real
            </h2>
            
            {/* Análise Ibovespa */}
            {ibovespa && (() => {
              const analise = calcularAnalise(ibovespa.valor, ibovespa.variacao);
              return analise && (
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Ibovespa (^BVSP)</h3>
                      <span className="text-2xl font-bold text-slate-300">{ibovespa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold ${
                      analise.sinal.includes('compra') ? 'bg-green-500/20 text-green-400 border border-green-500' : 
                      analise.sinal.includes('venda') ? 'bg-red-500/20 text-red-400 border border-red-500' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                    }`}>
                      {analise.sinal.includes('compra') ? '🟢 COMPRA' : 
                       analise.sinal.includes('venda') ? '🔴 VENDA' : '🟡 NEUTRO'}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Mínimo do Dia</div>
                      <div className="font-bold">{ibovespa.minimo.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Máximo do Dia</div>
                      <div className="font-bold">{ibovespa.maximo.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">RSI Estimado</div>
                      <div className="font-bold">{analise.rsi}</div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-blue-400 mb-1">Recomendação</div>
                        <div className="text-sm text-slate-300">{analise.recomendacao}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Análise Dólar */}
            {dolar && (() => {
              const analise = calcularAnalise(dolar.valor, dolar.variacao);
              return analise && (
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Dólar (USD/BRL)</h3>
                      <span className="text-2xl font-bold text-slate-300">R$ {dolar.valor.toFixed(3)}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold ${
                      analise.sinal.includes('compra') ? 'bg-green-500/20 text-green-400 border border-green-500' : 
                      analise.sinal.includes('venda') ? 'bg-red-500/20 text-red-400 border border-red-500' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                    }`}>
                      {analise.sinal.includes('compra') ? '🟢 COMPRA' : 
                       analise.sinal.includes('venda') ? '🔴 VENDA' : '🟡 NEUTRO'}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Mínimo do Dia</div>
                      <div className="font-bold">R$ {dolar.minimo.toFixed(3)}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Máximo do Dia</div>
                      <div className="font-bold">R$ {dolar.maximo.toFixed(3)}</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">RSI Estimado</div>
                      <div className="font-bold">{analise.rsi}</div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-blue-400 mb-1">Recomendação</div>
                        <div className="text-sm text-slate-300">{analise.recomendacao}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Top 3 Ações */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Análise das Principais Ações</h3>
              {acoes.slice(0, 3).map((acao, idx) => {
                const analise = calcularAnalise(acao.preco, acao.variacao);
                return analise && (
                  <div key={idx} className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-bold">{acao.ticker}</h4>
                        <p className="text-sm text-slate-400">R$ {acao.preco.toFixed(2)}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        analise.sinal.includes('compra') ? 'bg-green-500/20 text-green-400' : 
                        analise.sinal.includes('venda') ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {analise.sinal.includes('compra') ? 'COMPRA' : 
                         analise.sinal.includes('venda') ? 'VENDA' : 'NEUTRO'}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{analise.recomendacao}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'noticias' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-yellow-400" />
              Últimas Notícias do Mercado
            </h2>
            {loading && noticias.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                Carregando notícias...
              </div>
            ) : (
              noticias.map((noticia, idx) => (
                <div key={idx} className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold flex-1 pr-4">{noticia.titulo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      noticia.impacto === 'positivo' ? 'bg-green-500/20 text-green-400' :
                      noticia.impacto === 'negativo' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {noticia.impacto === 'positivo' ? '📈 Positivo' : 
                       noticia.impacto === 'negativo' ? '📉 Negativo' : '➡️ Neutro'}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3 text-sm">{noticia.resumo}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4" />
                      {formatarData(noticia.data)}
                    </div>
                    {noticia.url && (
                      <a 
                        href={noticia.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Ler mais →
                      </a>
                    )}
                  </div>
                  {noticia.fonte && (
                    <div className="text-xs text-slate-500 mt-2">
                      Fonte: {noticia.fonte}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-400 pb-4">
          <p className="mb-2">📊 Dados fornecidos por APIs públicas (Brapi, AwesomeAPI)</p>
          <p className="mb-2">⚠️ Este app é apenas educacional. Não constitui recomendação de investimento.</p>
          <p>Investimentos envolvem riscos. Consulte um especialista antes de investir.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
