package com.wecp.eventmanagementsystem.entity;

import javax.persistence.*;

/*
 * creates allocation entity with many-to-one mapping to event 
 * and one-to-one association with resource
 */
@Entity
public class Allocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long allocationID;

    @ManyToOne
    @JoinColumn(name = "eventID")
    private Event event;

    @OneToOne
    @JoinColumn(name = "resourceID")
    private Resource resource;

    private int quantity;

    public Long getAllocationID() {
        return allocationID;
    }

    public void setAllocationID(Long allocationID) {
        this.allocationID = allocationID;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
