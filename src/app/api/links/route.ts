import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { links } from '@/storage/database/shared/schema';

// 获取所有链接
export async function GET() {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// 添加新链接
export async function POST(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();

  const { data, error } = await client
    .from('links')
    .insert({
      name: body.name,
      url: body.url,
      category: body.category,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data?.[0] });
}

// 删除链接
export async function DELETE(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();

  // 验证密码
  if (body.password !== '12345') {
    return NextResponse.json({ error: '密码错误' }, { status: 401 });
  }

  const { data, error } = await client
    .from('links')
    .delete()
    .eq('id', body.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data?.[0] });
}
