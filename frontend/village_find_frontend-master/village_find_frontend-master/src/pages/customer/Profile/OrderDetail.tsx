import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { FaChevronLeft } from 'react-icons/fa6';
import { ImAlarm } from "react-icons/im";
import clsx from 'clsx';

import { Container } from '@/components/layout/customer';
import { Switch } from '@/components/forms';
import { HttpService } from '@/services';
import { SERVER_URL } from '@/config/global';

import styles from './OrderDetail.module.scss';

interface IOrder {
	orderID: string;
	vendorID: {
		business: {
			name: string;
		};
		images?: {
			logoUrl: string;
		}
	},
	product: {
		name: string;
		price: number;
		quantity: number;
		subtotal: number;
		soldByUnit: string;
		image: string;
	};
	subscription?: {
	};
	shipping?: {
		fee: number
	};
	delivery?: {
		fee: number;
	};
	deliveryType: string;
	deliveryInfo: {
		address: string;
	};
	locationInfo?: {
		instruction: string;
		name: string;
		address: string;
		pickDate: string;
		pickTime: string;
	};
	orderDate: string;
}

const initialOrder: IOrder = {
	orderID: '',
	vendorID: {
		business: {
			name: ''
		}
	},
	product: {
		name: '',
		price: 0,
		quantity: 0,
		subtotal: 0,
		soldByUnit: 'cnt',
		image: ''
	},
	deliveryType: '',
	deliveryInfo: {
		address: ''
	},
	orderDate: ''
};

const formatLocalDate = (date: string | Date) => {
	return new Date(date).toLocaleString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

const PICKUP_LOCATION_STEPS = ['Order Received', 'Weight & Price Confirmation', 'Ready for Pickup', 'Completed'];
const PROFILE_PATH = '/profile';

export function OrderDetail() {
	const navigate = useNavigate();
	const { id: orderID } = useParams();

	const [order, setOrder] = useState<IOrder>(initialOrder);

	useEffect(() => {
		if (orderID) {
			HttpService.get(`/order/customer/${orderID}`).then(response => {
				setOrder(response);
			})
		}
	}, [orderID]);

	return <Container className={styles.root}>
		<div className={styles.header}>
			<div className={styles.back}>
				<span onClick={() => navigate(PROFILE_PATH)}><FaChevronLeft /></span>
				<p>Back</p>
			</div>
		</div>
		<div className={styles.main}>
			<p className={styles.heading}>My Order</p>
			<div className={styles.mycart}>
				{
					order.deliveryType === 'Pickup Location' && <div className={styles.location}>
						<p className={styles.title}>Order Status</p>
						<div className={styles.step}>
							{PICKUP_LOCATION_STEPS.map((step: string, index: number) =>
								<div key={index} className={styles.item}>
									<span className={clsx({ [styles.active]: index === 0, [styles.first]: index === 0 })}>{index + 1}</span>
									<p>
										{index === 0
											? `${step} ${formatLocalDate(order.orderDate)}`
											: step}
									</p>
								</div>
							)}
						</div>
					</div>
				}
				<div className={styles.basicInfo}>
					<div className={styles.vendor}>
						<div className={styles.logo}>
							<img src={`${SERVER_URL}/${order.vendorID.images?.logoUrl}`} alt="Vendor logo" />
						</div>
						<div>
							<p className={styles.title}>{order.vendorID.business.name}</p>
							<p>
								Order ID: <span>{order.orderID}</span>
							</p>
						</div>
					</div>
					<div>
						<p className={styles.title}>Ordered on</p>
						<p>{formatLocalDate(order.orderDate)}</p>
					</div>
					<div>
						<p className={styles.title}>Delivery Type</p>
						<p>{order.deliveryType}</p>
					</div>
					<div>
						<p className={styles.title}>Order Total</p>
						<p>${order.product.subtotal}</p>
					</div>
				</div>
				<div className={styles.detail}>
					{order.deliveryType === 'Shipping' && <div className={styles.shipping}>
						<p><span>Tracking Number: </span></p>
						<p><span>Shipping Address: </span>{order.deliveryInfo.address}</p>
						<div className={styles.divider}></div>
					</div>}
					<div className={styles.product}>
						<img src={`${SERVER_URL}/${order.product.image}`} alt="Product image" />
						<div className={styles.cartInfo}>
							<div className={styles.heading}>
								<p className={styles.title}>{order.product.name}</p>
								<p className={styles.unitPrice}>
									Minimum 1 Bunch at ${order.product.price}/{order.product.soldByUnit}
								</p>
							</div>
						</div>
						<div className={styles.count}>
							<div><p>{order.product.quantity}/{order.product.soldByUnit}</p></div>
						</div>
						<div className={styles.totalPrice}>
							<p className={styles.title}>Price</p>
							<p className={styles.price}>${order.product.price * order.product.quantity}</p>
						</div>
					</div>
					<div className={styles.subtotal}>
						<p className={styles.title}>
							{
								order.deliveryType === 'Pickup Location'
									? 'Vendors Near Me Order Details'
									: 'Subtotal'
							}
						</p>
						<div className={styles.divider}></div>
						<div className={styles.detail}>
							{order.deliveryType === 'Pickup Location' && <div className={styles.pickuplocation}>
								<p className={styles.title}>Pickup Location</p>
								<p className={styles.instruction}>
									<span>Instructions:</span> {order.locationInfo?.instruction}
								</p>
								<div className={styles.control}>
									<FaMapMarkerAlt />
									<div className={styles.location}>
										<p>{order.locationInfo?.name}</p>
										<p className={styles.address}>{order.locationInfo?.address}</p>
									</div>
								</div>
								<div className={styles.control}>
									<FaRegCalendarAlt />
									<p>Pickup Date: {formatLocalDate(order.locationInfo?.pickDate || '')}</p>
								</div>
								<div className={styles.control}>
									<ImAlarm />
									<p>Pickup between: {order.locationInfo?.pickTime}</p>
								</div>
							</div>}
							<div className={styles.summary}>
								<div className={styles.row}>
									<p className={styles.name}>Subtotal</p>
									<p className={styles.spent}>${order.product.subtotal}</p>
								</div>
								<div className={styles.divider}></div>
								<div className={styles.row}>
									<p className={styles.name}>Tax</p>
									<p className={styles.spent}>${order.product.subtotal}</p>
								</div>
								<div className={styles.row}>
									<p className={styles.name}>{order.deliveryType === 'Shipping' ? 'Shipping' : 'Delivery'} Fee</p>
									<p className={styles.spent}>${order.deliveryType === 'Shipping'
										? order.shipping?.fee || 0 : order.delivery?.fee || 0}</p>
								</div>
								<div className={styles.divider}></div>
								<div className={clsx(styles.row, styles.total)}>
									<p className={styles.name}>Total</p>
									<p className={styles.spent}>
										${order.product.subtotal +
											(order.deliveryType === 'Shipping'
												? order.shipping?.fee || 0
												: order.delivery?.fee || 0)}
									</p>
								</div>
							</div>
						</div>
					</div>
					{order.subscription && <div className={styles.subscription}>
						<div className={styles.shipment}>
							<p className={styles.date}>Your next shipment date is on { }</p>
							<p className={styles.charge}>You will be charged for the item + shipping.</p>
						</div>
						<div className={styles.actions}>
							<div className={styles.pause}>
								<p>Pause my Subscription</p>
								<Switch value={true} />
							</div>
							<button className={styles.cancelBtn}>
								Cancel Subscription
							</button>
						</div>
					</div>}
				</div>
			</div>
		</div>
	</Container >
}