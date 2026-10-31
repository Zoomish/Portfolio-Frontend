import { ReactNode } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FaLinkedin, FaTelegram } from 'react-icons/fa';
import { RiMailFill } from 'react-icons/ri';
import { FALLBACK_IMAGE } from '../../constants';
import type { LinkedInBasicInfo, LinkedInContactResponse } from '../../types';
import { skeleton } from '../../utils';
import LazyImage from '../lazyImage';

interface AvatarCardProps {
  profile: LinkedInBasicInfo | null;
  contact: LinkedInContactResponse['data'] | null;
  loading: boolean;
  avatarRing: boolean;
  resumeFileUrl?: string;
  githubUsername: string;
  fallbackEmail?: string;
}

const Row = ({
  icon,
  title,
  value,
  href,
}: {
  icon?: ReactNode;
  title: string;
  value: string;
  href?: string;
}) => (
  <div className="flex items-start justify-between gap-4 py-1.5">
    <div className="flex items-center gap-2 font-medium shrink-0">
      {icon}
      <span>{title}</span>
    </div>
    <div className="text-sm text-right min-w-0">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="opacity-80 hover:opacity-100 break-words"
        >
          {value}
        </a>
      ) : (
        <span className="break-words">{value}</span>
      )}
    </div>
  </div>
);

const AvatarCard: React.FC<AvatarCardProps> = ({
  profile,
  contact,
  loading,
  avatarRing,
  resumeFileUrl,
  githubUsername,
  fallbackEmail,
}): JSX.Element => {
  const email = contact?.email || fallbackEmail || null;
  const telegramUrl = contact?.websites?.find(
    (site) => site.url.includes('t.me'),
  )?.url;

  const telegramHandle = telegramUrl
    ? telegramUrl.replace(/^https?:\/\/t\.me\//, '@')
    : null;

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="flex items-center gap-4">
          {loading || !profile ? (
            <div className="avatar opacity-90 shrink-0">
              <div className="rounded-full w-32 h-32">
                {skeleton({ widthCls: 'w-full', heightCls: 'h-full', shape: '' })}
              </div>
            </div>
          ) : (
            <div className="avatar opacity-90 shrink-0">
              <div
                className={`rounded-full w-32 h-32 ${
                  avatarRing
                    ? 'ring ring-primary ring-offset-base-100 ring-offset-2'
                    : ''
                }`}
              >
                <LazyImage
                  src={profile.profile_picture_url || FALLBACK_IMAGE}
                  alt={profile.fullname}
                  placeholder={skeleton({
                    widthCls: 'w-full',
                    heightCls: 'h-full',
                    shape: '',
                  })}
                />
              </div>
              {profile.open_to_work && (
                <span className="badge badge-success badge-sm font-bold text-white absolute -top-1 -right-16 z-10 hidden sm:inline-flex">
                  #Open to Work
                </span>
              )}
            </div>
          )}
          <div className="min-w-0 text-left">
            {!loading && profile?.open_to_work && (
              <span className="badge badge-success badge-sm font-bold text-white mb-1 sm:hidden">
                #Open to Work
              </span>
            )}
            <h5 className="font-bold text-2xl">
              {loading || !profile ? (
                skeleton({ widthCls: 'w-40', heightCls: 'h-8' })
              ) : (
                <span className="text-base-content">{profile.fullname}</span>
              )}
            </h5>
            <div className="mt-2 text-sm text-base-content text-opacity-80">
              {loading || !profile
                ? skeleton({ widthCls: 'w-48', heightCls: 'h-5' })
                : profile.headline}
            </div>
          </div>
        </div>

        {!loading && profile && (
          <div className="mt-4 text-base-content text-opacity-70">
            {telegramHandle && telegramUrl && (
              <Row
                icon={<FaTelegram />}
                title="Telegram:"
                value={telegramHandle}
                href={telegramUrl}
              />
            )}
            {profile.profile_url && (
              <Row
                icon={<FaLinkedin />}
                title="LinkedIn:"
                value={profile.public_identifier}
                href={profile.profile_url}
              />
            )}
            {githubUsername && (
              <Row
                icon={<AiFillGithub />}
                title="GitHub:"
                value={githubUsername}
                href={`https://github.com/${githubUsername}`}
              />
            )}
            {email && (
              <Row
                icon={<RiMailFill />}
                title="Почта:"
                value={email}
                href={`mailto:${email}`}
              />
            )}
          </div>
        )}

        {resumeFileUrl &&
          (loading ? (
            <div className="mt-4">
              {skeleton({ widthCls: 'w-40', heightCls: 'h-8' })}
            </div>
          ) : (
            <a
              href={resumeFileUrl}
              target="_blank"
              className="btn btn-outline btn-sm text-xs mt-4 opacity-50"
              download
              rel="noreferrer"
            >
              Скачать резюме
            </a>
          ))}
      </div>
    </div>
  );
};

export default AvatarCard;
