import { useEffect, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6'

import { Select } from '@/components/forms'
import { OrderItem } from '@/components/customer/Profile';

import styles from './Orders.module.scss'
import { HttpService } from '@/services';

export interface IOrderItem {
	_id: string;
	vendor: {
		_id?: string;
		business: {
			name: string;
		};
		images?: {
			logoUrl: string;
		};
	};
	product: {
		subtotal: number;
	};
	deliveryType: string;
	orderID: string;
	status: string;
};

interface IOrder {
	orderDate: string | Date;
	completedDate?: string;
	orderItems: IOrderItem[];
}

const rangeOpts = [
	{ name: 'Last 30 days', value: '30-days' },
	{ name: 'Last 6 months', value: '6-month' },
	{ name: '2023', value: '2023' },
	{ name: '2022', value: '2022' },
	{ name: '2021', value: '2021' }
];

const initialOrders: IOrder[] = [
	{
		orderDate: new Date(),
		orderItems: [
			{
				_id: '1',
				orderID: '2983',
				vendor: {
					_id: '1',
					business: {
						name: "Jan's Amazing Bracelets"
					}
				},
				deliveryType: 'Shipping',
				product: {
					subtotal: 22.95
				},
				status: 'pending'
			}
		]
	}
];

const formatDate = (date: string | Date) => {
	return new Date(date).toLocaleString('en-US', {
		month: 'long',
		year: 'numeric',
		day: 'numeric'
	});
}

const getSubtotal = (items: IOrderItem[]) => {
	return items.reduce((tot: number, item: IOrderItem) => tot + item.product.subtotal || 0, 0);
}

export function Orders() {
	const [range, setRange] = useState(rangeOpts[0].value);
	const [orders, setOrders] = useState<IOrder[]>(initialOrders);

	useEffect(() => {
		HttpService.get('/order/customer').then(response => {
			setOrders(response || []);
		});
	}, []);

	return <div className={styles.root}>
		<div className={styles.sidebar}>
			<p className={styles.header}>Current Orders</p>
			<p className={styles.description}>
				The small numbered bubble indicates if you have a current order present.
			</p>
			<div className={styles.status}>
				<p>My Orders</p>
				<span>{orders.length}</span>
			</div>
		</div>
		<div className={styles.divider}></div>
		<div className={styles.main}>
			<div className={styles.toolbar}>
				<div className={styles.search}>
					<input type="text" placeholder='Search for an order' />
					<span><FaMagnifyingGlass /></span>
				</div>
				<div className={styles.range}>
					<p>
						<span>{orders.length} orders</span> placed in
					</p>
					<Select
						placeholder=''
						options={rangeOpts}
						value={range}
						updateValue={setRange}
						className={styles.rangeSelect}
					/>
				</div>
			</div>
			<div className={styles.orders}>
				{
					orders.map((order: IOrder, index: number) =>
						<div key={index} className={styles.order}>
							<div className={styles.header}>
								<div className={styles.caption}>
									<p className={styles.title}>Order Placed</p>
									<p className={styles.time}>{formatDate(order.orderDate)}</p>
								</div>
								<div className={styles.spent}>
									<p className={styles.title}>Total</p>
									<p className={styles.money}>${getSubtotal(order.orderItems)}</p>
								</div>
							</div>
							<div className={styles.body}>
								{order.orderItems.map((orderItem: IOrderItem, index: number) =>
									<OrderItem key={index} {...orderItem} />
								)}
							</div>
						</div>
					)
				}
			</div>
		</div>
	</div>
}