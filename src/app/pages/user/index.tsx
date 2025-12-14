'use client';

import { useState } from 'react';
import { useRequest } from 'ahooks';
import { Typography } from 'antd';
// import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';

const { Title } = Typography;

export default function UserPage() {
  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>
        User Management
      </Title>
    </div>
  );
}
