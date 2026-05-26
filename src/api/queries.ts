import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import type { GithubReposResponse, LinkedInAllResponse } from '../types';

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const queryKeys = {
  githubRepos: ['github', 'repos'] as const,
  linkedinAll: ['linkedin', 'all'] as const,
};

// ─── GitHub repos ─────────────────────────────────────────────────────────────

export function useGithubRepos() {
  return useQuery({
    queryKey: queryKeys.githubRepos,
    queryFn: async () => {
      const { data } =
        await apiClient.get<GithubReposResponse>('/github/repos');
      return data;
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 2000,
  });
}

// ─── LinkedIn all data ────────────────────────────────────────────────────────

export function useLinkedinAll() {
  return useQuery({
    queryKey: queryKeys.linkedinAll,
    queryFn: async () => {
      const { data } =
        await apiClient.get<LinkedInAllResponse>('/linkedin/all');
      return data;
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 2000,
  });
}
