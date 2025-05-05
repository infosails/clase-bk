import '@/app/globals.css'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat con Agentes Especializados',
  description: 'Un chat que utiliza diferentes agentes de IA para responder preguntas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
} 