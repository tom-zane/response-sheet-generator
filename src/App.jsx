import { useState } from 'react';
import { generatePDF } from './utils/pdfGenerator';

function App() {
  const [number, setNumber] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setError('');
    
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      const num = parseInt(value);
      if (value === '' || (num >= 1 && num <= 1000)) {
        setNumber(value);
      } else if (num > 1000) {
        setError('Maximum number is 1000');
      } else if (num < 1) {
        setError('Minimum number is 1');
      }
    }
  };

  const handleGenerate = async () => {
    if (!number || number < 1 || number > 1000) {
      setError('Please enter a number between 1 and 1000');
      return;
    }

    setIsGenerating(true);
    try {
      await generatePDF(parseInt(number));
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isGenerating && number) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              PDF Generator
            </h1>
            <p className="text-slate-400 text-sm">
              Generate response sheets with numbered cells
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="number-input" className="block text-sm font-medium text-slate-300 mb-2">
                Number of cells (1-1000)
              </label>
              <input
                id="number-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={number}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter a number..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isGenerating}
              />
              {error && (
                <p className="text-red-400 text-sm mt-2 font-mono">{error}</p>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!number || isGenerating || error}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </div>
              ) : (
                'Generate PDF'
              )}
            </button>
          </div>

          <div className="mt-8 p-4 bg-slate-700 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">PDF Layout</h3>
            <ul className="text-xs text-slate-400 space-y-1 font-mono">
              <li>• 5 columns × 25 rows per page</li>
              <li>• 125 cells per A4 page</li>
              <li>• Number label + response area</li>
              <li>• Optimized for printing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;