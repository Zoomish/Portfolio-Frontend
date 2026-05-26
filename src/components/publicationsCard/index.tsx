import { Ionicons } from '@expo/vector-icons';
import { formatDistance } from 'date-fns';
import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cardStyles, colors, fontSize, radius, spacing } from '../../theme';
import type { LinkedInPost } from '../../types';
import { Skeleton } from '../../utils';

interface Props {
  posts: LinkedInPost[];
  loading: boolean;
}

function getPostImageUrls(post: LinkedInPost): string[] {
  const { media } = post;
  if (!media || media.type !== 'image') return [];
  const fromImages = media.images?.map((img) => img.url).filter(Boolean) ?? [];
  if (fromImages.length > 0) return fromImages as string[];
  return media.url ? [media.url] : [];
}

const PostCard: React.FC<{ post: LinkedInPost }> = ({ post }) => {
  const truncated =
    post.text && post.text.length > 280
      ? post.text.slice(0, 280) + '\u2026'
      : post.text;
  const postedDate = new Date(post.posted_at.date);
  const imageUrls = getPostImageUrls(post);
  const hasText = Boolean(post.text?.trim());

  return (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => Linking.openURL(post.url)}
      activeOpacity={0.7}
    >
      <View style={styles.postHeader}>
        <Image
          source={{ uri: post.author.profile_picture }}
          style={styles.authorAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.authorName}>
            {post.author.first_name} {post.author.last_name}
          </Text>
          <Text style={styles.postDate}>
            {formatDistance(postedDate, new Date(), { addSuffix: true })}
          </Text>
        </View>
        <Ionicons name="logo-linkedin" size={20} color={colors.linkedIn} style={{ opacity: 0.6 }} />
      </View>

      {hasText && <Text style={styles.postText}>{truncated}</Text>}

      {imageUrls.length > 0 && (
        <View style={[styles.imageGrid, hasText && { marginTop: spacing.md }]}>
          {imageUrls.map((src, idx) => (
            <Image
              key={`${post.full_urn}-img-${idx}`}
              source={{ uri: src }}
              style={[
                styles.postImage,
                imageUrls.length > 1 && { width: '48%' },
              ]}
              resizeMode="contain"
            />
          ))}
        </View>
      )}

      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={12} color={colors.textMuted} />
          <Text style={styles.statText}>{post.stats.total_reactions}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble" size={12} color={colors.textMuted} />
          <Text style={styles.statText}>{post.stats.comments}</Text>
        </View>
        {post.stats.reposts > 0 && (
          <View style={styles.statItem}>
            <Ionicons name="share-social" size={12} color={colors.textMuted} />
            <Text style={styles.statText}>{post.stats.reposts}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const PublicationsCard: React.FC<Props> = ({ posts, loading }) => {
  const renderSkeleton = () =>
    Array.from({ length: 3 }).map((_, i) => (
      <View key={i} style={styles.postCard}>
        <View style={styles.postHeader}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Skeleton width={120} height={14} />
            <Skeleton width={80} height={12} style={{ marginTop: spacing.xs }} />
          </View>
        </View>
        <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
          <Skeleton width={'100%' as unknown as number} height={12} />
          <Skeleton width={'100%' as unknown as number} height={12} />
          <Skeleton width={'66%' as unknown as number} height={12} />
        </View>
      </View>
    ));

  return (
    <View style={styles.card}>
      <Text style={cardStyles.cardTitle}>Publications</Text>
      {loading ? (
        renderSkeleton()
      ) : posts?.length > 0 ? (
        posts.map((post) => <PostCard key={post.full_urn} post={post} />)
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={48} color={colors.textMuted} style={{ opacity: 0.3 }} />
          <Text style={styles.emptyText}>No publications yet</Text>
        </View>
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
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
    opacity: 0.8,
  },
  postDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  postText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  postStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});

export default PublicationsCard;
