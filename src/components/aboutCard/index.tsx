import { skeleton } from '../../utils';

interface Props {
  about: string | null;
  loading: boolean;
}

const AboutCard: React.FC<Props> = ({ about, loading }) => {
  if (!loading && !about) return null;

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="mx-3 mb-2">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-24', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">About Me</span>
            )}
          </h5>
        </div>
        <div className="mx-3 text-sm text-base-content opacity-60 leading-relaxed">
          {loading ? (
            <div className="space-y-2">
              {skeleton({ widthCls: 'w-full', heightCls: 'h-4' })}
              {skeleton({ widthCls: 'w-full', heightCls: 'h-4' })}
              {skeleton({ widthCls: 'w-3/4', heightCls: 'h-4' })}
            </div>
          ) : (
            <p>{about}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutCard;
