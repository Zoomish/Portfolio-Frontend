import { Fragment } from 'react';
import {
  AiFillGithub,
} from 'react-icons/ai';
import {
  FaGlobe,
  FaLinkedin,
  FaTelegram,
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { RiMailFill } from 'react-icons/ri';
import type { LinkedInBasicInfo, LinkedInContactResponse } from '../../types';
import { skeleton } from '../../utils';

type Props = {
  profile: LinkedInBasicInfo | null;
  contact: LinkedInContactResponse['data'] | null;
  loading: boolean;
  githubUsername: string;
  fallbackEmail?: string;
};

const ListItem: React.FC<{
  icon: React.ReactNode;
  title: React.ReactNode;
  value: React.ReactNode;
  link?: string;
  skeleton?: boolean;
}> = ({ icon, title, value, link, skeleton: isSkeleton = false }) => (
  <div className="flex justify-start py-2 px-1 items-center">
    <div className="flex-grow font-medium gap-2 flex items-center my-1">
      {icon} {title}
    </div>
    <div
      className={`${isSkeleton ? 'flex-grow' : ''} text-sm font-normal text-right mr-2 ml-3 ${link ? 'truncate' : ''}`}
      style={{ wordBreak: 'break-word' }}
    >
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="flex justify-start py-2 px-1 items-center"
      >
        {value}
      </a>
    </div>
  </div>
);

const DetailsCard = ({
  profile,
  contact,
  loading,
  githubUsername,
  fallbackEmail,
}: Props) => {
  const renderSkeleton = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <ListItem
        key={i}
        skeleton
        icon={skeleton({ widthCls: 'w-4', heightCls: 'h-4' })}
        title={skeleton({ widthCls: 'w-24', heightCls: 'h-4' })}
        value={skeleton({ widthCls: 'w-full', heightCls: 'h-4' })}
      />
    ));

  // Derive contact values from LinkedIn contact API
  const email =
    contact?.email ||
    fallbackEmail ||
    null;

  const portfolioSite = contact?.websites?.find(
    (w) => w.category === 'PORTFOLIO',
  )?.url;

  const telegramUrl = contact?.websites?.find(
    (w) => w.category === 'OTHER' && w.url.includes('t.me'),
  )?.url;

  const telegramHandle = telegramUrl
    ? telegramUrl.replace('https://t.me/', '@')
    : null;

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="text-base-content text-opacity-60">
          {loading || !profile ? (
            renderSkeleton()
          ) : (
            <Fragment>
              {profile.location?.full && (
                <ListItem
                  icon={<MdLocationOn />}
                  title="Based in:"
                  value={profile.location.full}
                />
              )}
              <ListItem
                icon={<AiFillGithub />}
                title="GitHub:"
                value={githubUsername}
                link={`https://github.com/${githubUsername}`}
              />
              {profile.profile_url && (
                <ListItem
                  icon={<FaLinkedin />}
                  title="LinkedIn:"
                  value={profile.public_identifier}
                  link={profile.profile_url}
                />
              )}
              {telegramHandle && (
                <ListItem
                  icon={<FaTelegram />}
                  title="Telegram:"
                  value={telegramHandle}
                  link={telegramUrl}
                />
              )}
              {portfolioSite && (
                <ListItem
                  icon={<FaGlobe />}
                  title="Website:"
                  value={portfolioSite
                    .replace('https://', '')
                    .replace('http://', '')}
                  link={portfolioSite}
                />
              )}
              {email && (
                <ListItem
                  icon={<RiMailFill />}
                  title="Email:"
                  value={email}
                  link={`mailto:${email}`}
                />
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
