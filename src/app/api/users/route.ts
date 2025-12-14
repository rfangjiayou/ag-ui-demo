import { NextResponse } from 'next/server';

// 模拟数据库中的用户数据
// eslint-disable-next-line prefer-const
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

let nextId = 4;

// GET /api/users - 获取所有用户
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');

  let result = users;

  // 如果提供了limit参数，则限制返回的用户数量
  if (limit) {
    const limitNum = parseInt(limit, 10);
    if (!isNaN(limitNum) && limitNum > 0) {
      result = users.slice(0, limitNum);
    }
  }

  return NextResponse.json({
    users: result,
    total: users.length,
    timestamp: new Date().toISOString(),
  });
}

// POST /api/users - 创建新用户
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 验证请求体
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, email } = body;

    // 基本验证
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    if (users.some(user => user.email === email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // 创建新用户
    const newUser = {
      id: nextId++,
      name,
      email,
    };

    users.push(newUser);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
