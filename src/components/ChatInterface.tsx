'use client';

import { useState, KeyboardEvent } from 'react';

export default function ChatInterface() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [agentType, setAgentType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    await sendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const sendMessage = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await res.json();
      setResponse(data.response);
      setAgentType(data.agentType);
      setMessage(''); // Limpiar el input después de enviar
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Tu pregunta
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={4}
            placeholder="Escribe tu pregunta aquí... (Presiona Enter para enviar, Shift+Enter para nueva línea)"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Procesando...' : 'Enviar'}
        </button>
      </form>

      {response && (
        <div className="mt-8">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Tipo de agente: {agentType}</p>
            <p className="mt-2 text-gray-900">{response}</p>
          </div>
        </div>
      )}
    </div>
  );
} 