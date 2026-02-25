'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Gamepad2,
  Smartphone,
  Star,
  Heart,
  Bolt,
  Globe,
  Zap,
  Sparkles,
  Globe2,
  Layout,
  Monitor,
  Puzzle,
  Rocket,
  Tag,
  Gift,
  Crown,
  Diamond,
  Layers,
  Grid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

interface Link {
  id: string;
  name: string;
  url: string;
  category: string;
  created_at: string;
}

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({ name: '', url: '', category: '游戏' });
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLinkId, setDeleteLinkId] = useState<string | null>(null);
  const [addError, setAddError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // 随机图标列表
  const iconList = [
    Star,
    Heart,
    Bolt,
    Globe,
    Zap,
    Sparkles,
    Globe2,
    Layout,
    Monitor,
    Puzzle,
    Rocket,
    Tag,
    Gift,
    Crown,
    Diamond,
    Layers,
    Grid,
  ];

  // 根据链接 ID 获取随机图标
  const getRandomIcon = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return iconList[hash % iconList.length];
  };

  // 获取所有链接
  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const json = await res.json();
      if (json.data) {
        setLinks(json.data);
      }
    } catch (error) {
      console.error('获取链接失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // 添加链接
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newLink.name || !newLink.url) {
      setAddError('请填写所有字段');
      return;
    }

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });

      const json = await res.json();
      if (json.error) {
        setAddError(json.error);
        return;
      }

      await fetchLinks();
      setNewLink({ name: '', url: '', category: '游戏' });
    } catch (error) {
      setAddError('添加失败，请重试');
    }
  };

  // 删除链接
  const handleDelete = async () => {
    if (!deleteLinkId || deletePassword !== '12345') {
      setDeleteError('密码错误');
      return;
    }

    setDeleteError('');

    try {
      const res = await fetch('/api/links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteLinkId, password: deletePassword }),
      });

      const json = await res.json();
      if (json.error) {
        setDeleteError(json.error);
        return;
      }

      await fetchLinks();
      setDeletePassword('');
      setDeleteLinkId(null);
    } catch (error) {
      setDeleteError('删除失败，请重试');
    }
  };

  // 统计数量
  const gameCount = links.filter((l) => l.category === '游戏').length;
  const appCount = links.filter((l) => l.category === '应用').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 顶部统计 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">游戏总数</p>
                  <p className="text-3xl font-bold text-blue-600">{gameCount}</p>
                </div>
                <Gamepad2 className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">应用总数</p>
                  <p className="text-3xl font-bold text-green-600">{appCount}</p>
                </div>
                <Smartphone className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 添加按钮 */}
        <div className="mb-8 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                添加链接
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新链接</DialogTitle>
                <DialogDescription>
                  添加一个游戏或应用链接，所有人可见
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">名称</Label>
                  <Input
                    id="name"
                    value={newLink.name}
                    onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                    placeholder="输入名称"
                  />
                </div>
                <div>
                  <Label htmlFor="url">网址</Label>
                  <Input
                    id="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="category">分类</Label>
                  <select
                    id="category"
                    value={newLink.category}
                    onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="游戏">游戏</option>
                    <option value="应用">应用</option>
                  </select>
                </div>
                {addError && <p className="text-sm text-red-500">{addError}</p>}
                <Button type="submit" className="w-full">
                  添加
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 链接列表 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">所有链接</h2>
          {links.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                暂无链接，点击上方按钮添加
              </CardContent>
            </Card>
          ) : (
            links.map((link) => {
              const RandomIcon = getRandomIcon(link.id);
              return (
                <Card key={link.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-0 flex items-center gap-3 group"
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            link.category === '游戏'
                              ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                              : 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                          }`}
                        >
                          <RandomIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                link.category === '游戏'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              }`}
                            >
                              {link.category === '游戏' ? (
                                <Gamepad2 className="w-3 h-3" />
                              ) : (
                                <Smartphone className="w-3 h-3" />
                              )}
                              {link.category}
                            </span>
                            <h3 className="text-lg font-semibold truncate group-hover:text-blue-600 transition-colors">
                              {link.name}
                            </h3>
                          </div>
                        </div>
                      </a>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除 "{link.name}" 吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-2 my-4">
                          <Label htmlFor="delete-password">删除密码</Label>
                          <Input
                            id="delete-password"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => {
                              setDeletePassword(e.target.value);
                              setDeleteError('');
                            }}
                            placeholder="输入删除密码"
                          />
                          {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => {
                              setDeletePassword('');
                              setDeleteError('');
                            }}
                          >
                            取消
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              setDeleteLinkId(link.id);
                              handleDelete();
                            }}
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}
