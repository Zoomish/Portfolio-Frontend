import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FALLBACK_IMAGE } from '../../constants';
import { colors, fontSize, radius, spacing } from '../../theme';
import type { LinkedInBasicInfo } from '../../types';
import { Skeleton } from '../../utils';

interface AvatarCardProps {
  profile: LinkedInBasicInfo | null;
  loading: boolean;
  resumeFileUrl?: string;
}

const AvatarCard: React.FC<AvatarCardProps> = ({ profile, loading, resumeFileUrl }) => {
  const handleDownloadResume = () => {
    if (resumeFileUrl) Linking.openURL(resumeFileUrl);
  };

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        {loading || !profile ? (
          <Skeleton width={128} height={128} borderRadius={64} />
        ) : (
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: profile.profile_picture_url || FALLBACK_IMAGE }}
              style={styles.avatar}
            />
            {profile.open_to_work && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>#Open to Work</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.textContainer}>
          {loading || !profile ? (
            <>
              <Skeleton width={200} height={28} />
              <Skeleton width={200} height={18} style={{ marginTop: spacing.sm }} />
            </>
          ) : (
            <>
              <Text style={styles.name}>{profile.fullname}</Text>
              <Text style={styles.headline}>{profile.headline}</Text>
            </>
          )}
        </View>

        {resumeFileUrl ? (
          loading ? (
            <Skeleton width={160} height={36} style={{ marginTop: spacing.lg }} />
          ) : (
            <TouchableOpacity style={styles.resumeBtn} onPress={handleDownloadResume}>
              <Text style={styles.resumeBtnText}>Download Resume</Text>
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -48,
    backgroundColor: '#22c55e',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    opacity: 0.7,
    textAlign: 'center',
  },
  headline: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  resumeBtn: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resumeBtnText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});

export default AvatarCard;
