import type { Metadata } from 'next';
import { Outfit, Noto_Sans_SC } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/providers/Providers';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StudyFlow - 智能学习伴侣',
  description: '基于番茄工作法的智能学习计划应用，帮助你高效学习',
  keywords: ['番茄钟', '学习管理', '时间管理', '学习计划'],
  authors: [{ name: 'StudyFlow Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#E8A87C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${outfit.variable} ${notoSansSC.variable}`}>
      <body className="font-body bg-cream text-charcoal antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}