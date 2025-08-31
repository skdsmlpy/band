-- V3: Create band equipment management tables

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    serial_number VARCHAR(255),
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('BRASS', 'WOODWIND', 'PERCUSSION', 'STRING', 'ELECTRONIC', 'ACCESSORY')),
    condition VARCHAR(50) NOT NULL DEFAULT 'GOOD' CHECK (condition IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'REPAIR_NEEDED')),
    location VARCHAR(255),
    description TEXT,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    warranty_expiration DATE,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    maintenance_interval_months INTEGER DEFAULT 6,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'CHECKED_OUT', 'IN_MAINTENANCE', 'RETIRED', 'MISSING')),
    assigned_to_id UUID REFERENCES users(id),
    assignment_date TIMESTAMP,
    expected_return_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    active BOOLEAN NOT NULL DEFAULT true
);

-- Equipment assignments table
CREATE TABLE IF NOT EXISTS equipment_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id),
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    checkout_date TIMESTAMP NOT NULL,
    expected_return_date TIMESTAMP,
    actual_return_date TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING_CHECKOUT', 'CHECKED_OUT', 'PENDING_RETURN', 'RETURNED', 'OVERDUE', 'LOST', 'DAMAGED')),
    checked_out_by UUID REFERENCES users(id),
    returned_to UUID REFERENCES users(id),
    peer_reviewer_id UUID REFERENCES users(id),
    supervisor_approved_by UUID REFERENCES users(id),
    checkout_condition VARCHAR(50) CHECK (checkout_condition IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'REPAIR_NEEDED')),
    return_condition VARCHAR(50) CHECK (return_condition IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'REPAIR_NEEDED')),
    checkout_signature TEXT,
    return_signature TEXT,
    assignment_purpose VARCHAR(100),
    checkout_notes TEXT,
    return_notes TEXT,
    damage_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Equipment maintenance table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    maintenance_type VARCHAR(50) NOT NULL CHECK (maintenance_type IN ('PREVENTIVE', 'REPAIR', 'CLEANING', 'CALIBRATION', 'INSPECTION', 'UPGRADE', 'REPLACEMENT')),
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED')),
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    service_provider VARCHAR(255),
    service_contact VARCHAR(255),
    technician_name VARCHAR(255),
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    parts_cost DECIMAL(10,2),
    labor_cost DECIMAL(10,2),
    work_description TEXT,
    parts_replaced TEXT,
    work_performed TEXT,
    condition_before VARCHAR(50) CHECK (condition_before IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'REPAIR_NEEDED')),
    condition_after VARCHAR(50) CHECK (condition_after IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'REPAIR_NEEDED')),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    warranty_months INTEGER,
    warranty_expiration DATE,
    next_maintenance_date DATE,
    maintenance_interval_months INTEGER,
    notes TEXT,
    internal_notes TEXT,
    attachment_urls TEXT, -- JSON array
    created_by UUID REFERENCES users(id),
    completed_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Digital signatures table
CREATE TABLE IF NOT EXISTS digital_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    signature_data TEXT NOT NULL,
    signature_type VARCHAR(50) NOT NULL DEFAULT 'GENERAL' CHECK (signature_type IN ('GENERAL', 'EQUIPMENT_CHECKOUT', 'EQUIPMENT_RETURN', 'PERFORMANCE_CONSENT', 'MEDICAL_WAIVER', 'PHOTO_RELEASE')),
    signature_name VARCHAR(100),
    signature_format VARCHAR(10) DEFAULT 'SVG',
    signature_width INTEGER,
    signature_height INTEGER,
    stroke_color VARCHAR(7) DEFAULT '#000000',
    background_color VARCHAR(20) DEFAULT 'transparent',
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    signature_hash VARCHAR(64), -- SHA-256
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP,
    verification_method VARCHAR(50),
    legal_name VARCHAR(255),
    intent_statement TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    active BOOLEAN NOT NULL DEFAULT true
);

-- Band events table
CREATE TABLE IF NOT EXISTS band_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('CONCERT', 'COMPETITION', 'PARADE', 'FESTIVAL', 'PRACTICE', 'REHEARSAL', 'MASTERCLASS', 'RECORDING', 'COMMUNITY_EVENT', 'FUNDRAISER')),
    venue VARCHAR(255),
    venue_address TEXT,
    director_id UUID REFERENCES users(id),
    rehearsal_required BOOLEAN DEFAULT false,
    rehearsal_date TIMESTAMP,
    dress_code VARCHAR(255),
    arrival_time TIMESTAMP,
    setup_time TIMESTAMP,
    performance_time TIMESTAMP,
    equipment_requirements TEXT, -- JSON
    transportation_needed BOOLEAN DEFAULT false,
    equipment_transport TEXT,
    required_participants TEXT, -- JSON array
    optional_participants TEXT, -- JSON array
    confirmed_participants TEXT, -- JSON array
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'APPROVED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED')),
    approval_required BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    budget_allocated DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    revenue_expected DECIMAL(10,2),
    ticket_price DECIMAL(8,2),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    special_requirements TEXT,
    accessibility_requirements TEXT,
    equipment_setup_notes TEXT,
    photos_allowed BOOLEAN DEFAULT true,
    recording_allowed BOOLEAN DEFAULT false,
    live_stream BOOLEAN DEFAULT false,
    program_notes TEXT,
    weather_contingency TEXT,
    backup_venue VARCHAR(255),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    active BOOLEAN NOT NULL DEFAULT true
);

-- Add foreign key to equipment_assignments for events
ALTER TABLE equipment_assignments ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES band_events(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_qr_code ON equipment(qr_code);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_assigned_to ON equipment(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_equipment_active ON equipment(active);

CREATE INDEX IF NOT EXISTS idx_equipment_assignments_student ON equipment_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_equipment ON equipment_assignments(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_status ON equipment_assignments(status);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_checkout_date ON equipment_assignments(checkout_date);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_event ON equipment_assignments(event_id);

CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_equipment ON equipment_maintenance(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_scheduled_date ON equipment_maintenance(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_status ON equipment_maintenance(status);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_priority ON equipment_maintenance(priority);

CREATE INDEX IF NOT EXISTS idx_digital_signatures_user ON digital_signatures(user_id);
CREATE INDEX IF NOT EXISTS idx_digital_signatures_type ON digital_signatures(signature_type);
CREATE INDEX IF NOT EXISTS idx_digital_signatures_active ON digital_signatures(active);

CREATE INDEX IF NOT EXISTS idx_band_events_event_date ON band_events(event_date);
CREATE INDEX IF NOT EXISTS idx_band_events_event_type ON band_events(event_type);
CREATE INDEX IF NOT EXISTS idx_band_events_status ON band_events(status);
CREATE INDEX IF NOT EXISTS idx_band_events_director ON band_events(director_id);
CREATE INDEX IF NOT EXISTS idx_band_events_active ON band_events(active);