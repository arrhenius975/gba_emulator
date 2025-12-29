import React, { useState, useEffect } from 'react';
import { Terminal, Github, Linkedin, Globe, Mail, Cpu, HardDrive, Clock } from 'lucide-react';

export default function MemoryRangeCalculator() {
  const [startAddress, setStartAddress] = useState('');
  const [memorySize, setMemorySize] = useState('');
  const [unit, setUnit] = useState('KB');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(Math.floor(Math.random() * 30) + 5);
  const [memUsage, setMemUsage] = useState(Math.floor(Math.random() * 40) + 20);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCpuUsage(Math.floor(Math.random() * 30) + 5);
      setMemUsage(Math.floor(Math.random() * 40) + 20);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getUptime = () => {
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const calculateRange = () => {
    if (!startAddress.trim() || !memorySize.trim()) {
      setOutput('Error: Please enter both start address and memory size');
      return;
    }

    try {
      let startAddr = startAddress.trim().toLowerCase();
      if (!startAddr.startsWith('0x')) {
        startAddr = '0x' + startAddr;
      }

      const startNum = parseInt(startAddr, 16);
      if (isNaN(startNum)) {
        setOutput('Error: Invalid hex address format');
        return;
      }

      const sizeNum = parseFloat(memorySize);
      if (isNaN(sizeNum) || sizeNum <= 0) {
        setOutput('Error: Memory size must be a positive number');
        return;
      }

      let bytesCount = sizeNum;
      switch (unit) {
        case 'GB':
          bytesCount *= 1024 * 1024 * 1024;
          break;
        case 'MB':
          bytesCount *= 1024 * 1024;
          break;
        case 'KB':
          bytesCount *= 1024;
          break;
        case 'B':
          bytesCount *= 1;
          break;
        default:
          bytesCount *= 1024;
      }

      const endNum = startNum + bytesCount - 1;
      const startHex = '0x' + startNum.toString(16).toUpperCase().padStart(8, '0');
      const endHex = '0x' + endNum.toString(16).toUpperCase().padStart(8, '0');

      const result = `
┌─────────────────────────────────────────────┐
│         MEMORY RANGE CALCULATION            │
├─────────────────────────────────────────────┤
│ Start Address      : ${startHex}
│ Memory Size        : ${sizeNum} ${unit}
│ Total Bytes        : ${bytesCount.toLocaleString()}
├─────────────────────────────────────────────┤
│ Address Range      : ${startHex} - ${endHex}
│ Range Size         : ${bytesCount.toString(16).toUpperCase()} (hex)
└─────────────────────────────────────────────┘
      `;

      setOutput(result);
      setHistory([...history, {
        input: `${startAddress} | ${memorySize} ${unit}`,
        output: result,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculateRange();
    }
  };

  const clearAll = () => {
    setStartAddress('');
    setMemorySize('');
    setUnit('KB');
    setOutput('');
    setHistory([]);
  };

  const TerminalWindow = ({ title, children }) => (
    <div className="rounded-lg overflow-hidden shadow-2xl border-2" style={{ borderColor: '#66d9ef', backgroundColor: 'rgba(30, 30, 30, 0.88)' }}>
      {/* Title Bar */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(39, 40, 34, 0.88)', borderBottom: '2px solid #66d9ef' }}>
        <div className="flex items-center gap-3 flex-1">
          <Terminal className="w-4 h-4" style={{ color: '#66d9ef' }} />
          <div style={{ color: '#a1efe4' }} className="text-sm font-bold">{title}</div>
        </div>
        <div className="flex items-center gap-3">
          {/* Minimize */}
          <button 
            className="hover:bg-gray-700 transition px-2 py-1 text-lg leading-none"
            style={{ color: '#fd971f' }}
            title="Minimize"
          >
            −
          </button>
          {/* Maximize */}
          <button 
            className="hover:bg-gray-700 transition px-2 py-1 text-lg leading-none"
            style={{ color: '#fd971f' }}
            title="Maximize"
          >
            ☐
          </button>
          {/* Close */}
          <button 
            className="hover:bg-red-900 transition px-2 py-1 text-lg leading-none"
            style={{ color: '#f92672' }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-0">
        {children}
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen p-0 font-mono flex flex-col"
      style={{
        backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23001a33;stop-opacity:1" /><stop offset="50%" style="stop-color:%23003d66;stop-opacity:1" /><stop offset="100%" style="stop-color:%23000a1a;stop-opacity:1" /></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="1200" height="800" fill="url(%23grad1)"/><circle cx="100" cy="100" r="80" fill="%23004d99" opacity="0.1" filter="url(%23glow)"/><circle cx="1100" cy="700" r="120" fill="%236600cc" opacity="0.08" filter="url(%23glow)"/><path d="M 0 600 Q 300 550 600 580 T 1200 600" stroke="%23003d66" stroke-width="2" fill="none" opacity="0.3"/><circle cx="200" cy="150" r="3" fill="%2366d9ef" opacity="0.6"/><circle cx="400" cy="250" r="2" fill="%23a6e22e" opacity="0.5"/><circle cx="900" cy="100" r="2.5" fill="%23f92672" opacity="0.4"/><circle cx="1000" cy="600" r="2" fill="%23fd971f" opacity="0.5"/><circle cx="150" cy="700" r="2.5" fill="%2366d9ef" opacity="0.4"/></svg>\')',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundColor: '#0a0a0a'
      }}
    >
      <style>{`
        .terminal-input {
          background-color: transparent !important;
          color: #a1efe4 !important;
          border: none !important;
          border-bottom: 1px solid #a1efe4 !important;
          caret-color: #a1efe4 !important;
          padding: 4px 0 !important;
          font-family: 'Courier New', monospace !important;
        }
        .terminal-input::selection {
          background-color: rgba(166, 226, 46, 0.3) !important;
          color: #a1efe4 !important;
        }
        .terminal-input:focus {
          outline: none !important;
          border-bottom: 1px solid #a6e22e !important;
        }
        .terminal-input::placeholder {
          color: #75715e !important;
        }
        .terminal-select {
          background-color: transparent !important;
          color: #a1efe4 !important;
          border: none !important;
          border-bottom: 1px solid #a1efe4 !important;
          caret-color: #a1efe4 !important;
          padding: 4px 0 !important;
          font-family: 'Courier New', monospace !important;
        }
        .terminal-select option {
          background-color: #1e1e1e;
          color: #a1efe4;
        }
        .terminal-select:focus {
          outline: none !important;
          border-bottom: 1px solid #a6e22e !important;
        }
        .terminal-text {
          color: #a1efe4;
        }
        .terminal-prompt {
          color: #fd971f;
        }
        .header-stats {
          background-color: rgba(30, 30, 30, 0.95);
          border-bottom: 2px solid #66d9ef;
          backdrop-filter: blur(10px);
        }
        .footer-link:hover {
          color: #a6e22e !important;
          transition: color 0.3s ease;
        }
      `}</style>

      {/* HEADER */}
      <header className="header-stats">
        <div className="px-6 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5" style={{ color: '#66d9ef' }} />
              <h1 className="text-xl font-bold" style={{ color: '#a1efe4' }}>
                MEMORY RANGE CALCULATOR
              </h1>
            </div>
            <div style={{ color: '#75715e' }} className="text-sm">
              v1.0.0 | Terminal UI
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#fd971f' }} />
              <div>
                <div style={{ color: '#75715e' }}>TIME</div>
                <div style={{ color: '#a6e22e' }}>
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* CPU Usage */}
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" style={{ color: '#fd971f' }} />
              <div>
                <div style={{ color: '#75715e' }}>CPU</div>
                <div style={{ color: '#a6e22e' }}>
                  {cpuUsage}%
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" style={{ color: '#fd971f' }} />
              <div>
                <div style={{ color: '#75715e' }}>MEMORY</div>
                <div style={{ color: '#a6e22e' }}>
                  {memUsage}%
                </div>
              </div>
            </div>

            {/* Uptime */}
            <div className="flex items-center gap-2">
              <div style={{ color: '#fd971f' }}>⏱</div>
              <div>
                <div style={{ color: '#75715e' }}>UPTIME</div>
                <div style={{ color: '#a6e22e' }}>
                  {getUptime()}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <div style={{ color: '#a6e22e' }}>●</div>
              <div>
                <div style={{ color: '#75715e' }}>STATUS</div>
                <div style={{ color: '#a6e22e' }}>
                  ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Input Terminal */}
          <TerminalWindow title="INPUT TERMINAL">
            <div className="p-4 space-y-4">
              {/* Start Address */}
              <div className="border-l-2 pl-4" style={{ borderColor: '#66d9ef' }}>
                <div style={{ color: '#a1efe4' }} className="text-sm mb-2">
                  <span style={{ color: '#fd971f' }}>|</span>
                  <span style={{ color: '#fd971f' }}>--&gt;root@root:</span> Enter start memory address (hex format):
                </div>
                <div className="flex items-center">
                  <span style={{ color: '#fd971f' }} className="mr-2">|</span>
                  <input
                    type="text"
                    value={startAddress}
                    onChange={(e) => setStartAddress(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="0x00000000"
                    className="flex-1 terminal-input text-sm"
                  />
                </div>
              </div>

              {/* Memory Size and Unit */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 border-l-2 pl-4" style={{ borderColor: '#66d9ef' }}>
                  <div style={{ color: '#a1efe4' }} className="text-sm mb-2">
                    <span style={{ color: '#fd971f' }}>|</span>
                    <span style={{ color: '#fd971f' }}>--&gt;root@root:</span> Enter memory size:
                  </div>
                  <div className="flex items-center">
                    <span style={{ color: '#fd971f' }} className="mr-2">|</span>
                    <input
                      type="number"
                      value={memorySize}
                      onChange={(e) => setMemorySize(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="16"
                      className="flex-1 terminal-input text-sm"
                    />
                  </div>
                </div>
                <div className="border-l-2 pl-4" style={{ borderColor: '#66d9ef' }}>
                  <div style={{ color: '#a1efe4' }} className="text-sm mb-2">
                    <span style={{ color: '#fd971f' }}>|</span>
                    <span style={{ color: '#fd971f' }}>--&gt;root@root:</span> Unit:
                  </div>
                  <div className="flex items-center">
                    <span style={{ color: '#fd971f' }} className="mr-2">|</span>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="flex-1 terminal-select text-sm"
                    >
                      <option value="B">Bytes (B)</option>
                      <option value="KB">Kilobytes (KB)</option>
                      <option value="MB">Megabytes (MB)</option>
                      <option value="GB">Gigabytes (GB)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2 border-l-2 pl-4" style={{ borderColor: '#66d9ef' }}>
                <button
                  onClick={calculateRange}
                  className="px-4 py-2 rounded font-bold transition hover:shadow-lg"
                  style={{
                    backgroundColor: '#a6e22e',
                    color: '#1e1e1e',
                  }}
                >
                  CALCULATE
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 rounded font-bold transition hover:shadow-lg"
                  style={{
                    backgroundColor: '#f92672',
                    color: '#f8f8f2',
                  }}
                >
                  CLEAR
                </button>
              </div>
            </div>
          </TerminalWindow>

          {/* Output Terminal */}
          <TerminalWindow title="OUTPUT TERMINAL">
            <div className="p-4 border-l-2 pl-4" style={{ borderColor: '#66d9ef' }}>
              <div style={{ color: '#fd971f' }} className="text-sm mb-3">
                |<span>--&gt;root@root:</span>
              </div>
              {output ? (
                <pre style={{ color: '#a6e22e', overflow: 'auto' }} className="text-sm whitespace-pre-wrap break-words max-h-64 overflow-y-auto font-mono">
                  {output}
                </pre>
              ) : (
                <div style={{ color: '#75715e' }} className="text-sm">
                  [waiting for calculation...]
                </div>
              )}
            </div>
          </TerminalWindow>

          {/* History */}
          {history.length > 0 && (
            <TerminalWindow title="HISTORY LOG">
              <div className="p-4 border-l-2 pl-4 space-y-2 max-h-48 overflow-y-auto" style={{ borderColor: '#66d9ef' }}>
                <div style={{ color: '#fd971f' }} className="text-sm mb-2">
                  |<span>--&gt;root@root:</span> <span style={{ color: '#a6e22e' }}>{history.length}</span> records
                </div>
                {history.map((item, idx) => (
                  <div key={idx} className="text-xs" style={{ color: '#75715e' }}>
                    <span style={{ color: '#a1efe4' }}>[{item.timestamp}]</span> {item.input}
                  </div>
                ))}
              </div>
            </TerminalWindow>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t-2 mt-auto" style={{ borderColor: '#66d9ef', backgroundColor: 'rgba(30, 30, 30, 0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="px-6 py-4">
          <div className="max-w-3xl mx-auto">
            {/* Top Footer Section */}
            <div className="flex items-center justify-between mb-3">
              <div style={{ color: '#75715e' }} className="text-xs">
                © 2025 Memory Range Calculator | Built with React + Monokai Theme
              </div>
              <div style={{ color: '#75715e' }} className="text-xs">
                System Ready
              </div>
            </div>

            {/* Contact Links */}
            <div className="flex items-center gap-6 justify-center flex-wrap">
              <a
                href="https://github.com/arrhenius975/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link flex items-center gap-2 text-sm"
                style={{ color: '#a1efe4' }}
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/a-r-zakaria-talukdar-635419257/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link flex items-center gap-2 text-sm"
                style={{ color: '#a1efe4' }}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href="https://zakportfolio.edgeone.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link flex items-center gap-2 text-sm"
                style={{ color: '#a1efe4' }}
              >
                <Globe className="w-4 h-4" />
                Portfolio
              </a>
              <a
                href="mailto:zakariatalukdar123@gmail.com"
                className="footer-link flex items-center gap-2 text-sm"
                style={{ color: '#a1efe4' }}
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>

            {/* Bottom Footer */}
            <div style={{ color: '#75715e' }} className="text-xs text-center mt-3 border-t" style={{ borderColor: '#49483e' }}>
              <div className="pt-3">
                Made with <span style={{ color: '#f92672' }}>♥</span> | Terminal v1.0.0
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
