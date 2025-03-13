import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.service";
import { CreateEventRequest, UpdateEventRequest } from "../types/request.types";
import { EventResponse, EventListResponse } from "../types/response.types";
import { BadRequestError } from "../utils/errors";
import logger from "../utils/logger";

/**
 * Event controller
 * Handles event-related requests
 */
export class EventController {
  /**
   * Create a new event
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async createEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const eventData = req.body as CreateEventRequest;
      const event = await EventService.createEvent(userId, eventData);

      const response: EventResponse = {
        success: true,
        message: "Event created successfully",
        data: event,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get event by ID
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async getEventById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const eventId = req.params.id;
      if (!eventId) {
        throw new BadRequestError("Event ID is required");
      }

      const event = await EventService.getEventById(eventId, userId);

      const response: EventResponse = {
        success: true,
        message: "Event retrieved successfully",
        data: event,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all events for a user with date range filtering
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async getEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      // Extract filter parameters from query
      const startDate = req.query.start_date as string | undefined;
      const endDate = req.query.end_date as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = await EventService.getEvents(userId, startDate, endDate, page, limit);

      const response: EventListResponse = {
        success: true,
        message: "Events retrieved successfully",
        data: {
          events: result.events,
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an event
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async updateEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const eventId = req.params.id;
      if (!eventId) {
        throw new BadRequestError("Event ID is required");
      }

      const eventData = req.body as UpdateEventRequest;
      const event = await EventService.updateEvent(eventId, userId, eventData);

      const response: EventResponse = {
        success: true,
        message: "Event updated successfully",
        data: event,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an event
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public static async deleteEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }

      const eventId = req.params.id;
      if (!eventId) {
        throw new BadRequestError("Event ID is required");
      }

      await EventService.deleteEvent(eventId, userId);

      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
} 