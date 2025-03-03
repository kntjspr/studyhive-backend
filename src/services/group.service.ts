import { supabase } from "../config/supabase";
import { AppError } from "../middleware/errorHandler";
import { StatusCodes } from "http-status-codes";
import { StudyGroup, GroupMember } from "../types/models";

interface CreateGroupData {
  name: string;
  description: string;
  subjectId: string;
  maxMembers: number;
  meetingSchedule?: Record<string, any>;
}

export class GroupService {
  async createGroup(userId: string, data: CreateGroupData): Promise<StudyGroup> {
    const { name, description, subjectId, maxMembers, meetingSchedule } = data;

    // Start a transaction
    const { data: group, error: groupError } = await supabase
      .from("study_groups")
      .insert({
        name,
        description,
        subject_id: subjectId,
        max_members: maxMembers,
        meeting_schedule: meetingSchedule,
        created_by: userId,
      })
      .select()
      .single();

    if (groupError) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create study group",
        groupError.message
      );
    }

    // Add creator as first member
    const { error: memberError } = await supabase
      .from("group_members")
      .insert({
        group_id: group.id,
        user_id: userId,
        role: "admin",
      });

    if (memberError) {
      // Cleanup group if member creation fails
      await supabase.from("study_groups").delete().eq("id", group.id);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to add group member",
        memberError.message
      );
    }

    return group as StudyGroup;
  }

  async getGroup(id: string): Promise<StudyGroup> {
    const { data: group, error: groupError } = await supabase
      .from("study_groups")
      .select(`
        *,
        subject:subjects(*),
        members:group_members(
          user:profiles(*)
        )
      `)
      .eq("id", id)
      .single();

    if (groupError) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to fetch study group",
        groupError.message
      );
    }

    if (!group) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Study group not found"
      );
    }

    return group as StudyGroup;
  }

  async joinGroup(groupId: string, userId: string): Promise<GroupMember> {
    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from("group_members")
      .select()
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    if (existingMember) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "User is already a member of this group"
      );
    }

    // Check group capacity
    const { data: group } = await supabase
      .from("study_groups")
      .select("max_members, members:group_members(count)")
      .eq("id", groupId)
      .single();

    if (!group) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Study group not found"
      );
    }

    if (group.members[0].count >= group.max_members) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Study group is at maximum capacity"
      );
    }

    // Add member
    const { data: member, error: memberError } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: userId,
        role: "member",
      })
      .select()
      .single();

    if (memberError) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to join study group",
        memberError.message
      );
    }

    return member as GroupMember;
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to leave study group",
        error.message
      );
    }
  }
} 