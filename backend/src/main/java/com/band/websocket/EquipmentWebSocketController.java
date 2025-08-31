package com.band.websocket;

import com.band.domain.Equipment;
import com.band.domain.EquipmentAssignment;
import com.band.domain.EquipmentMaintenance;
import com.band.service.EquipmentService;
import com.band.service.EquipmentAssignmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class EquipmentWebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final EquipmentService equipmentService;
    private final EquipmentAssignmentService assignmentService;
    
    @MessageMapping("/equipment/subscribe")
    @SendTo("/topic/equipment/updates")
    public EquipmentUpdateMessage subscribeToEquipmentUpdates(@Payload Map<String, Object> payload,
                                                            SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser().getName();
        log.info("User {} subscribed to equipment updates", username);
        
        return new EquipmentUpdateMessage(
            "SUBSCRIPTION_CONFIRMED",
            null,
            "Successfully subscribed to equipment updates",
            Instant.now()
        );
    }
    
    @MessageMapping("/equipment/{equipmentId}/status")
    @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
    public void updateEquipmentStatus(@Payload EquipmentStatusUpdate update,
                                    SimpMessageHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            log.info("User {} updating equipment {} status to {}", 
                username, update.getEquipmentId(), update.getNewStatus());
            
            Equipment equipment = equipmentService.updateEquipmentStatus(
                update.getEquipmentId(), update.getNewStatus());
            
            // Broadcast the update to all subscribers
            EquipmentUpdateMessage message = new EquipmentUpdateMessage(
                "STATUS_UPDATED",
                equipment,
                String.format("Equipment %s status updated to %s by %s", 
                    equipment.getQrCode(), equipment.getStatus(), username),
                Instant.now()
            );
            
            messagingTemplate.convertAndSend("/topic/equipment/updates", message);
            
            // Send targeted message to equipment manager queue
            messagingTemplate.convertAndSend("/topic/equipment-manager/updates", message);
            
            // If equipment is assigned, notify the student
            if (equipment.getAssignedTo() != null) {
                messagingTemplate.convertAndSendToUser(
                    equipment.getAssignedTo().getEmail(),
                    "/queue/equipment/updates",
                    message
                );
            }
            
        } catch (Exception e) {
            log.error("Error updating equipment status via WebSocket", e);
            sendErrorMessage(headerAccessor.getUser().getName(), "Failed to update equipment status: " + e.getMessage());
        }
    }
    
    @MessageMapping("/assignment/checkout")
    @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
    public void equipmentCheckout(@Payload CheckoutMessage checkout,
                                SimpMessageHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            log.info("User {} checking out equipment {}", username, checkout.getQrCode());
            
            EquipmentAssignment assignment = assignmentService.checkoutEquipment(
                checkout.getQrCode(),
                checkout.getStudentId(),
                checkout.getEventId(),
                checkout.getExpectedReturnDate(),
                checkout.getPurpose()
            );
            
            // Broadcast checkout notification
            AssignmentUpdateMessage message = new AssignmentUpdateMessage(
                "EQUIPMENT_CHECKED_OUT",
                assignment,
                String.format("Equipment %s checked out to %s", 
                    assignment.getEquipment().getQrCode(), 
                    assignment.getStudent().getEmail()),
                Instant.now()
            );
            
            // Send to general equipment updates topic
            messagingTemplate.convertAndSend("/topic/equipment/updates", message);
            
            // Send to equipment manager dashboard
            messagingTemplate.convertAndSend("/topic/equipment-manager/assignments", message);
            
            // Send to band director dashboard
            messagingTemplate.convertAndSend("/topic/director/assignments", message);
            
            // Notify the specific student
            messagingTemplate.convertAndSendToUser(
                assignment.getStudent().getEmail(),
                "/queue/assignments/updates",
                message
            );
            
        } catch (Exception e) {
            log.error("Error processing equipment checkout via WebSocket", e);
            sendErrorMessage(headerAccessor.getUser().getName(), "Checkout failed: " + e.getMessage());
        }
    }
    
    @MessageMapping("/assignment/return")
    @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
    public void equipmentReturn(@Payload ReturnMessage returnMsg,
                              SimpMessageHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            log.info("User {} returning equipment for assignment {}", username, returnMsg.getAssignmentId());
            
            EquipmentAssignment assignment = assignmentService.returnEquipment(
                returnMsg.getAssignmentId(),
                returnMsg.getReturnCondition(),
                returnMsg.getDamageNotes(),
                returnMsg.getReturnedById()
            );
            
            AssignmentUpdateMessage message = new AssignmentUpdateMessage(
                "EQUIPMENT_RETURNED",
                assignment,
                String.format("Equipment %s returned by %s", 
                    assignment.getEquipment().getQrCode(),
                    assignment.getStudent().getEmail()),
                Instant.now()
            );
            
            // Broadcast return notification
            messagingTemplate.convertAndSend("/topic/equipment/updates", message);
            messagingTemplate.convertAndSend("/topic/equipment-manager/assignments", message);
            messagingTemplate.convertAndSend("/topic/director/assignments", message);
            
            // If approval is needed due to damage/condition change, notify supervisors
            if (assignment.getStatus() == EquipmentAssignment.AssignmentStatus.PENDING_RETURN) {
                messagingTemplate.convertAndSend("/topic/supervisor/approvals", 
                    new ApprovalNeededMessage(
                        assignment,
                        "Equipment return requires approval due to condition change or damage",
                        Instant.now()
                    )
                );
            }
            
            // Notify the student
            messagingTemplate.convertAndSendToUser(
                assignment.getStudent().getEmail(),
                "/queue/assignments/updates",
                message
            );
            
        } catch (Exception e) {
            log.error("Error processing equipment return via WebSocket", e);
            sendErrorMessage(headerAccessor.getUser().getName(), "Return failed: " + e.getMessage());
        }
    }
    
    @MessageMapping("/maintenance/schedule")
    @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
    public void scheduleMaintenance(@Payload MaintenanceScheduleMessage maintenance,
                                  SimpMessageHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            log.info("User {} scheduling maintenance for equipment {}", 
                username, maintenance.getEquipmentId());
            
            // Create maintenance record (would need to implement MaintenanceService)
            MaintenanceUpdateMessage message = new MaintenanceUpdateMessage(
                "MAINTENANCE_SCHEDULED",
                maintenance.getEquipmentId(),
                maintenance.getMaintenanceType(),
                maintenance.getScheduledDate(),
                String.format("Maintenance scheduled for equipment %s by %s", 
                    maintenance.getEquipmentId(), username),
                Instant.now()
            );
            
            // Notify equipment managers
            messagingTemplate.convertAndSend("/topic/equipment-manager/maintenance", message);
            
            // Notify band director
            messagingTemplate.convertAndSend("/topic/director/maintenance", message);
            
        } catch (Exception e) {
            log.error("Error scheduling maintenance via WebSocket", e);
            sendErrorMessage(headerAccessor.getUser().getName(), "Failed to schedule maintenance: " + e.getMessage());
        }
    }
    
    @MessageMapping("/dashboard/refresh")
    public void refreshDashboard(@Payload Map<String, Object> payload,
                               SimpMessageHeaderAccessor headerAccessor) {
        String username = headerAccessor.getUser().getName();
        String role = (String) payload.get("role");
        
        log.info("User {} requesting dashboard refresh for role {}", username, role);
        
        // Send refresh command to specific role dashboard
        DashboardRefreshMessage message = new DashboardRefreshMessage(
            "DASHBOARD_REFRESH",
            role,
            "Dashboard data refresh requested",
            Instant.now()
        );
        
        switch (role.toUpperCase()) {
            case "STUDENT":
                messagingTemplate.convertAndSendToUser(username, "/queue/dashboard/refresh", message);
                break;
            case "BAND_DIRECTOR":
                messagingTemplate.convertAndSend("/topic/director/dashboard/refresh", message);
                break;
            case "EQUIPMENT_MANAGER":
                messagingTemplate.convertAndSend("/topic/equipment-manager/dashboard/refresh", message);
                break;
            case "SUPERVISOR":
                messagingTemplate.convertAndSend("/topic/supervisor/dashboard/refresh", message);
                break;
        }
    }
    
    private void sendErrorMessage(String username, String error) {
        ErrorMessage errorMsg = new ErrorMessage(error, Instant.now());
        messagingTemplate.convertAndSendToUser(username, "/queue/errors", errorMsg);
    }
    
    // Message DTOs
    public static class EquipmentUpdateMessage {
        private String type;
        private Equipment equipment;
        private String message;
        private Instant timestamp;
        
        public EquipmentUpdateMessage(String type, Equipment equipment, String message, Instant timestamp) {
            this.type = type;
            this.equipment = equipment;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public Equipment getEquipment() { return equipment; }
        public void setEquipment(Equipment equipment) { this.equipment = equipment; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    }
    
    public static class AssignmentUpdateMessage {
        private String type;
        private EquipmentAssignment assignment;
        private String message;
        private Instant timestamp;
        
        public AssignmentUpdateMessage(String type, EquipmentAssignment assignment, String message, Instant timestamp) {
            this.type = type;
            this.assignment = assignment;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public EquipmentAssignment getAssignment() { return assignment; }
        public void setAssignment(EquipmentAssignment assignment) { this.assignment = assignment; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    }
    
    public static class ApprovalNeededMessage {
        private EquipmentAssignment assignment;
        private String message;
        private Instant timestamp;
        
        public ApprovalNeededMessage(EquipmentAssignment assignment, String message, Instant timestamp) {
            this.assignment = assignment;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public EquipmentAssignment getAssignment() { return assignment; }
        public void setAssignment(EquipmentAssignment assignment) { this.assignment = assignment; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    }
    
    public static class MaintenanceUpdateMessage {
        private String type;
        private UUID equipmentId;
        private String maintenanceType;
        private Instant scheduledDate;
        private String message;
        private Instant timestamp;
        
        public MaintenanceUpdateMessage(String type, UUID equipmentId, String maintenanceType, 
                                       Instant scheduledDate, String message, Instant timestamp) {
            this.type = type;
            this.equipmentId = equipmentId;
            this.maintenanceType = maintenanceType;
            this.scheduledDate = scheduledDate;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public UUID getEquipmentId() { return equipmentId; }
        public void setEquipmentId(UUID equipmentId) { this.equipmentId = equipmentId; }
        
        public String getMaintenanceType() { return maintenanceType; }
        public void setMaintenanceType(String maintenanceType) { this.maintenanceType = maintenanceType; }
        
        public Instant getScheduledDate() { return scheduledDate; }
        public void setScheduledDate(Instant scheduledDate) { this.scheduledDate = scheduledDate; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    }
    
    public static class DashboardRefreshMessage {
        private String type;
        private String role;
        private String message;
        private Instant timestamp;
        
        public DashboardRefreshMessage(String type, String role, String message, Instant timestamp) {
            this.type = type;
            this.role = role;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    }
    
    public static class ErrorMessage {
        private String error;
        private Instant timestamp;
        
        public ErrorMessage(String error, Instant timestamp) {
            this.error = error;
            this.timestamp = timestamp;
        }
        
        // Getters and setters
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    }
    
    // Input DTOs
    public static class EquipmentStatusUpdate {
        private UUID equipmentId;
        private Equipment.EquipmentStatus newStatus;
        
        // Getters and setters
        public UUID getEquipmentId() { return equipmentId; }
        public void setEquipmentId(UUID equipmentId) { this.equipmentId = equipmentId; }
        
        public Equipment.EquipmentStatus getNewStatus() { return newStatus; }
        public void setNewStatus(Equipment.EquipmentStatus newStatus) { this.newStatus = newStatus; }
    }
    
    public static class CheckoutMessage {
        private String qrCode;
        private UUID studentId;
        private UUID eventId;
        private Instant expectedReturnDate;
        private String purpose;
        
        // Getters and setters
        public String getQrCode() { return qrCode; }
        public void setQrCode(String qrCode) { this.qrCode = qrCode; }
        
        public UUID getStudentId() { return studentId; }
        public void setStudentId(UUID studentId) { this.studentId = studentId; }
        
        public UUID getEventId() { return eventId; }
        public void setEventId(UUID eventId) { this.eventId = eventId; }
        
        public Instant getExpectedReturnDate() { return expectedReturnDate; }
        public void setExpectedReturnDate(Instant expectedReturnDate) { this.expectedReturnDate = expectedReturnDate; }
        
        public String getPurpose() { return purpose; }
        public void setPurpose(String purpose) { this.purpose = purpose; }
    }
    
    public static class ReturnMessage {
        private UUID assignmentId;
        private Equipment.EquipmentCondition returnCondition;
        private String damageNotes;
        private UUID returnedById;
        
        // Getters and setters
        public UUID getAssignmentId() { return assignmentId; }
        public void setAssignmentId(UUID assignmentId) { this.assignmentId = assignmentId; }
        
        public Equipment.EquipmentCondition getReturnCondition() { return returnCondition; }
        public void setReturnCondition(Equipment.EquipmentCondition returnCondition) { this.returnCondition = returnCondition; }
        
        public String getDamageNotes() { return damageNotes; }
        public void setDamageNotes(String damageNotes) { this.damageNotes = damageNotes; }
        
        public UUID getReturnedById() { return returnedById; }
        public void setReturnedById(UUID returnedById) { this.returnedById = returnedById; }
    }
    
    public static class MaintenanceScheduleMessage {
        private UUID equipmentId;
        private String maintenanceType;
        private Instant scheduledDate;
        private String notes;
        
        // Getters and setters
        public UUID getEquipmentId() { return equipmentId; }
        public void setEquipmentId(UUID equipmentId) { this.equipmentId = equipmentId; }
        
        public String getMaintenanceType() { return maintenanceType; }
        public void setMaintenanceType(String maintenanceType) { this.maintenanceType = maintenanceType; }
        
        public Instant getScheduledDate() { return scheduledDate; }
        public void setScheduledDate(Instant scheduledDate) { this.scheduledDate = scheduledDate; }
        
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}