import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';
import { Skeleton } from '../../utils';

interface Props {
  content: string | null;
  loading: boolean;
}

const Footer: React.FC<Props> = ({ content, loading }) => {
  if (!content) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {loading ? (
          <Skeleton width={160} height={18} />
        ) : (
          <Text style={styles.text}>{content}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default Footer;
