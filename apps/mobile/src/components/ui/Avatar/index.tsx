import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AvatarProps } from './types';
import { 
  AVATAR_SIZES, 
  AVATAR_FONT_SIZES, 
  DEFAULT_BG_COLOR, 
  DEFAULT_TEXT_COLOR,
  ONLINE_DOT_COLOR 
} from './constants';
import { colors, radius } from '../../../theme';

export * from './types';

export function Avatar({
  name,
  src,
  size = 'md',
  backgroundColor = DEFAULT_BG_COLOR,
  textColor = DEFAULT_TEXT_COLOR,
  online = false,
}: AvatarProps) {
  const sizeValue = AVATAR_SIZES[size];
  const fontSize = AVATAR_FONT_SIZES[size];
  const displayText = name ? name.charAt(0).toUpperCase() : '?';
  
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          {
            width: sizeValue,
            height: sizeValue,
            borderRadius: size === 'xl' ? radius.xl : sizeValue / 2,
            backgroundColor,
          },
        ]}
      >
        {src ? (
          <Image source={{ uri: src }} style={styles.image} />
        ) : (
          <Text style={[styles.text, { fontSize, color: textColor }]}>
            {displayText}
          </Text>
        )}
      </View>
      {online && size !== 'xs' && (
        <View style={styles.onlineDot} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ONLINE_DOT_COLOR,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
