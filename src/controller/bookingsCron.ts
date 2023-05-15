import Booking from '../models/booking';
import cronJob, { ScheduledTask } from 'node-cron';
import { Types } from 'mongoose';
import { bookingStatusEnum } from '../common/enums';

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
      for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i];
        await Booking.updateOne(
          {
            bookingId: booking.bookingId,
          },
          { status: bookingStatusEnum.COMPLETED, completedAt: new Date() }
        );
      }
    }
  } catch (error: any) {
    console.log('This is cron error', error.message);
  }
};

const cron = {
  async init() {
    console.log('Cron job initiated');
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
