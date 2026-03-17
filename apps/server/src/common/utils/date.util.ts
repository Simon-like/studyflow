import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 启用插件
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 日期工具类
 * 封装常用的日期操作方法
 */
export class DateUtil {
  /**
   * 获取当前时间
   */
  static now(): Date {
    return new Date();
  }

  /**
   * 获取今日日期字符串 (YYYY-MM-DD)
   */
  static today(): string {
    return dayjs().format('YYYY-MM-DD');
  }

  /**
   * 获取昨日日期字符串
   */
  static yesterday(): string {
    return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  }

  /**
   * 格式化日期
   */
  static format(date: Date | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
    return dayjs(date).format(format);
  }

  /**
   * 获取日期开始时间
   */
  static startOfDay(date: Date | string): Date {
    return dayjs(date).startOf('day').toDate();
  }

  /**
   * 获取日期结束时间
   */
  static endOfDay(date: Date | string): Date {
    return dayjs(date).endOf('day').toDate();
  }

  /**
   * 获取日期范围
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 日期数组
   */
  static getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    let current = dayjs(startDate);
    const end = dayjs(endDate);

    while (current.isBefore(end) || current.isSame(end, 'day')) {
      dates.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }

    return dates;
  }

  /**
   * 计算两个日期之间的天数差
   */
  static diffDays(date1: Date | string, date2: Date | string): number {
    const d1 = dayjs(date1).startOf('day');
    const d2 = dayjs(date2).startOf('day');
    return d1.diff(d2, 'day');
  }

  /**
   * 判断是否是今天
   */
  static isToday(date: Date | string): boolean {
    return dayjs(date).isSame(dayjs(), 'day');
  }

  /**
   * 判断是否连续
   * 用于连续学习天数计算
   */
  static isConsecutive(prevDate: Date | string, currentDate: Date | string): boolean {
    const prev = dayjs(prevDate).startOf('day');
    const current = dayjs(currentDate).startOf('day');
    return current.diff(prev, 'day') === 1;
  }

  /**
   * 获取本周开始日期（周一）
   */
  static startOfWeek(date: Date | string = new Date()): Date {
    return dayjs(date).startOf('week').add(1, 'day').toDate(); // 周一为开始
  }

  /**
   * 获取本周结束日期（周日）
   */
  static endOfWeek(date: Date | string = new Date()): Date {
    return dayjs(date).endOf('week').add(1, 'day').toDate();
  }

  /**
   * 获取 ISO 格式的日期字符串
   */
  static toISOString(date: Date | string): string {
    return dayjs(date).toISOString();
  }
}
