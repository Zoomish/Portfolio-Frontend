import React, { Fragment } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cardStyles, colors, fontSize, radius, spacing } from '../../theme';
import type { LinkedInExperience } from '../../types';
import { Skeleton } from '../../utils';

interface Props {
  experiences: LinkedInExperience[];
  loading: boolean;
}

const TimelineItem: React.FC<{
  time: string;
  position: string;
  company: string;
  companyLink?: string;
  location?: string;
  employmentType?: string;
  isLast?: boolean;
}> = ({ time, position, company, companyLink, location, employmentType, isLast }) => {
  const handleCompanyPress = () => {
    if (companyLink) Linking.openURL(companyLink);
  };

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineIndicator}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.position}>{position}</Text>
        <TouchableOpacity onPress={handleCompanyPress} disabled={!companyLink}>
          <Text style={[styles.company, companyLink && { color: colors.accent }]}>
            {company}
          </Text>
        </TouchableOpacity>
        {(location || employmentType) && (
          <Text style={styles.meta}>
            {[employmentType, location].filter(Boolean).join(' · ')}
          </Text>
        )}
      </View>
    </View>
  );
};

const ExperienceCard: React.FC<Props> = ({ experiences, loading }) => {
  const renderSkeleton = () =>
    Array.from({ length: 2 }).map((_, i) => (
      <View key={i} style={[styles.timelineItem, { marginBottom: spacing.lg }]}>
        <View style={styles.timelineIndicator}>
          <View style={styles.dot} />
          {i < 1 && <View style={styles.line} />}
        </View>
        <View style={styles.timelineContent}>
          <Skeleton width={100} height={14} />
          <Skeleton width={160} height={16} style={{ marginTop: spacing.xs }} />
          <Skeleton width={120} height={14} style={{ marginTop: spacing.xs }} />
        </View>
      </View>
    ));

  return (
    <View style={styles.card}>
      {loading ? (
        <Skeleton width={120} height={24} />
      ) : (
        <Text style={cardStyles.cardTitle}>Experience</Text>
      )}
      {loading ? (
        renderSkeleton()
      ) : (
        <Fragment>
          {experiences.map((exp, index) => (
            <TimelineItem
              key={index}
              time={exp.duration}
              position={exp.title}
              company={exp.company}
              companyLink={exp.company_linkedin_url}
              location={exp.location}
              employmentType={exp.employment_type}
              isLast={index === experiences.length - 1}
            />
          ))}
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
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineIndicator: {
    alignItems: 'center',
    width: 20,
    marginRight: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.timelineDot,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: colors.timelineLine,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  position: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  company: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 4,
  },
});

export default ExperienceCard;
