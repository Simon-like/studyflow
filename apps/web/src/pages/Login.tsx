export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">登录</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">用户名</label>
          <input type="text" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <input type="password" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          登录
        </button>
      </form>
    </div>
  );
}
