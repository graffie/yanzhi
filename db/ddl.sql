CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户 ID',
  `gmt_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '修改时间',
  `mobile` varchar(32) DEFAULT NULL COMMENT '手机号',
  `name` varchar(255) NOT NULL NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users.name` (`name`) USING BTREE,
  KEY `users.mobile` (`mobile`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

CREATE TABLE `verify_code` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '验证码 ID',
  `gmt_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '修改时间',
  `mobile` varchar(32) NOT NULL COMMENT '手机号',
  `code` varchar(32) NOT NULL NULL COMMENT '验证码',
  PRIMARY KEY (`id`),
  KEY `verify_code.mobile-code` (`mobile`, `code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='验证码表';

CREATE TABLE `feeds` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Feed ID',
  `gmt_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '修改时间',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户 ID',
  `user_name` varchar(255) NOT NULL COMMENT '用户名',
  `lng` decimal(20,17) DEFAULT NULL COMMENT '经度',
  `lat` decimal(20,17) DEFAULT NULL COMMENT '纬度',
  `location` varchar(255) DEFAULT NULL COMMENT '其他地理位置信息',
  `pic` longtext NOT NULL COMMENT '图片地址',
  `content` varchar(255) DEFAULT NULL COMMENT '文字内容',
  `score` int(10) NOT NULL DEFAULT 0 COMMENT '评分',
  PRIMARY KEY (`id`),
  KEY `feeds.user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Feed 表';

CREATE TABLE `feeds_score` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `gmt_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '修改时间',
  `feed_id` bigint(20) unsigned NOT NULL COMMENT 'Feed ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户 ID',
  `user_name` varchar(255) NOT NULL COMMENT '用户名',
  `score` int(10) NOT NULL DEFAULT 0 COMMENT '评分',
  PRIMARY KEY (`id`),
  UNIQUE KEY `feeds_score.feed_id-user_id` (`feed_id`, `user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Feed 评分表';

CREATE TABLE `comments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '评论 ID',
  `gmt_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '修改时间',
  `feed_id` bigint(20) unsigned NOT NULL COMMENT 'Feed ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '用户 ID',
  `content` varchar(255) NOT NULL COMMENT '文字内容',
  PRIMARY KEY (`id`),
  KEY `comments.feed_id` (`feed_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='评论表';
