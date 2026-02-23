import React, { Fragment } from 'react';
import type { LinkedInEducation } from '../../types';
import { skeleton } from '../../utils';

const ListItem = ({
  time,
  degree,
  institution,
}: {
  time: React.ReactNode;
  degree?: React.ReactNode;
  institution?: React.ReactNode;
}) => (
  <li className="mb-5 ml-4">
    <div
      className="absolute w-2 h-2 bg-base-300 rounded-full border border-base-300 mt-1.5"
      style={{ left: '-4.5px' }}
    />
    <div className="my-0.5 text-xs opacity-60">{time}</div>
    <h3 className="font-semibold">{degree}</h3>
    <div className="mb-4 font-normal">{institution}</div>
  </li>
);

const EducationCard = ({
  loading,
  educations,
}: {
  loading: boolean;
  educations: LinkedInEducation[];
}) => {
  const renderSkeleton = () =>
    Array.from({ length: 2 }).map((_, i) => (
      <ListItem
        key={i}
        time={skeleton({ widthCls: 'w-5/12', heightCls: 'h-4' })}
        degree={skeleton({
          widthCls: 'w-6/12',
          heightCls: 'h-4',
          className: 'my-1.5',
        })}
        institution={skeleton({ widthCls: 'w-6/12', heightCls: 'h-3' })}
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
              <span className="text-base-content opacity-70">Education</span>
            )}
          </h5>
        </div>
        <div className="text-base-content text-opacity-60">
          <ol className="relative border-l border-base-300 border-opacity-30 my-2 mx-4">
            {loading ? (
              renderSkeleton()
            ) : (
              <Fragment>
                {educations.map((item, index) => (
                  <ListItem
                    key={index}
                    time={item.duration}
                    degree={item.degree}
                    institution={item.school}
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

export default EducationCard;
