package com.wecp.eventmanagementsystem.controller;

import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.service.EventService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class StaffController {

    @Autowired
    private EventService eventService;

    // get the event details by eventId and return the event with status code 200 ok
    @GetMapping("/api/staff/event-details/{eventId}")
    public ResponseEntity<Event> getEventDetails(@PathVariable Long eventId) {
        return new ResponseEntity<>(eventService.getEventDetails(eventId), HttpStatus.OK);
    }

    // update the event setup and return the updated event with status code 200 ok
    @PutMapping("/api/staff/update-setup/{eventId}")
    public ResponseEntity<Event> updateEventSetup(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
        return new ResponseEntity<>(eventService.updateEventSetup(eventId, updatedEvent), HttpStatus.OK);
    }

    // get the event details by eventId and return the event with status code 200 ok
    @GetMapping("/api/staff/all-event-details")
    public ResponseEntity<List<Event>> getAllEventDetails() {
        return new ResponseEntity<List<Event>>(eventService.getAllEvents(), HttpStatus.OK);
    }

}
