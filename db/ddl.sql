CREATE TABLE `feeds` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Feed ID',
  `gmt_create` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  `gmt_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `content` varchar(255) NOT NULL COMMENT 'Feed 内容',
  `user_nick` varchar(255) DEFAULT NULL COMMENT '用户昵称',
  `user_info` varchar(255) DEFAULT NULL COMMENT '用户信息',
  `lng` decimal(20,17) NOT NULL COMMENT '经度',
  `lat` decimal(20,17) NOT NULL COMMENT '纬度',
  `geo_info` varchar(255) DEFAULT NULL COMMENT '其他地理位置信息',
  PRIMARY KEY (`id`),
  KEY `feeds.lng-lat-gmt_create` (`lng`,`lat`,`gmt_create`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Feed 表';
