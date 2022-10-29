CREATE TABLE IF NOT EXISTS bot_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    evt_code INT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_errors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    error_code INT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TINYTEXT NOT NULL,
    need_to_change TINYINT NOT NULL DEFAULT 0,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `bot_reminders` (`name`, `need_to_change`) VALUES ('dust_bag', '0');
INSERT INTO `bot_reminders` (`name`, `need_to_change`) VALUES ('mop, '0');