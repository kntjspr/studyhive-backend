import { EventModel } from "../models/event.model";
import { CreateEventRequest, UpdateEventRequest } from "../types/request.types";
import { Event } from "../types/model.types";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../utils/logger";

/**
 * Event service
 * Handles event-related business logic
 */
export class EventService {
  /**
   * Create a new event
   * @param userId - User ID
   * @param eventData - Event creation data
   * @returns Created event
   */
  public static async createEvent(userId: string, eventData: CreateEventRequest): Promise<Event> {
    try {
      return await EventModel.create(userId, eventData);
    } catch (error) {
      logger.error("Create event error", { error, userId });
      throw error;
    }
  }

  /**
   * Get event by ID
   * @param eventId - Event ID
   * @param userId - User ID
   * @returns Event data
   */
  public static async getEventById(eventId: string, userId: string): Promise<Event> {
    try {
      return await EventModel.getById(eventId, userId);
    } catch (error) {
      logger.error("Get event error", { error, eventId, userId });
      throw error;
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
  public static async getEvents(
    userId: string,
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 10
  ): Promise<{
    events: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      return await EventModel.getAll(userId, startDate, endDate, page, limit);
    } catch (error) {
      logger.error("Get events error", { error, userId });
      throw error;
    }
  }

  /**
   * Update an event
   * @param eventId - Event ID
   * @param userId - User ID
   * @param eventData - Event update data
   * @returns Updated event
   */
  public static async updateEvent(
    eventId: string,
    userId: string,
    eventData: UpdateEventRequest
  ): Promise<Event> {
    try {
      return await EventModel.update(eventId, userId, eventData);
    } catch (error) {
      logger.error("Update event error", { error, eventId, userId });
      throw error;
    }
  }

  /**
   * Delete an event
   * @param eventId - Event ID
   * @param userId - User ID
   * @returns Success status
   */
  public static async deleteEvent(eventId: string, userId: string): Promise<boolean> {
    try {
      return await EventModel.delete(eventId, userId);
    } catch (error) {
      logger.error("Delete event error", { error, eventId, userId });
      throw error;
    }
  }
}
