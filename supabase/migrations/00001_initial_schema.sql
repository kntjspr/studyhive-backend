-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('student', 'tutor', 'admin');
create type study_session_status as enum ('scheduled', 'ongoing', 'completed', 'cancelled');
create type notification_type as enum ('session_reminder', 'session_request', 'session_update', 'message');

-- Profiles table (extends auth.users)
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text not null,
    role user_role default 'student' not null,
    avatar_url text,
    bio text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Subjects table
create table subjects (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    description text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Tutor profiles (extends profiles)
create table tutor_profiles (
    tutor_id uuid references profiles(id) on delete cascade primary key,
    hourly_rate decimal(10,2) not null,
    years_of_experience integer,
    education_background text,
    availability_schedule jsonb,
    average_rating decimal(3,2),
    total_sessions integer default 0,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Tutor subjects (many-to-many relationship)
create table tutor_subjects (
    tutor_id uuid references tutor_profiles(tutor_id) on delete cascade,
    subject_id uuid references subjects(id) on delete cascade,
    expertise_level integer check (expertise_level between 1 and 5),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    primary key (tutor_id, subject_id)
);

-- Study sessions
create table study_sessions (
    id uuid default uuid_generate_v4() primary key,
    student_id uuid references profiles(id) on delete cascade,
    tutor_id uuid references tutor_profiles(tutor_id) on delete cascade,
    subject_id uuid references subjects(id) on delete cascade,
    status study_session_status default 'scheduled' not null,
    start_time timestamptz not null,
    end_time timestamptz not null,
    meeting_link text,
    price decimal(10,2) not null,
    notes text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Session reviews
create table session_reviews (
    id uuid default uuid_generate_v4() primary key,
    session_id uuid references study_sessions(id) on delete cascade unique,
    student_id uuid references profiles(id) on delete cascade,
    rating integer check (rating between 1 and 5) not null,
    comment text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Chat messages
create table chat_messages (
    id uuid default uuid_generate_v4() primary key,
    session_id uuid references study_sessions(id) on delete cascade,
    sender_id uuid references profiles(id) on delete cascade,
    content text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Notifications
create table notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade,
    type notification_type not null,
    title text not null,
    message text not null,
    read boolean default false,
    data jsonb,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index idx_study_sessions_student_id on study_sessions(student_id);
create index idx_study_sessions_tutor_id on study_sessions(tutor_id);
create index idx_study_sessions_status on study_sessions(status);
create index idx_chat_messages_session_id on chat_messages(session_id);
create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_read on notifications(read);

-- Set up Row Level Security (RLS)
-- Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using (true);
create policy "Users can update own profile"
    on profiles for update
    using (auth.uid() = id);

-- Tutor profiles
alter table tutor_profiles enable row level security;
create policy "Public tutor profiles are viewable by everyone"
    on tutor_profiles for select
    using (true);
create policy "Tutors can update own profile"
    on tutor_profiles for update
    using (auth.uid() = tutor_id);

-- Study sessions
alter table study_sessions enable row level security;
create policy "Users can view their own sessions"
    on study_sessions for select
    using (auth.uid() = student_id or auth.uid() = tutor_id);
create policy "Users can create sessions"
    on study_sessions for insert
    with check (auth.uid() = student_id);
create policy "Users can update their own sessions"
    on study_sessions for update
    using (auth.uid() = student_id or auth.uid() = tutor_id);

-- Session reviews
alter table session_reviews enable row level security;
create policy "Public reviews are viewable by everyone"
    on session_reviews for select
    using (true);
create policy "Students can create reviews for their sessions"
    on session_reviews for insert
    with check (auth.uid() = student_id);
create policy "Students can update their own reviews"
    on session_reviews for update
    using (auth.uid() = student_id);

-- Chat messages
alter table chat_messages enable row level security;
create policy "Users can view messages from their sessions"
    on chat_messages for select
    using (
        exists (
            select 1 from study_sessions
            where id = chat_messages.session_id
            and (student_id = auth.uid() or tutor_id = auth.uid())
        )
    );
create policy "Users can send messages in their sessions"
    on chat_messages for insert
    with check (
        exists (
            select 1 from study_sessions
            where id = chat_messages.session_id
            and (student_id = auth.uid() or tutor_id = auth.uid())
        )
    );

-- Notifications
alter table notifications enable row level security;
create policy "Users can view their own notifications"
    on notifications for select
    using (auth.uid() = user_id);
create policy "Users can update their own notifications"
    on notifications for update
    using (auth.uid() = user_id);

-- Triggers for updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at_column();

create trigger update_tutor_profiles_updated_at
    before update on tutor_profiles
    for each row
    execute function update_updated_at_column();

create trigger update_study_sessions_updated_at
    before update on study_sessions
    for each row
    execute function update_updated_at_column();

create trigger update_session_reviews_updated_at
    before update on session_reviews
    for each row
    execute function update_updated_at_column();

-- Function to update tutor ratings
create or replace function update_tutor_rating()
returns trigger as $$
begin
    update tutor_profiles
    set average_rating = (
        select avg(rating)::decimal(3,2)
        from session_reviews sr
        join study_sessions ss on sr.session_id = ss.id
        where ss.tutor_id = new.tutor_id
    )
    where tutor_id = (
        select tutor_id
        from study_sessions
        where id = new.session_id
    );
    return new;
end;
$$ language plpgsql;

create trigger update_tutor_rating_on_review
    after insert or update on session_reviews
    for each row
    execute function update_tutor_rating(); 