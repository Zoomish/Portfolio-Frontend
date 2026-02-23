// ─── GitHub ───────────────────────────────────────────────────────────────────

export interface FilteredRepo {
  name: string;
  description: string;
  language: string;
  url: string;
  link: string | null;
  stars: number;
  forks: number;
}

export interface GithubReposResponse {
  data: FilteredRepo[];
  cached: boolean;
}

// ─── LinkedIn Posts ───────────────────────────────────────────────────────────

export interface LinkedInPost {
  urn: {
    activity_urn: string;
    share_urn: string | null;
    ugcPost_urn: string | null;
  };
  full_urn: string;
  posted_at: {
    date: string;
    relative: string;
    timestamp: number;
  };
  text: string;
  url: string;
  post_type: string;
  author: {
    first_name: string;
    last_name: string;
    headline: string;
    username: string;
    profile_url: string;
    profile_picture: string;
  };
  stats: {
    total_reactions: number;
    like: number;
    support: number;
    love: number;
    insight: number;
    celebrate: number;
    funny: number;
    comments: number;
    reposts: number;
  };
}

export interface LinkedInPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: LinkedInPost[];
    pagination_token?: string;
  };
}

// ─── LinkedIn Profile ─────────────────────────────────────────────────────────

export interface LinkedInExperience {
  title: string;
  company: string;
  location?: string;
  description: string;
  duration: string;
  start_date: { year: number; month: string };
  end_date: { year: number; month: string };
  is_current: boolean;
  company_linkedin_url?: string;
  company_logo_url?: string;
  employment_type?: string;
  location_type?: string;
}

export interface LinkedInEducation {
  school: string;
  degree: string;
  degree_name: string;
  field_of_study: string;
  duration: string;
  school_linkedin_url: string;
  activities: string;
  start_date: { year: number; month: string };
  end_date: { year: number; month: string };
}

export interface LinkedInBasicInfo {
  fullname: string;
  first_name: string;
  last_name: string;
  headline: string;
  public_identifier: string;
  profile_url: string;
  profile_picture_url: string;
  about: string;
  location: {
    country: string;
    city: string;
    full: string;
    country_code: string;
  };
  open_to_work: boolean;
  follower_count: number;
  connection_count: number;
  top_skills: string[];
  email: string | null;
}

export interface LinkedInProfileResponse {
  success: boolean;
  message: string;
  data: {
    basic_info: LinkedInBasicInfo;
    experience: LinkedInExperience[];
    education: LinkedInEducation[];
    languages: { language: string; proficiency: string }[];
  };
}

// ─── LinkedIn Contact ─────────────────────────────────────────────────────────

export interface LinkedInContactResponse {
  success: boolean;
  message: string;
  data: {
    basic_info: {
      urn: string;
      first_name: string;
      last_name: string;
      full_name: string;
      headline: string;
      public_identifier: string;
      profile_url: string;
    };
    email: string | null;
    phone_numbers: string[];
    websites: { url: string; category: string; label: string | null }[];
    birthday: { month: number; day: number; year: number | null };
    address: string | null;
    twitter_handles: string[];
    wechat: string | null;
    instant_messengers: unknown[];
  };
}

// ─── LinkedIn All (combined endpoint) ────────────────────────────────────────

export interface LinkedInAllResponse {
  posts: {
    data: LinkedInPostsResponse;
    cached: boolean;
  };
  details: {
    data: LinkedInProfileResponse;
    cached: boolean;
  };
  contact: {
    data: LinkedInContactResponse;
    cached: boolean;
  };
}
