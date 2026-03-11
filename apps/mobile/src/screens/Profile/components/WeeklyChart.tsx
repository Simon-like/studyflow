import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontSize } from '../../../theme';
import { WEEK_DATA, WEEK_DAYS } from '../constants';

const MAX_VALUE = Math.max(...WEEK_DATA);

export function WeeklyChart() {
  return (
    <Card>
      <SectionHeader title="本周学习时长" />
      <View style={styles.chart}>
        {WEEK_DATA.map((value, index) => (
          <View key={index} style={styles.barItem}>
            <Text style={styles.value}>{value}h</Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { height: `${(value / MAX_VALUE) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.day}>{WEEK_DAYS[index]}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  track: {
    width: '100%',
    height: 64,
    backgroundColor: colors.primary + '20',
    borderRadius: radius.md,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    width: '100%',
  },
  day: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
