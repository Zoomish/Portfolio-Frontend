import React, { Fragment } from 'react';
import type { LinkedInExperience } from '../../types';
import { skeleton } from '../../utils';

const ListItem = ({
  time,
  position,
  company,
  companyLink,
  location,
  employmentType,
}: {
  time: React.ReactNode;
  position?: React.ReactNode;
  company?: React.ReactNode;
  companyLink?: string;
  location?: string;
  employmentType?: string;
}) => (
  <li className="mb-5 ml-4">
    <div
      className="absolute w-2 h-2 bg-base-300 rounded-full border border-base-300 mt-1.5"
      style={{ left: '-4.5px' }}
    />
    <div className="my-0.5 text-xs opacity-60">{time}</div>
    <h3 className="font-semibold">{position}</h3>
    <div className="font-normal">
      <a href={companyLink} target="_blank" rel="noreferrer">
        {company}
      </a>
    </div>
    {(location || employmentType) && (
      <div className="text-xs opacity-50 mt-0.5">
        {[employmentType, location].filter(Boolean).join(' · ')}
      </div>
    )}
  </li>
);

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
        position={skeleton({ widthCls: 'w-6/12', heightCls: 'h-4', className: 'my-1.5' })}
        company={skeleton({ widthCls: 'w-6/12', heightCls: 'h-3' })}
      />
    ));

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="mx-3">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Experience</span>
            )}
          </h5>
        </div>
        <div className="text-base-content text-opacity-60">
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
                    location={exp.location}
                    employmentType={exp.employment_type}
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
