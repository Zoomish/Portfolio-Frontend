import { MouseEvent } from 'react';
import { AiOutlineControl } from 'react-icons/ai';
import { LOCAL_STORAGE_KEY_NAME } from '../../constants';
import type { ThemeConfig } from '../../config/app.config';
import { skeleton } from '../../utils';

const ThemeChanger = ({
  theme,
  setTheme,
  loading,
  themeConfig,
}: {
  theme: string;
  setTheme: (theme: string) => void;
  loading: boolean;
  themeConfig: ThemeConfig;
}) => {
  const changeTheme = (
    e: MouseEvent<HTMLAnchorElement>,
    selectedTheme: string,
  ) => {
    e.preventDefault();
    document.querySelector('html')?.setAttribute('data-theme', selectedTheme);
    localStorage.setItem(LOCAL_STORAGE_KEY_NAME, selectedTheme);
    setTheme(selectedTheme);
  };

  return (
    <div className="card overflow-visible shadow-lg compact bg-base-100">
      <div className="flex-row items-center space-x-4 flex pl-6 pr-2 py-4">
        <div className="flex-1">
          <h5 className="card-title">
            {loading ? (
              skeleton({ widthCls: 'w-20', heightCls: 'h-8', className: 'mb-1' })
            ) : (
              <span className="text-base-content opacity-70">Theme</span>
            )}
          </h5>
          <span className="text-base-content text-opacity-40 capitalize text-sm">
            {loading
              ? skeleton({ widthCls: 'w-16', heightCls: 'h-5' })
              : theme === themeConfig.defaultTheme
                ? 'Default'
                : theme}
          </span>
        </div>
        <div className="flex-0">
          {loading ? (
            skeleton({ widthCls: 'w-14 md:w-28', heightCls: 'h-10', className: 'mr-6' })
          ) : (
            <div title="Change Theme" className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="btn btn-ghost m-1 normal-case opacity-50 text-base-content"
              >
                <AiOutlineControl className="inline-block w-5 h-5 stroke-current md:mr-2" />
                <span className="hidden md:inline">Change Theme</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1792 1792"
                  className="inline-block h-4 w-4 fill-current opacity-60 ml-1"
                >
                  <path d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10L407 759q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z" />
                </svg>
              </div>
              <div
                tabIndex={0}
                className="mt-16 overflow-y-auto shadow-2xl dropdown-content bg-base-200 text-base-content rounded-box h-52 w-52"
              >
                <ul className="menu menu-compact p-3">
                  {themeConfig.themes.map((t, i) => (
                    <li key={i}>
                      <a
                        onClick={(e) => changeTheme(e, t)}
                        className={theme === t ? 'active' : ''}
                      >
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeChanger;
