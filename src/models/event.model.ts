import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase";
import { Event } from "../types/model.types";
import { CreateEventRequest, UpdateEventRequest } from "../types/request.types";
import { BadRequestError, NotFoundError } from "../utils/errors";

/**
 * Event model
 * Handles database operations for events
 */
export class EventModel {
  /**
   * Create a new event
   * @param userId - User ID
   * @param eventData - Event creation data
   * @returns Created event
   */
  public static async create(userId: string, eventData: CreateEventRequest): Promise<Event> {
    try {
      // Generate UUID
      const eventId = uuidv4();

      // Create event
      const { data, error } = await supabase.from("events").insert({
        id: eventId,
        user_id: userId,
        title: eventData.title,
        description: eventData.description,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        location: eventData.location,
        color: eventData.color,
        is_all_day: eventData.is_all_day || false,
        reminder: eventData.reminder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select("*").single();

      if (error) {
        throw new BadRequestError(error.message);
      }

      return data as Event;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError("Failed to create event");
    }
  }

  /**
   * Get event by ID
   * @param eventId - Event ID
   * @param userId - User ID
   * @returns Event data
   */
  public static async getById(eventId: string, userId: string): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        throw new NotFoundError("Event not found");
      }

      return data as Event;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to get event");
    }
  }

  /**
   * Get all events for a user with date range filtering
   * @param userId - User ID
   * @param startDate - Start date for filtering (optional)
   * @param endDate - End date for filtering (optional)
   * @param page - Page number for pagination
   * @param limit - Number of events per page
   * @returns Array of events and pagination info
   */
  public static async getAll(
    userId: string,
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 10
  ): Promise<{ events: Event[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      // Calculate range for pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Start query
      let query = supabase
        .from("events")
        .select("*", { count: "exact" })
        .eq("user_id", userId);

      // Apply date range filters if provided
      if (startDate) {
        query = query.gte("start_time", startDate);
      }
      
      if (endDate) {
        query = query.lte("end_time", endDate);
      }

      // Apply sorting by start time
      query = query.order("start_time", { ascending: true });

      // Apply pagination
      query = query.range(from, to);

      // Execute query
      const { data, error, count } = await query;

      if (error) {
        throw new BadRequestError(error.message);
      }

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        events: data as Event[],
        total: totalCount,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError("Failed to get events");
    }
  }

  /**
   * Update an event
   * @param eventId - Event ID
   * @param userId - User ID
   * @param eventData - Event update data
   * @returns Updated event
   */
  public static async update(
    eventId: string,
    userId: string,
    eventData: UpdateEventRequest
  ): Promise<Event> {
    try {
      // Check if event exists
      await this.getById(eventId, userId);

      // Update event
      const { data, error } = await supabase
        .from("events")
        .update({
          ...eventData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventId)
        .eq("user_id", userId)
        .select("*")
        .single();

      if (error) {
        throw new BadRequestError(error.message);
      }

      return data as Event;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to update event");
    }
  }

  /**
   * Delete an event
   * @param eventId - Event ID
   * @param userId - User ID
   * @returns Success status
   */
  public static async delete(eventId: string, userId: string): Promise<boolean> {
    try {
      // Check if event exists
      await this.getById(eventId, userId);

      // Delete event
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId)
        .eq("user_id", userId);

      if (error) {
        throw new BadRequestError(error.message);
      }

      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError("Failed to delete event");
    }
  }
} 