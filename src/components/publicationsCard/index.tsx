import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AiOutlineContainer } from 'react-icons/ai';
import { FaComment, FaHeart, FaLinkedin, FaShare } from 'react-icons/fa';
import type { LinkedInPost } from '../../types';
import { skeleton } from '../../utils';

interface Props {
  posts: LinkedInPost[];
  loading: boolean;
  profileUrl?: string;
  authorAvatar?: string;
}

function getPostImages(post: LinkedInPost) {
  const { media } = post;
  if (!media || media.type !== 'image') return [];

  const fromImages = (media.images ?? []).filter((img) => img.url);
  if (fromImages.length > 0) {
    return fromImages.map((img) => ({
      url: img.url,
      width: img.width || 1200,
      height: img.height || 800,
    }));
  }

  return media.url ? [{ url: media.url, width: 1200, height: 800 }] : [];
}

const PostCard: React.FC<{ post: LinkedInPost; authorAvatar?: string }> = ({
  post,
  authorAvatar,
}) => {
  const postedDate = new Date(post.posted_at.date);
  const images = getPostImages(post);
  const hasText = Boolean(post.text?.trim());

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className="card shadow-lg compact bg-base-100 h-full cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={`${post.author.first_name} ${post.author.last_name}`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : null}
          <div>
            <p className="font-medium text-sm text-base-content opacity-80">
              {post.author.first_name} {post.author.last_name}
            </p>
            <p className="text-xs text-base-content opacity-40">
              {formatDistance(postedDate, new Date(), {
                addSuffix: true,
                locale: ru,
              })}
            </p>
          </div>
          <FaLinkedin
            className="ml-auto text-blue-500 opacity-60 shrink-0"
            size={18}
          />
        </div>

        {hasText ? (
          <p className="text-base leading-relaxed whitespace-pre-wrap line-clamp-4 text-base-content text-opacity-80">
            {post.text}
          </p>
        ) : null}

        {images.length > 0 ? (
          <div
            className={`grid gap-2 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} ${hasText ? 'mt-3' : ''}`}
          >
            {images.map((image, idx) => (
              <img
                key={`${post.full_urn}-img-${idx}`}
                src={image.url}
                alt={`Изображение публикации — ${post.author.first_name} ${post.author.last_name}`}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                className="w-full max-h-80 rounded-lg object-contain bg-base-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-4 mt-4 text-xs text-base-content opacity-40">
          <span className="flex items-center gap-1">
            <FaHeart size={11} /> {post.stats.total_reactions}
          </span>
          <span className="flex items-center gap-1">
            <FaComment size={11} /> {post.stats.comments}
          </span>
          {post.stats.reposts > 0 && (
            <span className="flex items-center gap-1">
              <FaShare size={11} /> {post.stats.reposts}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

const PublicationsCard: React.FC<Props> = ({
  posts,
  loading,
  profileUrl,
  authorAvatar,
}) => {
  const latest = [...(posts ?? [])]
    .sort(
      (left, right) =>
        (right.posted_at?.timestamp ?? 0) - (left.posted_at?.timestamp ?? 0),
    )
    .slice(0, 2);
  const hasMore = (posts?.length ?? 0) > latest.length;

  return (
    <div>
      <div
        className={`card compact bg-base-100 ${
          loading || posts?.length ? 'shadow bg-opacity-40' : 'shadow-lg'
        }`}
      >
        <div className="card-body">
          <div className="mx-3 mb-2">
            <h2 className="card-title">
              <span className="text-base-content opacity-70">Публикации</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card shadow compact bg-base-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {skeleton({
                      widthCls: 'w-10',
                      heightCls: 'h-10',
                      shape: 'rounded-full',
                    })}
                    <div className="space-y-1 flex-1">
                      {skeleton({ widthCls: 'w-32', heightCls: 'h-4' })}
                      {skeleton({ widthCls: 'w-20', heightCls: 'h-3' })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {skeleton({ widthCls: 'w-full', heightCls: 'h-3' })}
                    {skeleton({ widthCls: 'w-full', heightCls: 'h-3' })}
                    {skeleton({ widthCls: 'w-2/3', heightCls: 'h-3' })}
                  </div>
                </div>
              ))
            ) : latest.length > 0 ? (
              latest.map((post) => (
                <PostCard
                  key={post.full_urn}
                  post={post}
                  authorAvatar={authorAvatar}
                />
              ))
            ) : (
              <div className="text-center mb-6">
                <AiOutlineContainer className="mx-auto h-12 w-12 opacity-30" />
                <p className="mt-1 text-sm opacity-50 text-base-content">
                  Пока нет публикаций
                </p>
              </div>
            )}
          </div>
          {!loading && hasMore && profileUrl ? (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="mx-3 mt-2 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
            >
              <FaLinkedin /> Все публикации
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PublicationsCard;
