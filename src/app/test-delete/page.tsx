'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestDeletePage() {
  const [testId, setTestId] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const handleTest = async () => {
    setResult('开始测试...');

    try {
      console.log('发送请求:', { id: testId, password });

      const res = await fetch('/api/links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: testId, password }),
      });

      console.log('响应状态:', res.status);
      console.log('响应头:', Object.fromEntries(res.headers.entries()));

      const text = await res.text();
      console.log('响应体:', text);
      console.log('响应体长度:', text.length);

      if (!text) {
        setResult(`错误：响应体为空 (状态码: ${res.status})`);
        return;
      }

      const json = JSON.parse(text);
      console.log('解析结果:', json);

      setResult(`成功: ${JSON.stringify(json)}`);
    } catch (error) {
      console.error('测试失败:', error);
      setResult(`失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">删除功能测试页面</h1>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block mb-2">链接 ID</label>
          <Input value={testId} onChange={(e) => setTestId(e.target.value)} placeholder="输入要删除的链接 ID" />
        </div>
        <div>
          <label className="block mb-2">密码</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="输入密码 (12345)" />
        </div>
        <Button onClick={handleTest}>测试删除</Button>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      </div>
    </div>
  );
}
