import {
    FaCodeBranch,
    FaExternalLinkAlt,
    FaGithub,
    FaStar,
} from 'react-icons/fa';
import type { FilteredRepo } from '../../types';
import { skeleton } from '../../utils';

const languageColors: Record<string, string> = {
  TypeScript: 'text-blue-400',
  JavaScript: 'text-yellow-400',
  Python: 'text-green-400',
  Rust: 'text-orange-400',
  Go: 'text-cyan-400',
  CSS: 'text-pink-400',
};

interface Props {
  repos: FilteredRepo[];
  loading: boolean;
}

const RepoCard: React.FC<{ repo: FilteredRepo }> = ({ repo }) => (
  <div className="card shadow-lg compact bg-base-100 h-full">
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base-content opacity-80 text-sm leading-tight truncate flex-1 mr-2">
          {repo.name}
        </h3>
        <div className="flex gap-2 shrink-0">
          {repo.link && (
            <a
              href={repo.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-6 w-6 items-center justify-center text-base-content opacity-40 hover:opacity-80 transition-opacity"
              title="Демо"
            >
              <FaExternalLinkAlt size={12} />
            </a>
          )}
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-6 w-6 items-center justify-center text-base-content opacity-40 hover:opacity-80 transition-opacity"
            title="Открыть на GitHub"
          >
            <FaGithub size={14} />
          </a>
        </div>
      </div>

      <p className="text-xs text-base-content opacity-50 flex-1 mb-3 leading-relaxed line-clamp-3">
        {repo.description || 'Нет описания'}
      </p>

      <div className="flex items-center gap-3 mt-auto flex-wrap">
        {repo.language && (
          <span
            className={`text-xs font-mono ${languageColors[repo.language] || 'text-base-content opacity-60'}`}
          >
            ● {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1 text-xs text-base-content opacity-50">
            <FaStar size={10} /> {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1 text-xs text-base-content opacity-50">
            <FaCodeBranch size={10} /> {repo.forks}
          </span>
        )}
      </div>
    </div>
  </div>
);

const GithubCard: React.FC<Props> = ({ repos, loading }) => {
  const safeRepos = Array.isArray(repos) ? repos : [];

  return (
    <div>
      <div className="card compact shadow bg-base-100 bg-opacity-40">
        <div className="card-body">
          <div className="mx-3 mb-2">
            <h2 className="card-title">
              <span className="text-base-content opacity-70">
                Проекты GitHub
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card shadow compact bg-base-100 p-6">
                    <div className="space-y-2">
                      {skeleton({ widthCls: 'w-40', heightCls: 'h-4' })}
                      <div className="mt-2">
                        {skeleton({ widthCls: 'w-full', heightCls: 'h-3' })}
                      </div>
                      <div className="mt-1">
                        {skeleton({ widthCls: 'w-3/4', heightCls: 'h-3' })}
                      </div>
                      <div className="mt-3">
                        {skeleton({ widthCls: 'w-20', heightCls: 'h-4' })}
                      </div>
                    </div>
                  </div>
                ))
              : safeRepos.map((repo) => (
                  <RepoCard key={repo.name} repo={repo} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubCard;
