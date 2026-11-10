import { Fragment } from 'react';
import type { LinkedInEducation } from '../../types';
import { skeleton } from '../../utils';

const EducationCard = ({
  loading,
  educations,
}: {
  loading: boolean;
  educations: LinkedInEducation[];
}) => {
  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="mx-3">
          <h2 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Образование</span>
            )}
          </h2>
        </div>
        <ul className="mx-3 mt-2 space-y-2 text-sm text-base-content text-opacity-60">
          {loading ? (
            Array.from({ length: 1 }).map((_, index) => (
              <li key={index}>
                {skeleton({ widthCls: 'w-full', heightCls: 'h-4' })}
              </li>
            ))
          ) : (
            <Fragment>
              {educations.map((item, index) => (
                <li key={index} className="space-y-1">
                  {item.duration ? <div>{item.duration}</div> : null}
                  {item.degree ? (
                    <div className="text-base font-semibold text-base-content text-opacity-100">
                      {item.degree}
                    </div>
                  ) : null}
                  {item.school ? (
                    <div className="text-sm text-base-content text-opacity-80">
                      {item.school}
                    </div>
                  ) : null}
                </li>
              ))}
            </Fragment>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EducationCard;
