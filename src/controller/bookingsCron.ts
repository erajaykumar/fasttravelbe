import Booking from '../models/booking';
import cronJob, { ScheduledTask } from 'node-cron';
import { Types } from 'mongoose';
import { bookingStatusEnum } from '../common/enums';
import { Kafka } from 'kafkajs';

const kafka: Kafka = new Kafka({
	clientId: 'fasttravel',
	brokers: ['localhost:9092'],
});

const producer = kafka.producer();

let task: ScheduledTask;

const updateBookings = async () => {
	try {
		//Find all the bookings where status is IN_PROGRESS and scheduledCompletionTime as passed
		const bookings = await Booking.find(
			{
				status: bookingStatusEnum.IN_PROGRESS,
				scheduledCompletionTime: { $lte: new Date() },
			},
			['bookingId']
		);

		if (bookings.length > 0) {
			await producer.send({
				topic: 'expired_bookings',
				messages: [{ value: JSON.stringify(bookings) }],
			});
		}
	} catch (error: any) {
		console.log('This is cron error', error.message);
	}
};

const cron = {
	async init() {
		console.log('Cron job initiated');
		await producer.connect();
		task = cronJob.schedule(
			'0 */2 * * * *',
			function () {
				updateBookings();
			},
			{
				runOnInit: true,
			}
		);
		this.start();
	},
	start(): void {
		task?.start();
	},
	stop(): void {
		task?.stop();
	},
};

export default cron;
