"use client";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { MOCK_VOICE_PHRASES } from "@/lib/mockBandData";

interface MockVoiceInputProps {
  onTranscription: (text: string, confidence?: number) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  showDevControls?: boolean;
  language?: string;
}

export function MockVoiceInput({ 
  onTranscription,
  onError,
  placeholder = "Tap to start voice input...",
  showDevControls = true,
  language = "en-US"
}: MockVoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [volume, setVolume] = useState(0);
  const [selectedPhrase, setSelectedPhrase] = useState("");
  const [customPhrase, setCustomPhrase] = useState("");
  const [processingTime, setProcessingTime] = useState(2000);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate audio level monitoring
  useEffect(() => {
    if (isListening) {
      volumeIntervalRef.current = setInterval(() => {
        // Simulate realistic voice input volume levels
        const baseVolume = 20 + Math.random() * 60;
        const variation = Math.sin(Date.now() / 200) * 15;
        setVolume(Math.max(0, Math.min(100, baseVolume + variation)));
      }, 100);
    } else {
      setVolume(0);
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    }

    return () => {
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    };
  }, [isListening]);

  const simulateVoiceInput = async (text?: string) => {
    if (isListening) {
      stopListening();
      return;
    }

    setIsListening(true);
    setTranscript("");
    setConfidence(0);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Use provided text, selected phrase, or random phrase
      const phraseToUse = text || selectedPhrase || customPhrase || 
        MOCK_VOICE_PHRASES[Math.floor(Math.random() * MOCK_VOICE_PHRASES.length)];
      
      // Simulate realistic confidence based on phrase complexity
      const mockConfidence = Math.max(0.7, Math.min(0.98, 0.85 + (Math.random() - 0.5) * 0.2));
      
      // Simulate word-by-word transcription
      const words = phraseToUse.split(' ');
      let currentTranscript = '';
      
      for (let i = 0; i < words.length; i++) {
        currentTranscript += (i > 0 ? ' ' : '') + words[i];
        setTranscript(currentTranscript);
        setConfidence(mockConfidence * (i + 1) / words.length);
        
        // Small delay between words for realism
        await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200));
      }

      // Final result
      setConfidence(mockConfidence);
      onTranscription(phraseToUse, mockConfidence);
      
    } catch (error) {
      onError?.("Voice recognition failed");
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript("");
    setConfidence(0);
  };

  return (
    <div className="space-y-4">
      {/* Voice Input Interface */}
      <div className="card-glass p-6">
        <div className="text-center">
          {/* Microphone Button */}
          <button
            onClick={() => simulateVoiceInput()}
            disabled={isListening && !transcript}
            className={`
              inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl shadow-lg transition-all duration-200
              ${isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/25' 
                : 'bg-teal-500 hover:bg-teal-600 hover:scale-105 shadow-teal-500/25'
              }
            `}
          >
            <Icon 
              icon={isListening ? "material-symbols:mic" : "material-symbols:mic-off"} 
              width={32} 
              height={32}
            />
          </button>

          {/* Status Text */}
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isListening ? "Listening..." : placeholder}
            </p>

            {/* Volume Indicator */}
            {isListening && (
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-1 rounded-full transition-all duration-150
                      ${volume > (i + 1) * 20 
                        ? 'bg-teal-500 h-4' 
                        : 'bg-gray-300 dark:bg-gray-600 h-2'
                      }
                    `}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Transcript:
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Confidence: {Math.round(confidence * 100)}%
              </span>
            </div>
            <p className="text-gray-900 dark:text-gray-100">"{transcript}"</p>
          </div>
        )}
      </div>

      {/* Development Controls */}
      {showDevControls && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Voice Input Controls
            </h3>
            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
              DEV MODE
            </span>
          </div>

          {/* Processing Time Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Processing Time: {processingTime}ms
            </label>
            <input
              type="range"
              min="500"
              max="4000"
              step="250"
              value={processingTime}
              onChange={(e) => setProcessingTime(Number(e.target.value))}
              className="w-full"
              disabled={isListening}
            />
          </div>

          {/* Preset Phrases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Test Phrases:
            </label>
            <select 
              className="input-field w-full mb-2"
              value={selectedPhrase}
              onChange={(e) => setSelectedPhrase(e.target.value)}
              disabled={isListening}
            >
              <option value="">Select a phrase...</option>
              <optgroup label="Equipment Operations">
                <option value="Student ID 12345 checking out trumpet">Student checkout</option>
                <option value="Equipment condition is excellent">Equipment condition</option>
                <option value="Return date should be next Friday">Set return date</option>
              </optgroup>
              <optgroup label="Maintenance">
                <option value="Maintenance required for trombone serial TR-001">Maintenance request</option>
                <option value="This instrument needs cleaning">Cleaning needed</option>
              </optgroup>
              <optgroup label="Practice & Performance">
                <option value="Student completed practice session">Practice complete</option>
                <option value="Performance ready for fall concert">Performance ready</option>
              </optgroup>
              <optgroup label="QR Codes">
                <option value="QR code TR-2024-001 scanned successfully">QR scan result</option>
              </optgroup>
            </select>

            <button
              onClick={() => simulateVoiceInput(selectedPhrase)}
              disabled={!selectedPhrase || isListening}
              className="btn-secondary text-sm"
            >
              <Icon icon="material-symbols:play-arrow" className="mr-1" />
              Test Selected Phrase
            </button>
          </div>

          {/* Custom Phrase Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Phrase:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPhrase}
                onChange={(e) => setCustomPhrase(e.target.value)}
                placeholder="Enter custom phrase to test..."
                className="input-field flex-1"
                disabled={isListening}
              />
              <button
                onClick={() => simulateVoiceInput(customPhrase)}
                disabled={!customPhrase || isListening}
                className="btn-primary"
              >
                <Icon icon="material-symbols:mic" />
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recognition Language:
            </label>
            <select 
              className="input-field"
              value={language}
              onChange={(e) => {
                // This would need to be handled by parent component
                console.log("Language changed:", e.target.value);
              }}
              disabled={isListening}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
            </select>
          </div>

          {/* Error Simulation */}
          <button
            onClick={() => {
              setIsListening(true);
              setTimeout(() => {
                setIsListening(false);
                onError?.("Could not hear clearly. Please try again.");
              }, 1000);
            }}
            disabled={isListening}
            className="btn-secondary text-sm w-full"
          >
            <Icon icon="material-symbols:error" className="mr-2" />
            Simulate Recognition Error
          </button>
        </div>
      )}

      {/* Voice Input Status */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span>{isListening ? 'Recording' : 'Ready'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="material-symbols:developer-mode" width={14} />
          <span>Mock Voice Input</span>
        </div>
      </div>
    </div>
  );
}