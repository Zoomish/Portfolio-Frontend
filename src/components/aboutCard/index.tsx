import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cardStyles, colors, fontSize, radius, spacing } from '../../theme';
import { Skeleton } from '../../utils';

interface Props {
  about: string | null;
  loading: boolean;
}

const AboutCard: React.FC<Props> = ({ about, loading }) => {
  if (!loading && !about) return null;

  return (
    <View style={styles.card}>
      {loading ? (
        <Skeleton width={100} height={24} />
      ) : (
        <Text style={cardStyles.cardTitle}>About Me</Text>
      )}
      {loading ? (
        <View style={{ gap: spacing.sm }}>
          <Skeleton width={'100%' as unknown as number} height={14} />
          <Skeleton width={'100%' as unknown as number} height={14} />
          <Skeleton width={'75%' as unknown as number} height={14} />
        </View>
      ) : (
        <Text style={styles.text}>{about}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default AboutCard;
