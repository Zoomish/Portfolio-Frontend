import { Fragment, useState } from 'react';
import type { LinkedInExperience } from '../../types';
import { skeleton } from '../../utils';

const paragraphsOf = (description: string) =>
  description
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

const ListItem = ({
  time,
  position,
  company,
  companyLink,
  companyLogo,
  location,
  locationType,
  employmentType,
  description,
  skills,
}: {
  time: React.ReactNode;
  position?: React.ReactNode;
  company?: React.ReactNode;
  companyLink?: string;
  companyLogo?: string;
  location?: string;
  locationType?: string;
  employmentType?: string;
  description?: string;
  skills?: string[];
}) => {
  const [open, setOpen] = useState(false);
  const paragraphs = paragraphsOf(description ?? '');
  const firstParagraph = paragraphs[0] ?? '';
  const canToggle = paragraphs.length > 1 || firstParagraph.length > 220;
  const visible = open ? paragraphs : paragraphs.slice(0, 1);
  const chips = (skills ?? []).map((skill) => skill.trim()).filter(Boolean);
  const place = [location, locationType].filter(Boolean).join(' · ');
  const companyName = companyLink ? (
    <a href={companyLink} target="_blank" rel="noreferrer">
      {company}
    </a>
  ) : (
    <span>{company}</span>
  );

  return (
    <li className="mb-5 ml-4">
      <div
        className="absolute w-2 h-2 bg-base-300 rounded-full border border-base-300 mt-1.5"
        style={{ left: '-4.5px' }}
      />
      <div className="flex gap-3">
        {companyLogo ? (
          <img
            src={companyLogo}
            alt=""
            className="w-12 h-12 rounded-md object-contain shrink-0"
          />
        ) : null}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-base-content">{position}</h3>
          {(company || employmentType) && (
            <div className="text-sm text-base-content text-opacity-80">
              {companyName}
              {employmentType ? <span> · {employmentType}</span> : null}
            </div>
          )}
          <div className="text-sm text-base-content text-opacity-60">{time}</div>
          {place && (
            <div className="text-sm text-base-content text-opacity-60">{place}</div>
          )}
        </div>
      </div>
      {visible.length > 0 && (
        <div className="mt-2 space-y-2 text-base leading-relaxed whitespace-pre-line text-base-content text-opacity-80">
          {visible.map((paragraph, index) => (
            <p
              key={index}
              className={!open && index === 0 ? 'line-clamp-4' : ''}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {canToggle && (
        <button
          type="button"
          className="mt-1 text-sm font-medium text-base-content text-opacity-70 hover:text-opacity-100"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Скрыть' : 'Ещё'}
        </button>
      )}
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {chips.map((skill) => (
            <span
              key={skill}
              className="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 badge-primary bg-opacity-90 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </li>
  );
};

const ExperienceCard = ({
  experiences,
  loading,
}: {
  experiences: LinkedInExperience[];
  loading: boolean;
}) => {
  const renderSkeleton = () =>
    Array.from({ length: 2 }).map((_, i) => (
      <ListItem
        key={i}
        time={skeleton({ widthCls: 'w-5/12', heightCls: 'h-4' })}
        position={skeleton({
          widthCls: 'w-6/12',
          heightCls: 'h-4',
          className: 'my-1.5',
        })}
        company={skeleton({ widthCls: 'w-6/12', heightCls: 'h-3' })}
      />
    ));

  return (
    <div className="card shadow-lg compact bg-base-100 h-fit">
      <div className="card-body">
        <div className="mx-3">
          <h2 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Опыт работы</span>
            )}
          </h2>
        </div>
        <div className="text-base-content">
          <ol className="relative border-l border-base-300 border-opacity-30 my-2 mx-4">
            {loading ? (
              renderSkeleton()
            ) : (
              <Fragment>
                {experiences.map((exp, index) => (
                  <ListItem
                    key={index}
                    time={exp.duration}
                    position={exp.title}
                    company={exp.company}
                    companyLink={exp.company_linkedin_url}
                    companyLogo={exp.company_logo_url}
                    location={exp.location}
                    locationType={exp.location_type}
                    employmentType={exp.employment_type}
                    description={exp.description}
                    skills={exp.skills}
                  />
                ))}
              </Fragment>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
