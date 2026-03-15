import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@studyflow/api";
import { useAuthStore } from "@/stores/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Bell,
  Moon,
  Shield,
  User,
  Clock,
  Volume2,
  Smartphone,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import type { PomodoroSettings, SystemSettings } from "@studyflow/shared";

// Query keys
const SETTINGS_KEYS = {
  pomodoro: ["settings", "pomodoro"] as const,
  system: ["settings", "system"] as const,
};

/**
 * 格式化秒数为分钟显示
 */
function formatDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}分钟`;
}

/**
 * 解析分钟数为秒数
 */
function parseDuration(minutes: string): number {
  return parseInt(minutes, 10) * 60 || 0;
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // ============ 数据查询 ============

  // 番茄钟设置
  const { data: pomodoroSettings, isLoading: isLoadingPomodoro } = useQuery({
    queryKey: SETTINGS_KEYS.pomodoro,
    queryFn: async () => {
      const response = await api.user.getPomodoroSettings();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 系统设置
  const { data: systemSettings, isLoading: isLoadingSystem } = useQuery({
    queryKey: SETTINGS_KEYS.system,
    queryFn: async () => {
      const response = await api.user.getSystemSettings();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // ============ 更新Mutation ============

  // 更新番茄钟设置
  const updatePomodoroMutation = useMutation({
    mutationFn: (data: PomodoroSettings) =>
      api.user.updatePomodoroSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.pomodoro });
      toast.success("番茄钟设置已更新");
    },
    onError: () => {
      toast.error("设置更新失败");
    },
  });

  // 更新系统设置
  const updateSystemMutation = useMutation({
    mutationFn: (data: SystemSettings) => api.user.updateSystemSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.system });
      toast.success("系统设置已更新");
    },
    onError: () => {
      toast.error("设置更新失败");
    },
  });

  // 修改密码
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.user.changePassword({ ...data, confirmPassword: data.newPassword }),
    onSuccess: () => {
      toast.success("密码修改成功");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: () => {
      toast.error("密码修改失败，请检查当前密码");
    },
  });

  // ============ 本地状态 ============

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 本地设置状态（用于UI）
  const [localPomodoroSettings, setLocalPomodoroSettings] =
    useState<PomodoroSettings | null>(null);
  const [localSystemSettings, setLocalSystemSettings] =
    useState<SystemSettings | null>(null);

  // 同步服务器数据到本地状态
  useEffect(() => {
    if (pomodoroSettings) {
      setLocalPomodoroSettings(pomodoroSettings);
    }
  }, [pomodoroSettings]);

  useEffect(() => {
    if (systemSettings) {
      setLocalSystemSettings(systemSettings);
    }
  }, [systemSettings]);

  // ============ 事件处理 ============

  const handlePomodoroChange = (
    field: keyof PomodoroSettings,
    value: number | boolean,
  ) => {
    if (!localPomodoroSettings) return;
    const newSettings = { ...localPomodoroSettings, [field]: value };
    setLocalPomodoroSettings(newSettings);
    updatePomodoroMutation.mutate(newSettings);
  };

  const handleSystemChange = (
    field: keyof SystemSettings,
    value: string | boolean,
  ) => {
    if (!localSystemSettings) return;
    const newSettings = { ...localSystemSettings, [field]: value };
    setLocalSystemSettings(newSettings);
    updateSystemMutation.mutate(newSettings);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("两次输入的新密码不一致");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("新密码长度至少6位");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleLogout = () => {
    logout();
    toast.success("已退出登录");
  };

  const isLoading = isLoadingPomodoro || isLoadingSystem;

  if (isLoading) {
    return (
      <div className="p-10 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-mist/30 rounded" />
          <div className="h-48 bg-mist/30 rounded-2xl" />
          <div className="h-48 bg-mist/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-charcoal mb-8">设置</h1>

      <div className="space-y-8 flex flex-col gap-4">
        {/* 账户设置 */}
        <Card className="p-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 bg-coral/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-coral" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">账户信息</h2>
              <p className="text-sm text-stone">管理您的个人账户信息</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-mist/20">
              <span className="text-stone">用户名</span>
              <span className="text-charcoal font-medium">
                {user?.username || "未设置"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-mist/20">
              <span className="text-stone">昵称</span>
              <span className="text-charcoal font-medium">
                {user?.nickname || "未设置"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-stone">邮箱</span>
              <span className="text-charcoal font-medium">
                {user?.email || "未设置"}
              </span>
            </div>
          </div>
        </Card>

        {/* 番茄钟设置 */}
        <Card className="p-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-sage" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">
                番茄钟设置
              </h2>
              <p className="text-sm text-stone">自定义您的专注时长</p>
            </div>
          </div>
          <div className="space-y-4">
            {/* 专注时长 */}
            <div className="flex justify-between items-center py-2 border-b border-mist/20">
              <span className="text-stone">专注时长</span>
              <select
                value={Math.floor(
                  (localPomodoroSettings?.focusDuration || 1500) / 60,
                )}
                onChange={(e) =>
                  handlePomodoroChange(
                    "focusDuration",
                    parseInt(e.target.value) * 60,
                  )
                }
                className="bg-warm rounded-lg px-3 py-1.5 text-charcoal text-sm focus:ring-2 focus:ring-coral/30 outline-none"
              >
                {[15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((min) => (
                  <option key={min} value={min}>
                    {min}分钟
                  </option>
                ))}
              </select>
            </div>
            {/* 短休息 */}
            <div className="flex justify-between items-center py-2 border-b border-mist/20">
              <span className="text-stone">短休息时长</span>
              <select
                value={Math.floor(
                  (localPomodoroSettings?.shortBreakDuration || 300) / 60,
                )}
                onChange={(e) =>
                  handlePomodoroChange(
                    "shortBreakDuration",
                    parseInt(e.target.value) * 60,
                  )
                }
                className="bg-warm rounded-lg px-3 py-1.5 text-charcoal text-sm focus:ring-2 focus:ring-coral/30 outline-none"
              >
                {[3, 5, 10, 15].map((min) => (
                  <option key={min} value={min}>
                    {min}分钟
                  </option>
                ))}
              </select>
            </div>
            {/* 长休息 */}
            <div className="flex justify-between items-center py-2">
              <span className="text-stone">长休息时长</span>
              <select
                value={Math.floor(
                  (localPomodoroSettings?.longBreakDuration || 900) / 60,
                )}
                onChange={(e) =>
                  handlePomodoroChange(
                    "longBreakDuration",
                    parseInt(e.target.value) * 60,
                  )
                }
                className="bg-warm rounded-lg px-3 py-1.5 text-charcoal text-sm focus:ring-2 focus:ring-coral/30 outline-none"
              >
                {[10, 15, 20, 25, 30].map((min) => (
                  <option key={min} value={min}>
                    {min}分钟
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* 通知设置 */}
        <Card className="p-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-sage" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">通知设置</h2>
              <p className="text-sm text-stone">管理您的通知偏好</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-mist/20">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-stone" />
                <span className="text-stone">启用通知</span>
              </div>
              <ToggleSwitch
                checked={localSystemSettings?.notificationEnabled ?? true}
                onChange={(checked) =>
                  handleSystemChange("notificationEnabled", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-mist/20">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-stone" />
                <span className="text-stone">提示音</span>
              </div>
              <ToggleSwitch
                checked={localSystemSettings?.soundEnabled ?? true}
                onChange={(checked) =>
                  handleSystemChange("soundEnabled", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-stone" />
                <span className="text-stone">震动提醒</span>
              </div>
              <ToggleSwitch
                checked={localSystemSettings?.vibrationEnabled ?? true}
                onChange={(checked) =>
                  handleSystemChange("vibrationEnabled", checked)
                }
              />
            </div>
          </div>
        </Card>

        {/* 外观设置 */}
        <Card className="p-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 bg-warm rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">外观</h2>
              <p className="text-sm text-stone">自定义您的界面外观</p>
            </div>
          </div>
          <div className="space-y-3">
            {(["light", "dark", "system"] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleSystemChange("theme", theme)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  localSystemSettings?.theme === theme
                    ? "border-coral bg-coral/5"
                    : "border-mist/30 hover:border-mist/50"
                }`}
              >
                <span className="text-charcoal">
                  {theme === "light" && "浅色模式"}
                  {theme === "dark" && "深色模式"}
                  {theme === "system" && "跟随系统"}
                </span>
                {localSystemSettings?.theme === theme && (
                  <div className="w-5 h-5 rounded-full bg-coral flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* 隐私与安全 */}
        <Card className="p-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 bg-coral/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-coral" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">
                隐私与安全
              </h2>
              <p className="text-sm text-stone">管理您的隐私设置</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-mist/30 hover:border-mist/50 transition-all"
            >
              <span className="text-charcoal">修改密码</span>
              <ChevronRight className="w-5 h-5 text-stone" />
            </button>
          </div>
        </Card>

        {/* 退出登录 */}
        <Card className="p-7">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-coral/30 text-coral hover:bg-coral/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </Card>

        {/* 危险区域 */}
        <Card className="p-7 border-red-200">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-600">危险区域</h2>
              <p className="text-sm text-stone">删除账号的操作不可恢复</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm("确定要删除账号吗？此操作不可恢复！")) {
                api.user
                  .deleteAccount()
                  .then(() => {
                    toast.success("账号已删除");
                    logout();
                  })
                  .catch(() => {
                    toast.error("删除失败");
                  });
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">删除账号</span>
          </button>
        </Card>
      </div>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-mist/20">
              <h2 className="text-xl font-semibold text-charcoal">修改密码</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-mist/30 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-stone"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  当前密码
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-warm rounded-xl border-0 text-charcoal focus:ring-2 focus:ring-coral/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  新密码
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-warm rounded-xl border-0 text-charcoal focus:ring-2 focus:ring-coral/30"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-warm rounded-xl border-0 text-charcoal focus:ring-2 focus:ring-coral/30"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPasswordModal(false)}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "保存中..." : "保存"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

// Toggle Switch 组件
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-colors ${
        checked ? "bg-coral" : "bg-mist"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
          checked ? "translate-x-6" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
