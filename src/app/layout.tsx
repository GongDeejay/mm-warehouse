import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'M+M仓',
    template: '%s | M+M仓',
  },
  description: 'M+M仓 - 极简的链接管理应用',
};

// 动态导入开发工具，只在开发环境加载
async function DevInspector() {
  if (process.env.NODE_ENV === 'development') {
    const { Inspector } = await import('react-dev-inspector');
    return <Inspector />;
  }
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const InspectorComponent = await DevInspector();

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {InspectorComponent}
        {children}
      </body>
    </html>
  );
}
