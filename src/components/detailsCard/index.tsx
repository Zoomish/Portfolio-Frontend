import { Ionicons } from '@expo/vector-icons';
import React, { Fragment } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';
import type { LinkedInBasicInfo, LinkedInContactResponse } from '../../types';
import { Skeleton } from '../../utils';

type Props = {
  profile: LinkedInBasicInfo | null;
  contact: LinkedInContactResponse['data'] | null;
  loading: boolean;
  githubUsername: string;
  fallbackEmail?: string;
};

const ListItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  link?: string;
}> = ({ icon, title, value, link }) => {
  const handlePress = () => {
    if (link) Linking.openURL(link);
  };

  return (
    <TouchableOpacity style={styles.listItem} onPress={handlePress} disabled={!link}>
      <View style={styles.listItemLeft}>
        {icon}
        <Text style={styles.listItemTitle}>{title}</Text>
      </View>
      <Text style={[styles.listItemValue, link && styles.listItemLink]} numberOfLines={1}>
        {value}
      </Text>
    </TouchableOpacity>
  );
};

const DetailsCard: React.FC<Props> = ({
  profile,
  contact,
  loading,
  githubUsername,
  fallbackEmail,
}) => {
  const email = contact?.email || fallbackEmail || null;

  const portfolioSite = contact?.websites?.find(
    (w) => w.category === 'PORTFOLIO',
  )?.url;

  const telegramUrl = contact?.websites?.find(
    (w) => w.category === 'OTHER' && w.url.includes('t.me'),
  )?.url;

  const telegramHandle = telegramUrl
    ? telegramUrl.replace('https://t.me/', '@')
    : null;

  const renderSkeleton = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <View key={i} style={styles.skeletonRow}>
        <Skeleton width={20} height={20} borderRadius={4} />
        <Skeleton width={80} height={16} style={{ marginLeft: spacing.sm }} />
        <View style={{ flex: 1 }} />
        <Skeleton width={100} height={16} />
      </View>
    ));

  return (
    <View style={styles.card}>
      {loading || !profile ? (
        renderSkeleton()
      ) : (
        <Fragment>
          {profile.location?.full && (
            <ListItem
              icon={<Ionicons name="location-outline" size={18} color={colors.textSecondary} />}
              title="Based in:"
              value={profile.location.full}
            />
          )}
          <ListItem
            icon={<Ionicons name="logo-github" size={18} color={colors.textSecondary} />}
            title="GitHub:"
            value={githubUsername}
            link={`https://github.com/${githubUsername}`}
          />
          {profile.profile_url && (
            <ListItem
              icon={<Ionicons name="logo-linkedin" size={18} color={colors.textSecondary} />}
              title="LinkedIn:"
              value={profile.public_identifier}
              link={profile.profile_url}
            />
          )}
          {telegramHandle && telegramUrl && (
            <ListItem
              icon={<Ionicons name="paper-plane-outline" size={18} color={colors.textSecondary} />}
              title="Telegram:"
              value={telegramHandle}
              link={telegramUrl}
            />
          )}
          {portfolioSite && (
            <ListItem
              icon={<Ionicons name="globe-outline" size={18} color={colors.textSecondary} />}
              title="Website:"
              value={portfolioSite.replace('https://', '').replace('http://', '')}
              link={portfolioSite}
            />
          )}
          {email && (
            <ListItem
              icon={<Ionicons name="mail" size={18} color={colors.textSecondary} />}
              title="Email:"
              value={email}
              link={`mailto:${email}`}
            />
          )}
        </Fragment>
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  listItemTitle: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  listItemValue: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  listItemLink: {
    color: colors.accent,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});

export default DetailsCard;
