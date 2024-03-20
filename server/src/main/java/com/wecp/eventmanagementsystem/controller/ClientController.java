package com.wecp.eventmanagementsystem.controller;

import com.wecp.eventmanagementsystem.entity.Allocation;
import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.service.EventService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClientController {

    @Autowired
    private EventService eventService;

    // get event details by event id and return with status code 200 OK
    @GetMapping("/api/client/booking-details/{eventId}")
    public ResponseEntity<Event> getBookingDetails(@PathVariable Long eventId) {
        return new ResponseEntity<Event>(eventService.getEventDetails(eventId), HttpStatus.OK);
    }

    // get all allocations by event id and return the list with status code 200 (OK)
    @GetMapping("/api/client/allocation/{eventId}")
    public ResponseEntity<List<Allocation>> getAllAllocationByEventId(@PathVariable Long eventId) {
        return new ResponseEntity<>(eventService.getAllocationsByEventId(eventId), HttpStatus.OK);
    }

    // get all events and return the list with status code 200 (OK)
    @GetMapping("/api/client/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return new ResponseEntity<>(eventService.getAllEvents(), HttpStatus.OK);
    }

}
