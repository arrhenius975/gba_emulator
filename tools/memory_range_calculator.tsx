import React, { useState } from 'react';
import { Terminal } from 'lucide-react';

export default function MemoryRangeCalculator() {
  const [startAddress, setStartAddress] = useState('');
  const [memorySize, setMemorySize] = useState('');
  const [unit, setUnit] = useState('KB');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);

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

  return (
    <div className="min-h-screen bg-[#272822] p-6 font-mono">
      <style>{`
        .terminal-input {
          background-color: #1e1e1e;
          color: #f8f8f2;
          border: 2px solid #66d9ef;
          caret-color: #f8f8f2;
        }
        .terminal-input::selection {
          background-color: #49483e;
          color: #f8f8f2;
        }
        .terminal-text {
          color: #a1efe4;
        }
        .terminal-success {
          color: #a6e22e;
        }
        .terminal-error {
          color: #f92672;
        }
        .terminal-prompt {
          color: #fd971f;
        }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Terminal className="w-6 h-6" style={{ color: '#66d9ef' }} />
          <h1 className="text-2xl" style={{ color: '#a1efe4' }}>
            MEMORY RANGE CALCULATOR
          </h1>
        </div>

        {/* Input Terminal */}
        <div className="border-2 rounded" style={{ borderColor: '#66d9ef', backgroundColor: '#1e1e1e' }}>
          <div className="px-4 py-3 border-b-2" style={{ borderColor: '#66d9ef', backgroundColor: '#272822' }}>
            <div style={{ color: '#fd971f' }}>$ memory_calculator --input</div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div style={{ color: '#a1efe4' }} className="mb-2">
                <span style={{ color: '#fd971f' }}>❯</span> Enter start memory address (hex format):
              </div>
              <input
                type="text"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0x00000000"
                className="w-full px-3 py-2 rounded terminal-input focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#66d9ef' }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <div style={{ color: '#a1efe4' }} className="mb-2">
                  <span style={{ color: '#fd971f' }}>❯</span> Enter memory size:
                </div>
                <input
                  type="number"
                  value={memorySize}
                  onChange={(e) => setMemorySize(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="16"
                  className="w-full px-3 py-2 rounded terminal-input focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#66d9ef' }}
                />
              </div>
              <div>
                <div style={{ color: '#a1efe4' }} className="mb-2">
                  <span style={{ color: '#fd971f' }}>❯</span> Unit:
                </div>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded terminal-input focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#66d9ef' }}
                >
                  <option value="B">Bytes (B)</option>
                  <option value="KB">Kilobytes (KB)</option>
                  <option value="MB">Megabytes (MB)</option>
                  <option value="GB">Gigabytes (GB)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={calculateRange}
                className="px-4 py-2 rounded font-bold transition"
                style={{
                  backgroundColor: '#a6e22e',
                  color: '#1e1e1e',
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                CALCULATE
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 rounded font-bold transition"
                style={{
                  backgroundColor: '#f92672',
                  color: '#f8f8f2',
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>

        {/* Output Terminal */}
        <div className="border-2 rounded" style={{ borderColor: '#66d9ef', backgroundColor: '#1e1e1e' }}>
          <div className="px-4 py-3 border-b-2" style={{ borderColor: '#66d9ef', backgroundColor: '#272822' }}>
            <div style={{ color: '#fd971f' }}>$ memory_calculator --output</div>
          </div>
          <div className="p-4">
            {output ? (
              <pre style={{ color: '#a6e22e', overflow: 'auto' }} className="text-sm whitespace-pre-wrap break-words">
                {output}
              </pre>
            ) : (
              <div style={{ color: '#75715e' }}>
                [waiting for calculation...]
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="border-2 rounded" style={{ borderColor: '#66d9ef', backgroundColor: '#1e1e1e' }}>
            <div className="px-4 py-3 border-b-2" style={{ borderColor: '#66d9ef', backgroundColor: '#272822' }}>
              <div style={{ color: '#fd971f' }}>$ history ({history.length})</div>
            </div>
            <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
              {history.map((item, idx) => (
                <div key={idx} className="text-xs" style={{ color: '#75715e' }}>
                  <span style={{ color: '#a1efe4' }}>[{item.timestamp}]</span> {item.input}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}