import * as functions from 'firebase-functions';
import { db } from './config';

//This function ensures that each task is idempotent
export const executeOnce = (
	change: functions.Change<functions.firestore.DocumentSnapshot>,
	context: functions.EventContext,
	task: { (transaction: FirebaseFirestore.Transaction): void }
) => {
	//before executing transaction, check database to make sure that the event has not already been processed
	const eventRef = db.collection('events').doc(context.eventId);

	return db.runTransaction((transaction) =>
		transaction
			.get(eventRef)
			.then((documentSnapshot) =>
				documentSnapshot.exists ? null : task(transaction)
			)
			.then(() => transaction.set(eventRef, { processed: true }))
	);
};
