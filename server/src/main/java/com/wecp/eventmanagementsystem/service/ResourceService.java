package com.wecp.eventmanagementsystem.service;

import com.wecp.eventmanagementsystem.entity.Allocation;
import com.wecp.eventmanagementsystem.entity.Resource;
import com.wecp.eventmanagementsystem.repository.AllocationRepository;
import com.wecp.eventmanagementsystem.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    // add resouce to database
    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    // get all resources
    public List<Resource> getAllResources() {
        return (List<Resource>) resourceRepository.findAll();
    }

    // check if resource is available or not
    // if resouce is available then allocate the resource to event and set
    // availability to false
    public void allocateResources(Long eventId, Long resourceId, Allocation allocation) {
        Resource resource = resourceRepository.findById(resourceId).get();
        if (resource != null) {
            resource.setAvailability(false);
            resourceRepository.save(resource);
            allocationRepository.save(allocation);
        }
    }
}
