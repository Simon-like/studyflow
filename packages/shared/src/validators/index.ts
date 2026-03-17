/**
 * 共享表单校验规则
 * Web 端和 Mobile 端统一使用
 */

export const authValidators = {
  name: (v: string) => {
    if (!v.trim()) return '请输入姓名';
    if (v.trim().length < 2) return '姓名至少2个字符';
    if (v.trim().length > 20) return '姓名不能超过20个字符';
    return '';
  },

  account: (v: string) => {
    if (!v.trim()) return '请输入手机号或邮箱';
    // 测试环境下放宽校验，允许任意非空字符串
    return '';
  },

  password: (v: string) => {
    if (!v) return '请输入密码';
    if (v.length < 6) return '密码至少6位';
    if (v.length > 32) return '密码不能超过32位';
    if (!/[a-zA-Z]/.test(v) || !/\d/.test(v)) return '密码需包含字母和数字';
    return '';
  },

  confirmPassword: (v: string, password: string) => {
    if (!v) return '请确认密码';
    if (v !== password) return '两次密码不一致';
    return '';
  },

  /** 登录时密码只需非空 */
  loginPassword: (v: string) => {
    if (!v) return '请输入密码';
    return '';
  },
};

/** 判断是否为手机号 */
export function isPhoneNumber(v: string): boolean {
  return /^1[3-9]\d{9}$/.test(v.trim());
}

/** 判断是否为邮箱 */
export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
