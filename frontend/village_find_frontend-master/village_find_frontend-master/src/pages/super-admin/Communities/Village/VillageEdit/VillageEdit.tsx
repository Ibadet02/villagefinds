import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import clsx from 'clsx';

import { Card, Input, TableBody } from '@/components';
import { HttpService } from '@/services';
import { ChangeInputEvent, ITableColumn } from '@/interfaces';
import { formatDate, getBubbleObject, useOnClickOutside } from '@/utils';

import styles from './VillageEdit.module.scss';

type PayStatus = 'Paid' | 'Unpaid';

export interface IVendor {
  _id: string;
  business?: {
    name: string;
    owner: string;
    email: string;
    phone: string;
  };
  isLeader?: boolean;
}

export interface ICommunity {
  name: string;
  email: string;
  password: string;
  code: string;
  organizer: {
    firstName: string;
    lastName: string;
  };
  vendors: IVendor[]
}

export interface ICommission {
  date: Date;
  total: number;
  status: PayStatus;
}

export interface IStatis {
  count: number;
  total: number;
}

const initialCommunity: ICommunity = {
  name: '',
  email: '',
  password: '',
  code: '',
  organizer: {
    firstName: '',
    lastName: '',
  },
  vendors: []
};

const commissionTableColumns: ITableColumn[] = [
  {
    title: 'Commission Date',
    name: 'date',
    width: 350,
    cell: (row: any) => <span>{formatDate(row.date)}</span>,
  },
  {
    title: 'Total Earned',
    name: 'total',
    width: 450,
    cell: (row: any) => <span>${row.total.toFixed(2)}</span>,
  },
  {
    title: 'Status',
    name: 'status',
    width: 150,
    cell: (row: any) => (
      <span
        className={clsx(
          styles.statusSpan,
          row.status === 'Paid' ? styles.paid : styles.unpaid,
        )}
      >
        {row.status}
      </span>
    ),
  },
];

const VILLAGE_PATH = '/admin/community/village';

const isVendorSearchable = (search: string, vendor: IVendor) => {
  return vendor.business?.name.includes(search)
    || vendor.business?.owner.includes(search)
    || vendor.business?.email.includes(search)
    || vendor.business?.phone.includes(search);
}

export function VillageEdit() {
  const navigate = useNavigate();
  const { id: communityId } = useParams();

  const [community, setCommunity] = useState<ICommunity>(initialCommunity);
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [commissions, setCommissions] = useState<ICommission[]>([]);
  const [vendorFilter, setVendorFilter] = useState('');
  const [isAssociation, setIsAssociation] = useState(false);

  const associateRef = useRef<HTMLUListElement>(null);

  const onCommunityChange = (e: any) => {
    setCommunity(getBubbleObject(e.target.name, community, e.target.value));
  };

  const onUpdateClick = () => {
    if (!!communityId === false) return;
    if (communityId === 'create') {
      HttpService.post('/communities', community).then(response => {
        if (response) {
          enqueueSnackbar(`${community.name} community added successfully!`, {
            variant: 'success',
          });
          navigate(VILLAGE_PATH);
        }
      });
    } else {
      const reqJson: any = { ...community };
      const leaderVendor = vendors.find(item => item.isLeader);
      if (leaderVendor) {
        reqJson.leader = leaderVendor._id;
        const ownerName = leaderVendor.business?.owner.split(' ') || [];
        reqJson.organizer = { firstName: ownerName[0] || '', lastName: ownerName[1] || '' };
        reqJson.email = leaderVendor.business?.email || '';
        reqJson.phone = leaderVendor.business?.phone || '';
      }
      HttpService.put(`/communities/${communityId}`, reqJson).then(
        response => {
          const { status } = response;
          if (status === 200) {
            enqueueSnackbar(
              `${community.name} community updated successfully!`,
              {
                variant: 'success',
              },
            );
            navigate(VILLAGE_PATH);
          }
        },
      );
    }
  };

  const onVendorToggle = (id: string) => () => {
    setVendors(vendors.map(item => item._id === id ? ({ ...item, isLeader: !item.isLeader }) : ({ ...item, isLeader: false })));
  }

  useEffect(() => {
    if (!!communityId === false || communityId === 'create') return;
    HttpService.get(`/communities/${communityId}`).then(response => {
      const { status, community } = response;
      if (status === 200) {
        setCommunity({ ...community, password: '' });
      } else {
        enqueueSnackbar('Community not found.', { variant: 'warning' });
      }
    });
    HttpService.get('/commissions', { community: communityId }).then(response => {
      const { commissions, total } = response;
    })
  }, [communityId]);

  useEffect(() => {
    const vendors = community.vendors || [];
    setVendors(vendors.filter(item => isVendorSearchable(vendorFilter, item)))
  }, [community.vendors, vendorFilter]);

  useOnClickOutside(associateRef, () => setIsAssociation(false), 'mouseup');

  return (
    <div className={styles.root}>
      <button
        className={styles.backButton}
        onClick={() => navigate(VILLAGE_PATH)}
      >
        Back
      </button>
      <Card title="Village Community" className={styles.communitySection}>
        <div className={styles.container}>
          <div className={styles.control}>
            <p className={styles.label}>Associated with an existing vendor</p>
            <Input
              placeholder="Search Vendor Name, Email, Phone"
              value={vendorFilter}
              updateValue={(e: ChangeInputEvent) => setVendorFilter(e.target.value)}
              onClick={() => setIsAssociation(true)}
            />
            {isAssociation && <ul ref={associateRef}>
              {
                vendors.map((item, index) =>
                  <li
                    key={index}
                    onClick={onVendorToggle(item._id)}
                  >
                    <p>{item.business?.owner} at <span>{item.business?.name}</span></p>
                    <span className={clsx({ [styles.leader]: item.isLeader })}>
                      {item.isLeader ? 'Community Leader' : 'Vendor'}
                    </span>
                  </li>
                )
              }
            </ul>}
          </div>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p className={styles.label}>Village Name</p>
              <Input
                name="name"
                placeholder="Village Name"
                value={community.name}
                updateValue={onCommunityChange}
              />
            </div>
            <div className={styles.control}>
              <p className={styles.label}>Password</p>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={community.password}
                updateValue={onCommunityChange}
              />
            </div>
          </div>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p className={styles.label}>Organizer First Name</p>
              <Input
                name="organizer.firstName"
                placeholder="First Name"
                value={community.organizer && community.organizer.firstName}
                updateValue={onCommunityChange}
              />
            </div>
            <div className={styles.control}>
              <p className={styles.label}>Email</p>
              <Input
                name="email"
                placeholder="Email"
                value={community.email}
                updateValue={onCommunityChange}
              />
            </div>
          </div>
          <div className={styles.horizon}>
            <div className={styles.control}>
              <p className={styles.label}>Organizer Last Name</p>
              <Input
                name="organizer.lastName"
                placeholder="Last Name"
                value={community.organizer && community.organizer.lastName}
                updateValue={onCommunityChange}
              />
            </div>

            <div className={styles.control}>
              <p className={styles.label}>Code</p>
              <Input
                name="code"
                placeholder="Code"
                value={community.code}
                updateValue={onCommunityChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.buttonBar}>
          <button
            className={styles.cancelButton}
            onClick={() => navigate(VILLAGE_PATH)}
          >
            Cancel
          </button>
          <button className={styles.addButton} onClick={onUpdateClick}>
            {communityId === 'create' ? 'Add' : 'Update'}
          </button>
        </div>
      </Card >
      {communityId !== 'create' && (
        <div className={styles.statisSection}>
          <Card className={styles.subStatis}>
            <p>Vendor Count</p>
            <p>{(community.vendors || []).length}</p>
          </Card>
          <Card className={styles.subStatis}>
            <p>Total Commission</p>
            <p>$0</p>
          </Card>
        </div>
      )}
      {
        communityId !== 'create' && (
          <Card title="Commission">
            <TableBody
              columns={commissionTableColumns}
              rows={commissions}
            />
          </Card>
        )
      }
    </div >
  );
}
