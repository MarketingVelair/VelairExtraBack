import prisma from '@/config/prisma';
import SyncBasedService, { DataToSync } from '@/utils/SyncbasedService';


const sync = new SyncBasedService({
    flight: {
        table: prisma.flight,
        editableFields: ['title', 'from_datetime', 'to_datetime', 'flightTime', 'aircraftId', 'aircraft', 'instructorId', 'instructor', 'isConfirmed', 'isCanceled', 'cancelReason', 'flightType', 'canceledBy'],
        relationIncludes: ['aircraft', 'instructor']
    },
}, [
    'flight',
]);


export const getAllUnsyced = async (lastSync?: Date, filters: any = {}) => {
    const results = sync.getAllUnsyced(lastSync, filters);
    return results;
};


export const pushToSync = async (dataToSync: DataToSync) => {
    const results = sync.pushToSync(dataToSync);
    return results;
}
