import { skeleton } from '../../utils';

const SkillCard = ({
  loading,
  skills,
}: {
  loading: boolean;
  skills: string[];
}) => {
  if (!loading && skills.length === 0) return null;

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="mx-3 mb-2">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-24', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">Навыки</span>
            )}
          </h5>
        </div>
        <div className="mx-3 flex flex-wrap gap-2">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  {skeleton({ widthCls: 'w-16', heightCls: 'h-4' })}
                </div>
              ))
            : skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 badge-primary bg-opacity-90 rounded-full"
                >
                  {skill}
                </span>
              ))}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
