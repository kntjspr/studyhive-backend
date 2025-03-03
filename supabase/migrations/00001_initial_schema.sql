-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('student', 'admin');
create type study_group_status as enum ('active', 'inactive', 'archived');
create type learning_style as enum ('visual', 'auditory', 'reading_writing', 'kinesthetic');
create type notification_type as enum ('group_invite', 'session_reminder', 'resource_shared', 'message');
create type resource_type as enum ('note', 'link', 'file', 'quiz', 'flashcard');

-- Profiles table (extends auth.users)
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text not null,
    role user_role default 'student' not null,
    avatar_url text,
    bio text,
    learning_style learning_style,
    academic_interests text[],
    availability_schedule jsonb,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Subjects/Courses table
create table subjects (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    description text,
    difficulty_level integer check (difficulty_level between 1 and 5),
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Study Groups table
create table study_groups (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    subject_id uuid references subjects(id) on delete cascade,
    creator_id uuid references profiles(id) on delete cascade,
    max_members integer default 10,
    status study_group_status default 'active' not null,
    meeting_schedule jsonb,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Group Members (many-to-many relationship)
create table group_members (
    group_id uuid references study_groups(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    joined_at timestamptz default timezone('utc'::text, now()) not null,
    primary key (group_id, user_id)
);

-- Study Resources
create table study_resources (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    type resource_type not null,
    content jsonb,
    url text,
    group_id uuid references study_groups(id) on delete cascade,
    creator_id uuid references profiles(id) on delete cascade,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Study Sessions
create table study_sessions (
    id uuid default uuid_generate_v4() primary key,
    group_id uuid references study_groups(id) on delete cascade,
    title text not null,
    description text,
    start_time timestamptz not null,
    end_time timestamptz not null,
    meeting_link text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Session Attendance
create table session_attendance (
    session_id uuid references study_sessions(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    status text check (status in ('attending', 'declined', 'maybe')),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    primary key (session_id, user_id)
);

-- Tasks
create table tasks (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    due_date timestamptz,
    status text check (status in ('pending', 'in_progress', 'completed')),
    group_id uuid references study_groups(id) on delete cascade,
    assignee_id uuid references profiles(id) on delete set null,
    creator_id uuid references profiles(id) on delete cascade,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Chat Messages
create table chat_messages (
    id uuid default uuid_generate_v4() primary key,
    group_id uuid references study_groups(id) on delete cascade,
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
create index idx_group_members_user_id on group_members(user_id);
create index idx_group_members_group_id on group_members(group_id);
create index idx_study_resources_group_id on study_resources(group_id);
create index idx_study_sessions_group_id on study_sessions(group_id);
create index idx_tasks_group_id on tasks(group_id);
create index idx_tasks_assignee_id on tasks(assignee_id);
create index idx_chat_messages_group_id on chat_messages(group_id);
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

-- Study Groups
alter table study_groups enable row level security;
create policy "Study groups are viewable by everyone"
    on study_groups for select
    using (true);
create policy "Members can update their groups"
    on study_groups for update
    using (
        exists (
            select 1 from group_members
            where group_id = study_groups.id
            and user_id = auth.uid()
        )
    );

-- Group Members
alter table group_members enable row level security;
create policy "Group members are viewable by group members"
    on group_members for select
    using (
        exists (
            select 1 from group_members gm
            where gm.group_id = group_members.group_id
            and gm.user_id = auth.uid()
        )
    );

-- Study Resources
alter table study_resources enable row level security;
create policy "Resources are viewable by group members"
    on study_resources for select
    using (
        exists (
            select 1 from group_members
            where group_id = study_resources.group_id
            and user_id = auth.uid()
        )
    );
create policy "Group members can create resources"
    on study_resources for insert
    with check (
        exists (
            select 1 from group_members
            where group_id = study_resources.group_id
            and user_id = auth.uid()
        )
    );

-- Study Sessions
alter table study_sessions enable row level security;
create policy "Sessions are viewable by group members"
    on study_sessions for select
    using (
        exists (
            select 1 from group_members
            where group_id = study_sessions.group_id
            and user_id = auth.uid()
        )
    );

-- Tasks
alter table tasks enable row level security;
create policy "Tasks are viewable by group members"
    on tasks for select
    using (
        exists (
            select 1 from group_members
            where group_id = tasks.group_id
            and user_id = auth.uid()
        )
    );

-- Chat Messages
alter table chat_messages enable row level security;
create policy "Messages are viewable by group members"
    on chat_messages for select
    using (
        exists (
            select 1 from group_members
            where group_id = chat_messages.group_id
            and user_id = auth.uid()
        )
    );
create policy "Group members can send messages"
    on chat_messages for insert
    with check (
        exists (
            select 1 from group_members
            where group_id = chat_messages.group_id
            and user_id = auth.uid()
        )
    );

-- Notifications
alter table notifications enable row level security;
create policy "Users can view their own notifications"
    on notifications for select
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

create trigger update_study_groups_updated_at
    before update on study_groups
    for each row
    execute function update_updated_at_column();

create trigger update_study_resources_updated_at
    before update on study_resources
    for each row
    execute function update_updated_at_column();

create trigger update_study_sessions_updated_at
    before update on study_sessions
    for each row
    execute function update_updated_at_column();

create trigger update_tasks_updated_at
    before update on tasks
    for each row
    execute function update_updated_at_column(); 