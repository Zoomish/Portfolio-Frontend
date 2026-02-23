import { formatDistance } from 'date-fns';
import { AiOutlineContainer } from 'react-icons/ai';
import { FaHeart, FaComment, FaShare, FaLinkedin } from 'react-icons/fa';
import { skeleton } from '../../utils';
import type { LinkedInPost } from '../../types';

interface Props {
  posts: LinkedInPost[];
  loading: boolean;
}

const PostCard: React.FC<{ post: LinkedInPost }> = ({ post }) => {
  const truncated =
    post.text.length > 280 ? post.text.slice(0, 280) + '…' : post.text;
  const postedDate = new Date(post.posted_at.date);

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className="card shadow-lg compact bg-base-100 cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.author.profile_picture}
            alt={`${post.author.first_name} ${post.author.last_name}`}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <p className="font-medium text-sm text-base-content opacity-80">
              {post.author.first_name} {post.author.last_name}
            </p>
            <p className="text-xs text-base-content opacity-40">
              {formatDistance(postedDate, new Date(), { addSuffix: true })}
            </p>
          </div>
          <FaLinkedin
            className="ml-auto text-blue-500 opacity-60 shrink-0"
            size={18}
          />
        </div>

        <p className="text-sm text-base-content opacity-60 leading-relaxed whitespace-pre-wrap">
          {truncated}
        </p>

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

const PublicationsCard: React.FC<Props> = ({ posts, loading }) => {
  return (
    <div className="col-span-1 lg:col-span-2">
      <div
        className={`card compact bg-base-100 ${
          loading || posts.length ? 'shadow bg-opacity-40' : 'shadow-lg'
        }`}
      >
        <div className="card-body">
          <div className="mx-3 mb-2">
            <h5 className="card-title">
              <span className="text-base-content opacity-70">Publications</span>
            </h5>
          </div>
          <div className="grid grid-cols-1 gap-4">
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
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.full_urn} post={post} />)
            ) : (
              <div className="text-center mb-6">
                <AiOutlineContainer className="mx-auto h-12 w-12 opacity-30" />
                <p className="mt-1 text-sm opacity-50 text-base-content">
                  No publications yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationsCard;
