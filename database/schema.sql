CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operator') NOT NULL DEFAULT 'operator',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
);

CREATE TABLE IF NOT EXISTS devices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  unique_id VARCHAR(80) NOT NULL,
  name VARCHAR(120) NOT NULL,
  model VARCHAR(120) NULL,
  phone VARCHAR(40) NULL,
  status ENUM('online', 'offline', 'unknown') NOT NULL DEFAULT 'unknown',
  last_position_id BIGINT UNSIGNED NULL,
  last_seen_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY devices_unique_id_unique (unique_id),
  KEY devices_status_idx (status)
);

CREATE TABLE IF NOT EXISTS positions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_id BIGINT UNSIGNED NOT NULL,
  protocol VARCHAR(40) NOT NULL,
  server_time DATETIME NOT NULL,
  device_time DATETIME NULL,
  fix_time DATETIME NULL,
  valid BOOLEAN NOT NULL DEFAULT TRUE,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  altitude DECIMAL(10, 2) NULL,
  speed DECIMAL(10, 2) NULL,
  course DECIMAL(10, 2) NULL,
  accuracy DECIMAL(10, 2) NULL,
  raw JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY positions_device_time_idx (device_id, fix_time),
  KEY positions_lat_lon_idx (latitude, longitude),
  CONSTRAINT positions_device_id_fk FOREIGN KEY (device_id) REFERENCES devices (id)
);

CREATE TABLE IF NOT EXISTS events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_id BIGINT UNSIGNED NOT NULL,
  position_id BIGINT UNSIGNED NULL,
  type VARCHAR(80) NOT NULL,
  message VARCHAR(255) NOT NULL,
  attributes JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY events_device_created_idx (device_id, created_at),
  CONSTRAINT events_device_id_fk FOREIGN KEY (device_id) REFERENCES devices (id),
  CONSTRAINT events_position_id_fk FOREIGN KEY (position_id) REFERENCES positions (id)
);

CREATE TABLE IF NOT EXISTS geofences (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  type ENUM('circle', 'polygon') NOT NULL,
  geometry JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS commands (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(80) NOT NULL,
  payload JSON NULL,
  status ENUM('queued', 'sent', 'acknowledged', 'failed') NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY commands_device_status_idx (device_id, status),
  CONSTRAINT commands_device_id_fk FOREIGN KEY (device_id) REFERENCES devices (id)
);

